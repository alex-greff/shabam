import typer
import os.path
from scipy.io import wavfile
from scipy import signal
from scipy.signal import windows
import numpy as np
import nptyping as npt
from pathlib import Path
import modules.initialization as initialization
import modules.visualization as visualization
import modules.fingerprint as fingerprint
from modules.formatting import BULLET, HEAD_STYLE, BOLD_STYLE, NORMAL_STYLE, DIM_STYLE
import modules.config as config
from colorama import init as init_colorama

init_colorama()

app = typer.Typer()

# Terminology
# bins: y axis of spectrogram (== FFT_SIZE/2)
# window: x axis of spectrogram and fingerprint


@app.command()
def add(track_filepath: str):
  if not os.path.isfile(track_filepath):
    print(f"File '{track_filepath}' is not a file")
    exit(1)

  track_title = Path(track_filepath).stem

  sample_rate, data = wavfile.read(track_filepath)
  data_mono = data.mean(axis=1)
  num_samples = len(data_mono)
  duration = num_samples / sample_rate  # seconds

  # Save mono wav file
  mono_filepath = f"{config.DEBUG_DIR}/{track_title}_mono.wav"
  if config.DEBUG:
    wavfile.write(mono_filepath, sample_rate, data_mono.astype(np.int16))

  ds_data = signal.decimate(data_mono, config.DOWNSAMPLE_FACTOR)
  ds_sample_rate = int(sample_rate / config.DOWNSAMPLE_FACTOR)

  # Save downsampled wav file
  ds_filepath = f"{config.DEBUG_DIR}/{track_title}_ds.wav"
  if config.DEBUG:
    wavfile.write(ds_filepath, ds_sample_rate, ds_data.astype(np.int16))

  timedomain_filepath = f"{config.DEBUG_DIR}/{track_title}_timedomain.png"
  if config.DEBUG:
    visualization.graph_timedomain(
        duration,
        data_mono,
        ds_data,
        timedomain_filepath,
        f"{track_title} Time Domain"
    )

  if config.DEBUG:
    print(f"{HEAD_STYLE}Audio file stats:")
    print(f"  {BULLET}{NORMAL_STYLE} Mono audio filepath: {DIM_STYLE}{mono_filepath}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Downsampled audio filepath: {DIM_STYLE}{ds_filepath}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Timedomain filepath: {DIM_STYLE}{timedomain_filepath}")
    print(f"  {BULLET}{NORMAL_STYLE} Sample rate: {BOLD_STYLE}{sample_rate:,}Hz")
    print(f"  {BULLET}{NORMAL_STYLE} Number of samples: {BOLD_STYLE}{num_samples:,}")
    print(f"  {BULLET}{NORMAL_STYLE} Duration: {BOLD_STYLE}{round(duration, 2)}s")

  _, _, Sxx = signal.spectrogram(data_mono, sample_rate, nfft=config.FFT_SIZE)
  Sxx: npt.NDArray = Sxx[:-1, :]

  # g_std = 12  # standard deviation for Gaussian window in samples
  # # win = windows.gaussian(20, std=g_std, sym=True)  # symmetric Gaussian wind.
  # win = windows.tukey(1024)
  # SFT = signal.ShortTimeFFT(win, hop=256, fs=1/sample_rate, mfft=config.FFT_SIZE, scale_to='psd')
  # Sxx = SFT.spectrogram(data_mono)  # calculate absolute square of STFT

  # print(f"win {win}")
  # print(f"data_mono.shape {data_mono.shape}") # TODO: remove
  # print(f"Sxx.shape {Sxx.shape}") # TODO: remove

  spectrogram_filepath = f"{config.DEBUG_DIR}/{track_title}_mono_freqdomain.png"
  if config.DEBUG:
    visualization.graph_spectrogram(
        Sxx,
        sample_rate,
        duration,
        spectrogram_filepath,
        f"{track_title} Mono Frequency Domain",
    )

  if config.DEBUG:
    print(f"\n{HEAD_STYLE}Full sampled spectrogram stats:")
    print(
        f"  {BULLET}{NORMAL_STYLE} Visualization: {DIM_STYLE}{spectrogram_filepath}")
    print(f"  {BULLET}{NORMAL_STYLE} Sample rate: {BOLD_STYLE}{sample_rate:,}Hz")
    print(f"  {BULLET}{NORMAL_STYLE} FFT size: {BOLD_STYLE}{config.FFT_SIZE:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of bins (y axis): {BOLD_STYLE}{Sxx.shape[0]:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of windows (x axis): {BOLD_STYLE}{Sxx.shape[1]:,}")

  _, _, Sxx_ds = signal.spectrogram(
      ds_data, ds_sample_rate, nfft=config.FFT_SIZE)
  Sxx_ds: npt.NDArray = Sxx_ds[:-1, :]

  partition_ranges = fingerprint.get_partition_ranges(
      config.NUM_PARTITIONS, config.FFT_SIZE / 2, config.PARTITION_TENSION)

  spectrogram_ds_filepath = f"{config.DEBUG_DIR}/{track_title}_ds_freqdomain.png"
  if config.DEBUG:
    visualization.graph_spectrogram(
        Sxx_ds,
        ds_sample_rate,
        duration,
        spectrogram_ds_filepath,
        f"{track_title} Downsampled Frequency Domain",
        partition_ranges
    )

  if config.DEBUG:
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

  fp = fingerprint.compute_fingerprint(Sxx_ds.T, partition_ranges)

  fingerprint_filepath = f"{config.DEBUG_DIR}/{track_title}_fp.png"
  if config.DEBUG:
    visualization.graph_fingerprint(
        fp,
        ds_sample_rate,
        Sxx_ds.shape[0],
        duration,
        fingerprint_filepath,
        f"{track_title} Fingerprint",
        partition_ranges
    )


@app.command()
def search(recording_filepath: str):
  print(f"TODO: search track {recording_filepath}")


if __name__ == "__main__":
  initialization.setup_dirs()
  app()
