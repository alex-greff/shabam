from typing import Optional
import typer
import os.path
from scipy.io import wavfile
from scipy import signal
import numpy as np
import nptyping as npt
from pathlib import Path
import modules.initialization as initialization
import modules.visualization as visualization
import modules.fingerprint as fingerprint
import modules.metrics as metrics
import modules.cache as cache
from modules.formatting import BULLET, HEAD_STYLE, BOLD_STYLE, NORMAL_STYLE, DIM_STYLE, DEBUG_STYLE
import modules.config as config
from colorama import init as init_colorama
from typing_extensions import Annotated

if config.DEBUGGER:
  # Source: https://stackoverflow.com/a/70433884
  import debugpy
  # 5678 is the default attach port in the VS Code debug configurations.
  # Unless a host and port are specified, host defaults to 127.0.0.1
  debugpy.listen(5678)
  print(f"{DEBUG_STYLE}Waiting for debugger attach")
  debugpy.wait_for_client()

init_colorama()

app = typer.Typer()

# Terminology
# bins: y axis of spectrogram (== FFT_SIZE/2)
# window: x axis of spectrogram and fingerprint


@app.command()
def add(
    track_id: Annotated[str, typer.Argument(help="The identifier of the track")],
    track_filepath: Annotated[str, typer.Argument(
        help="Path to the track's wav file")],
    use_cache: Annotated[bool, typer.Option(
        help="Load cached data, if it exists")] = False
):
  """
  Adds a track to the database.
  """
  metrics.start("audio_load", "Loading audio file")

  if not os.path.isfile(track_filepath):
    print(f"File '{track_filepath}' is not a file")
    exit(1)

  track_title = Path(track_filepath).stem

  sample_rate, data = wavfile.read(track_filepath)
  metrics.end("audio_load")

  metrics.start("mono_compute", "Computing mono data")
  data_mono = data.mean(axis=1)
  num_samples = len(data_mono)
  duration = num_samples / sample_rate  # seconds
  metrics.end("mono_compute")

  # Save mono wav file
  mono_filepath = f"{config.VERBOSE_DIR}/{track_title}_mono.wav"
  if config.VERBOSE:
    wavfile.write(mono_filepath, sample_rate, data_mono.astype(np.int16))

  metrics.start("downsample_compute", "Downsampling audio data")
  ds_data = signal.decimate(data_mono, config.DOWNSAMPLE_FACTOR)
  ds_sample_rate = int(sample_rate / config.DOWNSAMPLE_FACTOR)
  metrics.end("downsample_compute")

  # Save downsampled wav file
  ds_filepath = f"{config.VERBOSE_DIR}/{track_title}_ds.wav"
  if config.VERBOSE:
    wavfile.write(ds_filepath, ds_sample_rate, ds_data.astype(np.int16))

  timedomain_filepath = f"{config.VERBOSE_DIR}/{track_title}_timedomain.png"
  if config.VERBOSE:
    visualization.graph_timedomain(
        duration,
        data_mono,
        ds_data,
        timedomain_filepath,
        f"{track_title} Time Domain"
    )

  if config.VERBOSE:
    print(f"{HEAD_STYLE}Audio file stats:")
    print(f"  {BULLET}{NORMAL_STYLE} Mono audio filepath: {DIM_STYLE}{mono_filepath}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Downsampled audio filepath: {DIM_STYLE}{ds_filepath}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Timedomain filepath: {DIM_STYLE}{timedomain_filepath}")
    print(f"  {BULLET}{NORMAL_STYLE} Sample rate: {BOLD_STYLE}{sample_rate:,}Hz")
    print(f"  {BULLET}{NORMAL_STYLE} Number of samples: {BOLD_STYLE}{num_samples:,}")
    print(f"  {BULLET}{NORMAL_STYLE} Duration: {BOLD_STYLE}{round(duration, 2)}s")

  metrics.start("spectrogram_compute", "Computing full spectrogram")
  _, _, Sxx = signal.spectrogram(data_mono, sample_rate, nfft=config.FFT_SIZE)
  Sxx: npt.NDArray = Sxx[:-1, :]
  metrics.end("spectrogram_compute")

  # g_std = 12  # standard deviation for Gaussian window in samples
  # # win = windows.gaussian(20, std=g_std, sym=True)  # symmetric Gaussian wind.
  # win = windows.tukey(1024)
  # SFT = signal.ShortTimeFFT(win, hop=256, fs=1/sample_rate, mfft=config.FFT_SIZE, scale_to='psd')
  # Sxx = SFT.spectrogram(data_mono)  # calculate absolute square of STFT

  # print(f"win {win}")
  # print(f"data_mono.shape {data_mono.shape}") # TODO: remove
  # print(f"Sxx.shape {Sxx.shape}") # TODO: remove

  spectrogram_filepath = f"{config.VERBOSE_DIR}/{track_title}_mono_freqdomain.png"
  if config.VERBOSE:
    visualization.graph_spectrogram(
        Sxx,
        sample_rate,
        duration,
        spectrogram_filepath,
        f"{track_title} Mono Frequency Domain",
    )

  if config.VERBOSE:
    print(f"\n{HEAD_STYLE}Full sampled spectrogram stats:")
    print(
        f"  {BULLET}{NORMAL_STYLE} Visualization: {DIM_STYLE}{spectrogram_filepath}")
    print(f"  {BULLET}{NORMAL_STYLE} Sample rate: {BOLD_STYLE}{sample_rate:,}Hz")
    print(f"  {BULLET}{NORMAL_STYLE} FFT size: {BOLD_STYLE}{config.FFT_SIZE:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of bins (y axis): {BOLD_STYLE}{Sxx.shape[0]:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of windows (x axis): {BOLD_STYLE}{Sxx.shape[1]:,}")

  metrics.start("ds_spectrogram_compute", "Computing downsampled spectrogram")
  _, _, Sxx_ds = signal.spectrogram(
      ds_data, ds_sample_rate, nfft=config.FFT_SIZE)
  Sxx_ds: npt.NDArray = Sxx_ds[:-1, :]
  metrics.end("ds_spectrogram_compute")

  metrics.start("partition_ranges_compute", "Computing partition ranges")
  partition_ranges = fingerprint.get_partition_ranges(
      config.NUM_PARTITIONS, config.FFT_SIZE / 2, config.PARTITION_TENSION)
  metrics.end("partition_ranges_compute")

  spectrogram_ds_filepath = f"{config.VERBOSE_DIR}/{track_title}_ds_freqdomain.png"
  if config.VERBOSE:
    visualization.graph_spectrogram(
        Sxx_ds,
        ds_sample_rate,
        duration,
        spectrogram_ds_filepath,
        f"{track_title} Downsampled Frequency Domain",
        partition_ranges
    )

  if config.VERBOSE:
    print(f"\n{HEAD_STYLE}Downsampled spectrogram stats:")
    print(
        f"  {BULLET}{NORMAL_STYLE} Visualization: {DIM_STYLE}{spectrogram_ds_filepath}")
    print(f"  {BULLET}{NORMAL_STYLE} Sample rate: {BOLD_STYLE}{ds_sample_rate:,}Hz")
    print(f"  {BULLET}{NORMAL_STYLE} FFT size: {BOLD_STYLE}{config.FFT_SIZE:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of bins (y axis): {BOLD_STYLE}{Sxx_ds.shape[0]:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of windows (x axis): {BOLD_STYLE}{Sxx_ds.shape[1]:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Partition ranges: {BOLD_STYLE}{partition_ranges}")

  fp_cached: Optional[npt.NDArray] = cache.load(
      f"{track_id}.fp") if use_cache else None
  metrics.start("fingerprint_compute", "Computing fingerprint")
  fp = fp_cached if fp_cached is not None else fingerprint.compute_fingerprint(
      Sxx_ds.T, partition_ranges)
  metrics.end("fingerprint_compute",
              suffix="cached" if fp_cached is not None else None)

  if fp_cached is None:
    cache.save(f"{track_id}.fp", fp)

  fingerprint_filepath = f"{config.VERBOSE_DIR}/{track_title}_fp.png"
  if config.VERBOSE:
    visualization.graph_fingerprint(
        fp,
        ds_sample_rate,
        Sxx_ds.shape[0],
        duration,
        fingerprint_filepath,
        f"{track_title} Fingerprint",
        partition_ranges
    )

  # TODO: compute records


@app.command()
def search(recording_filepath: str):
  print(f"TODO: search track {recording_filepath}")


if __name__ == "__main__":
  initialization.setup_dirs()
  app()
