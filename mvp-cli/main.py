from typing import List, Optional, Tuple, Union
import typer
import os.path
from scipy.io import wavfile
from scipy import signal
import numpy as np
import nptyping as npt
from pathlib import Path
from modules import initialization, visualization, fingerprint, metrics, cache, records, search
from modules.formatting import BULLET, HEAD_STYLE, BOLD_STYLE, NORMAL_STYLE, DIM_STYLE, DEBUG_STYLE
import modules.config as config
from colorama import init as init_colorama
from typing_extensions import Annotated
import pprint

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


def _preprocess_audio(
    audio_filepath: str,
    title: str,
    debug_dir: str
):
  metrics.start("audio_load", "Loading audio file")

  if not os.path.isfile(audio_filepath):
    print(f"File '{audio_filepath}' is not a file")
    exit(1)

  sample_rate, data = wavfile.read(audio_filepath)
  sample_rate: int = sample_rate
  metrics.end("audio_load")

  metrics.start("mono_compute", "Computing mono data")
  data_mono: npt.NDArray = data.mean(axis=1)
  num_samples = len(data_mono)
  duration = num_samples / sample_rate  # seconds
  metrics.end("mono_compute")

  # Save mono wav file
  mono_filepath = f"{debug_dir}/{title}_mono.wav"
  if config.debug_output_data:
    metrics.start("write_mono_wav", "Writing mono .wav file")
    wavfile.write(mono_filepath, sample_rate, data_mono.astype(np.int16))
    metrics.end("write_mono_wav")

  metrics.start("downsample_compute", "Downsampling audio data")
  ds_data: npt.NDArray = signal.decimate(data_mono, config.DOWNSAMPLE_FACTOR)
  ds_sample_rate = int(sample_rate / config.DOWNSAMPLE_FACTOR)
  metrics.end("downsample_compute")

  # Save downsampled wav file
  ds_filepath = f"{debug_dir}/{title}_ds.wav"
  if config.debug_output_data:
    metrics.start("write_mono_wav", "Writing downsampled .wav file")
    wavfile.write(ds_filepath, ds_sample_rate, ds_data.astype(np.int16))
    metrics.end("write_mono_wav")

  timedomain_filepath = f"{debug_dir}/{title}_timedomain.png"
  if config.debug_output_data:
    metrics.start("graph_timedomain", "Graphing timedomain data")
    visualization.graph_timedomain(
        duration,
        data_mono,
        ds_data,
        timedomain_filepath,
        f"{title} Time Domain"
    )
    metrics.end("graph_timedomain")

  if config.debug_show_stats:
    print(f"{HEAD_STYLE}Audio file stats:")
    print(f"  {BULLET}{NORMAL_STYLE} Mono audio filepath: {DIM_STYLE}{mono_filepath}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Downsampled audio filepath: {DIM_STYLE}{ds_filepath}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Timedomain filepath: {DIM_STYLE}{timedomain_filepath}")
    print(f"  {BULLET}{NORMAL_STYLE} Sample rate: {BOLD_STYLE}{sample_rate:,}Hz")
    print(f"  {BULLET}{NORMAL_STYLE} Number of samples: {BOLD_STYLE}{num_samples:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Duration: {BOLD_STYLE}{round(duration, 2)}s", flush=True)

  return data_mono, sample_rate, duration, ds_data, ds_sample_rate


def _process_spectrogram(
    title: str,
    debug_dir: str,
    data_mono: npt.NDArray,
    sample_rate: int,
    duration: float,
    ds_data: npt.NDArray,
    ds_sample_rate: int
):
  metrics.start("spectrogram_compute", "Computing full spectrogram")
  _, _, Sxx = signal.spectrogram(data_mono, sample_rate, nfft=config.FFT_SIZE)
  Sxx: npt.NDArray = Sxx[:-1, :]
  metrics.end("spectrogram_compute")

  spectrogram_filepath = f"{debug_dir}/{title}_mono_freqdomain.png"
  if config.debug_output_data:
    metrics.start("graph_spectrogram", "Graphing mono spectrogram data")
    visualization.graph_spectrogram(
        Sxx,
        sample_rate,
        duration,
        spectrogram_filepath,
        f"{title} Mono Frequency Domain",
    )
    metrics.end("graph_spectrogram")

  if config.debug_output_data:
    print(f"\n{HEAD_STYLE}Full sampled spectrogram stats:")
    print(
        f"  {BULLET}{NORMAL_STYLE} Visualization: {DIM_STYLE}{spectrogram_filepath}")
    print(f"  {BULLET}{NORMAL_STYLE} Sample rate: {BOLD_STYLE}{sample_rate:,}Hz")
    print(f"  {BULLET}{NORMAL_STYLE} FFT size: {BOLD_STYLE}{config.FFT_SIZE:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of bins (y axis): {BOLD_STYLE}{Sxx.shape[0]:,}")
    print(
        f"  {BULLET}{NORMAL_STYLE} Number of windows (x axis): {BOLD_STYLE}{Sxx.shape[1]:,}", flush=True)

  metrics.start("ds_spectrogram_compute", "Computing downsampled spectrogram")
  _, _, Sxx_ds = signal.spectrogram(
      ds_data, ds_sample_rate, nfft=config.FFT_SIZE)
  Sxx_ds: npt.NDArray = Sxx_ds[:-1, :]
  metrics.end("ds_spectrogram_compute")

  metrics.start("partition_ranges_compute", "Computing partition ranges")
  partition_ranges = fingerprint.get_partition_ranges(
      config.NUM_PARTITIONS, config.FFT_SIZE / 2, config.PARTITION_TENSION)
  metrics.end("partition_ranges_compute")

  spectrogram_ds_filepath = f"{debug_dir}/{title}_ds_freqdomain.png"
  if config.debug_output_data:
    metrics.start("graph_ds_spectrogram",
                  "Graphing downsampled spectrogram data")
    visualization.graph_spectrogram(
        Sxx_ds,
        ds_sample_rate,
        duration,
        spectrogram_ds_filepath,
        f"{title} Downsampled Frequency Domain",
        partition_ranges
    )
    metrics.end("graph_ds_spectrogram")

  if config.debug_show_stats:
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
        f"  {BULLET}{NORMAL_STYLE} Partition ranges: {BOLD_STYLE}{partition_ranges}", flush=True)

  return Sxx_ds, partition_ranges


def _process_fingerprint(
    audio_id: int,
    title: str,
    debug_dir: str,
    use_cache: bool,
    cache_category: cache.CacheCategory,
    Sxx_ds: npt.NDArray,
    partition_ranges: List[fingerprint.PartitionRange],
    ds_sample_rate: int,
    duration: float,
):
  # --- Compute the fingerprint ---
  fp_cached: Optional[npt.NDArray] = cache.load(
      f"{audio_id}.fp", cache_category) if use_cache else None
  metrics.start("fp_compute", "Computing fingerprint")
  fp = fp_cached if fp_cached is not None else fingerprint.compute_fingerprint(
      Sxx_ds.T, partition_ranges)
  metrics.end("fp_compute",
              suffix="cached" if fp_cached is not None else None)

  if fp_cached is None:
    cache.save(f"{audio_id}.fp", cache_category, fp)

  fingerprint_filepath = f"{debug_dir}/{title}_fp.png"
  if config.debug_output_data:
    metrics.start("graph_fingerprint", "Graphing fingerprint")
    visualization.graph_fingerprint(
        fp,
        ds_sample_rate,
        Sxx_ds.shape[0],
        duration,
        fingerprint_filepath,
        f"{title} Fingerprint",
        partition_ranges
    )
    metrics.end("graph_fingerprint")

  # --- Compute the flattened fingerprint ---
  fp_flat_cached: Optional[npt.NDArray] = cache.load(
      f"{audio_id}.fp_flat", cache_category) if use_cache and fp_cached is not None else None
  metrics.start("fp_flatten", "Flattening fingerprint")
  fp_flat = fp_flat_cached if fp_flat_cached is not None else fingerprint.to_flat_fingerprint(
      fp)
  metrics.end("fp_flatten",
              suffix="cached" if fp_flat_cached is not None else None)

  if fp_flat_cached is None:
    cache.save(f"{audio_id}.fp_flat", cache_category, fp_flat)

  return fp_flat, fp_flat_cached


def _process_records_table(
    audio_id: Union[int, str],
    use_cache: bool,
    cache_category: cache.CacheCategory,
    fp_flat: npt.NDArray,
    fp_flat_cached: Union[npt.NDArray, None]
):
  # If we give a string audio ID, then we're computing the clip records table
  # and we don't care about the id part of the couple
  audio_int_id = audio_id if isinstance(audio_id, int) else 0

  rt_cached: Optional[records.RecordsTableEncoded] = (cache.load(
      f"{audio_id}.rt", cache_category, is_numpy=False)
      if use_cache and fp_flat_cached is not None else None)
  metrics.start("rt_compute", "Computing records table")
  rt = rt_cached if rt_cached is not None else records.compute_records_table(
      fp_flat, audio_int_id)
  metrics.end("rt_compute", suffix="cached" if rt_cached is not None else None)

  if rt_cached is None:
    cache.save(f"{audio_id}.rt", cache_category, rt, is_numpy=False)

  return rt


@app.command()
def add(
    track_id: Annotated[int, typer.Argument(help="The identifier of the track")],
    track_filepath: Annotated[str, typer.Argument(
        help="Path to the track's wav file")],
    use_cache: Annotated[bool, typer.Option(
        help="Load cached data, if it exists")] = False,
    debug_output_data: Annotated[bool, typer.Option(
        help="Output debug files including processed audio and visualization graphs")] = False,
    debug_show_stats: Annotated[bool, typer.Option(
        help="Show stats about the processed data")] = False,
    debug_show_metrics: Annotated[bool, typer.Option(
        help="Show metrics about all the processing steps being run")] = True
):
  """
  Adds a track to the database.
  """

  # Set runtime config values
  config.debug_output_data = debug_output_data
  config.debug_show_stats = debug_show_stats
  config.debug_show_metrics = debug_show_metrics

  track_title = Path(track_filepath).stem

  # ---------------------------
  # --- Audio preprocessing ---
  # ---------------------------

  data_mono, sample_rate, duration, ds_data, ds_sample_rate = _preprocess_audio(
      audio_filepath=track_filepath,
      title=track_title,
      debug_dir=config.DEBUG_TRACK_DIR
  )

  # -------------------------------
  # --- Compute the spectrogram ---
  # -------------------------------

  Sxx_ds, partition_ranges = _process_spectrogram(
      title=track_title,
      debug_dir=config.DEBUG_TRACK_DIR,
      data_mono=data_mono,
      sample_rate=sample_rate,
      duration=duration,
      ds_data=ds_data,
      ds_sample_rate=ds_sample_rate
  )

  # -------------------------------
  # --- Compute the fingerprint ---
  # -------------------------------

  fp_flat, fp_flat_cached = _process_fingerprint(
      audio_id=track_id,
      title=track_title,
      debug_dir=config.DEBUG_TRACK_DIR,
      use_cache=use_cache,
      cache_category="track",
      Sxx_ds=Sxx_ds,
      partition_ranges=partition_ranges,
      ds_sample_rate=ds_sample_rate,
      duration=duration
  )

  # ---------------------------------
  # --- Compute the records table ---
  # ---------------------------------

  rt = _process_records_table(
      audio_id=track_id,
      use_cache=use_cache,
      cache_category="track",
      fp_flat=fp_flat,
      fp_flat_cached=fp_flat_cached
  )

  # TODO: remove
  # rt_decoded = records.to_decoded_records_table(rt)
  # print("Records table:")
  # pprint.pp(rt_decoded)

  # search.search_track(rt)


@app.command("search")
def search_cmd(
    recording_filepath: Annotated[str, typer.Argument(
        help="Path to the recording's wav file")],
    use_cache: Annotated[bool, typer.Option(
        help="Load cached data, if it exists")] = False,
    debug_output_data: Annotated[bool, typer.Option(
        help="Output debug files including processed audio and visualization graphs")] = False,
    debug_show_stats: Annotated[bool, typer.Option(
        help="Show stats about the processed data")] = False,
    debug_show_metrics: Annotated[bool, typer.Option(
        help="Show metrics about all the processing steps being run")] = True
):
  """
  Searches for a track.
  """

  # Set runtime config values
  config.debug_output_data = debug_output_data
  config.debug_show_stats = debug_show_stats
  config.debug_show_metrics = debug_show_metrics

  clip_title = Path(recording_filepath).stem

  # ---------------------------
  # --- Audio preprocessing ---
  # ---------------------------

  data_mono, sample_rate, duration, ds_data, ds_sample_rate = _preprocess_audio(
      audio_filepath=recording_filepath,
      title=clip_title,
      debug_dir=config.DEBUG_CLIP_DIR
  )

  # -------------------------------
  # --- Compute the spectrogram ---
  # -------------------------------

  Sxx_ds, partition_ranges = _process_spectrogram(
      title=clip_title,
      debug_dir=config.DEBUG_CLIP_DIR,
      data_mono=data_mono,
      sample_rate=sample_rate,
      duration=duration,
      ds_data=ds_data,
      ds_sample_rate=ds_sample_rate
  )

  # -------------------------------
  # --- Compute the fingerprint ---
  # -------------------------------

  fp_flat, fp_flat_cached = _process_fingerprint(
      audio_id=clip_title,
      title=clip_title,
      debug_dir=config.DEBUG_CLIP_DIR,
      use_cache=use_cache,
      cache_category="clip",
      Sxx_ds=Sxx_ds,
      partition_ranges=partition_ranges,
      ds_sample_rate=ds_sample_rate,
      duration=duration
  )

  # ---------------------------------
  # --- Compute the records table ---
  # ---------------------------------

  rt = _process_records_table(
      audio_id=clip_title,
      use_cache=use_cache,
      cache_category="clip",
      fp_flat=fp_flat,
      fp_flat_cached=fp_flat_cached
  )

  # ------------------------
  # --- Search for track ---
  # ------------------------

  metrics.start("rtdb_construct", "Constructing records table database")
  rtdb = search.construct_record_table_database()
  metrics.end("rtdb_construct")

  metrics.start("find_tz_matches", "Finding target zone matches")
  tz_matches = search.find_target_zone_matches(rt, rtdb)
  metrics.end("find_tz_matches")

  # TODO: remove
  print("Target zone matches:")
  pprint.pp(tz_matches)


@app.command()
def clear_cache(
    track: Annotated[bool, typer.Option(
        help="Clear the track cache files")] = True,
    clip: Annotated[bool, typer.Option(
        help="Clear the clip cache files")] = True,
    clear_fingerprint: Annotated[bool, typer.Option("--fingerprint / --no-fingerprint",
                                                    help="Clear the fingerprint caches")] = True,
    flat_fingerprint: Annotated[bool, typer.Option(
        help="Clear the flattened fingerprint caches")] = True,
    records_table: Annotated[bool, typer.Option(
        help="Clear the records table caches")] = True,
    show_debug: Annotated[bool, typer.Option(
        help="Show the debug logs of the deleted cache items")] = False
):
  """
  Clears the cache.
  """
  # List of (glob pattern, cache category, is_numpy flag)
  clear_data: List[Tuple[str, cache.CacheCategory, bool]] = list()

  if track:
    if clear_fingerprint:
      clear_data.append(("*.fp", "track", True))
    if flat_fingerprint:
      clear_data.append(("*.fp_flat", "track", True))
    if records_table:
      clear_data.append(("*.rt", "track", False))

  if clip:
    if clear_fingerprint:
      clear_data.append(("*.fp", "clip", True))
    if flat_fingerprint:
      clear_data.append(("*.fp_flat", "clip", True))
    if records_table:
      clear_data.append(("*.rt", "clip", False))

  for glob_pattern, category, is_numpy in clear_data:
    cache.clear(glob_pattern, category,
                is_numpy=is_numpy, show_debug=show_debug)


if __name__ == "__main__":
  initialization.setup_dirs()
  app()
