"""Module for the processing steps."""
from typing import Dict, List, Optional, Tuple, Union
import os.path
from scipy.io import wavfile
from scipy import signal
import numpy as np
import nptyping as npt
from modules import visualization, fingerprint, metrics, cache, records, search, storage
from modules.formatting import BULLET, HEAD_STYLE, BOLD_STYLE, NORMAL_STYLE, DIM_STYLE
import modules.config as config

# Terminology
# bins: y axis of spectrogram (== FFT_SIZE/2)
# window: x axis of spectrogram and fingerprint


def preprocess_audio(
    audio_filepath: str,
    title: str,
    debug_dir: str
) -> Tuple[npt.NDArray, int, float, npt.NDArray, int]:
  """
  Preprocessing the audio with the following steps:
  1. Convert audio to mono
  2. Downsample the audio

  Params:
    `audio_filepath`: the file path to the audio wav file
    `title`: the title of the track
    `debug_dir`: the directory to save debug data

  Returns a tuple with the following items:
    * `data_mono`: mono audio PCM data points (timedomain information)
    * `sample_rate`: sample rate of the mono audio
    * `duration`: duration of the audio in seconds
    * `ds_data`: downsampled audio PCM data points (timedomain information)
    * `ds_sample_rate`: sample rate of the downsampled audio
  """
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


def process_spectrogram(
    title: str,
    debug_dir: str,
    data_mono: npt.NDArray,
    sample_rate: int,
    duration: float,
    ds_data: npt.NDArray,
    ds_sample_rate: int
) -> Tuple[npt.NDArray, List[fingerprint.PartitionRange]]:
  """
  Computes the spectrogram of the given and its partition ranges.

  Params:
    `title`: the title of the track
    `debug_dir`: the directory to save debug data
    `data_mono`: the mono PCM data of the audio (timedomain information)
    `sample_rate`: the sample rate of the mono audio
    `duration`: the duration of the audio in seconds
    `ds_data`: the downsampled PCM data of the audio (timedomain information)
    `ds_sample_rate`: the sample rate of the downsampled audio

  Returns: a tuple of `(spectrogram_data, partition_ranges)`
    where,
      `spectrogram_data` the NDArray of shape (windows, frequency bins) containing
      the frequency domain spectrogram analysis
      `partition_ranges`: the partition ranges corresponding to the spectrogram
  """
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

  if config.debug_show_stats:
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

  # Transpose so its of form (windows, bins) instead of (bins, windows)
  return Sxx_ds.T, partition_ranges


FingerprintCacheType = Optional[Tuple[npt.NDArray, int, int, int]]


def process_fingerprint(
    audio_id: int,
    title: str,
    debug_dir: str,
    use_cache: bool,
    cache_category: cache.CacheCategory,
    spectrogram_data: npt.NDArray,
    partition_ranges: List[fingerprint.PartitionRange],
    ds_sample_rate: int,
    duration: float,
) -> Tuple[npt.NDArray, npt.NDArray, bool]:
  """
  Computes the fingerprint.

  Params:
    `audio_id`: the id for the audio clip or track
    `title`: the name of the audio
    `debug_dir`: the directory to save debug data
    `use_cache`: indicates to try loading the fingerprint from the cache
    `cache_category`: the category to try loading from the cache
      (either "track" or "clip")
    `spectrogram_data`: the NDArray of shape (windows, frequency bins) containing
      the frequency domain spectrogram analysis
    `partition_ranges`: the partition ranges corresponding to the spectrogram
    `ds_sample_rate`: the sample rate of the downsampled audio
    `duration`: the duration of the audio in seconds

  Returns: a tuple of
    * The computed fingerprint in matrix form (each cell indicates if a
      fingerprint point exists)
    * The computed fingerprint in flat form (each item is a `(window, partition)`
      pair indicating that a fingerprint point exists at that location)
    * A boolean indicating if we loaded the fingerprint from the cache
  """
  # --- Compute the fingerprint ---
  fp_cache_item: FingerprintCacheType = (cache.load(
      f"{audio_id}.fp", cache_category, is_numpy=False) if use_cache else None)
  fp_cached = fp_cache_item[0] if fp_cache_item is not None else None
  slider_w_cache = fp_cache_item[1] if fp_cache_item is not None else None
  slider_h_cache = fp_cache_item[2] if fp_cache_item is not None else None
  slider_s_cache = fp_cache_item[3] if fp_cache_item is not None else None
  metrics.start("fp_compute", "Computing fingerprint")
  fp, slider_w, slider_h, slider_s = ((fp_cached, slider_w_cache, slider_h_cache, slider_s_cache)
                                      if fp_cache_item is not None
                                      else fingerprint.compute_fingerprint(
                                          spectrogram_data, partition_ranges, ds_sample_rate))
  metrics.end("fp_compute",
              suffix="cached" if fp_cached is not None else None)

  if fp_cached is None:
    cache.save(f"{audio_id}.fp", cache_category,
               (fp, slider_w, slider_h, slider_s), is_numpy=False)

  fingerprint_filepath = f"{debug_dir}/{title}_fp.png"
  if config.debug_output_data:
    metrics.start("graph_fingerprint", "Graphing fingerprint")
    visualization.graph_fingerprint(
        fp,
        ds_sample_rate,
        spectrogram_data.shape[1],
        duration,
        fingerprint_filepath,
        f"{title} Fingerprint",
        partition_ranges
    )
    metrics.end("graph_fingerprint")

  if config.debug_show_stats:
    print(f"\n{HEAD_STYLE}Fingerprint stats:")
    print(
        f"  {BULLET}{NORMAL_STYLE} Slider with: {BOLD_STYLE}{slider_w:,} {NORMAL_STYLE}sample(s)")
    print(f"  {BULLET}{NORMAL_STYLE} Slider height: {BOLD_STYLE}{slider_h:,} {NORMAL_STYLE}partition(s)")
    print(f"  {BULLET}{NORMAL_STYLE} Slider step: {BOLD_STYLE}{slider_s:,} {NORMAL_STYLE}sample(s)", flush=True)

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

  loaded_fp_from_cache = fp_flat_cached is not None

  return fp, fp_flat, loaded_fp_from_cache


def process_records_table(
    audio_id: Union[int, str],
    use_cache: bool,
    cache_category: cache.CacheCategory,
    fp_flat: npt.NDArray,
    loaded_fp_from_cache: bool,
    is_track: bool,
) -> Tuple[records.RecordsTableEncoded, int]:
  """
  Computes the records table from the given fingerprint.

  Params:
    `audio_id`: the id for the audio clip or track
    `use_cache`: indicates to try loading the fingerprint from the cache
    `cache_category`: the category to try loading from the cache
      (either "track" or "clip")
    `fp_flat`: a fingerprint in flat form
    `loaded_fp_from_cache`: a flag indicating if the given fingerprint was loaded
      from the cache or computed (this is to figure out if we should attempt to
      load the records table from cache or recompute it)
    `is_track`: a flag indicating if the records table is a track. If so, then
      the track records table will be stored.

  Returns: a tuple of
    * the computed records table
    * the number of target zones in the records table
  """
  # If we give a string audio ID, then we're computing the clip records table
  # and we don't care about the id part of the couple
  audio_int_id = audio_id if isinstance(audio_id, int) else 0

  cache_data: Optional[Tuple[records.RecordsTableEncoded, int]] = (
      cache.load(f"{audio_id}.rt", cache_category, is_numpy=False)
      if use_cache and loaded_fp_from_cache else None)
  rt_cached = cache_data[0] if cache_data is not None else None
  rt_num_tz_cached = cache_data[1] if cache_data is not None else None
  metrics.start("rt_compute", "Computing records table")
  rt, rt_num_tz = (
      (rt_cached, rt_num_tz_cached)
      if rt_cached is not None and rt_num_tz_cached is not None
      else records.compute_records_table(fp_flat, audio_int_id))
  metrics.end("rt_compute", suffix="cached" if rt_cached is not None else None)

  # Store the records table if we processed a track
  if is_track:
    storage_engine = storage.get_storage_engine()
    storage_engine.store_records_table(audio_id, rt)

  if rt_cached is None:
    cache.save(f"{audio_id}.rt", cache_category,
               (rt, rt_num_tz), is_numpy=False)

  return rt, rt_num_tz


def search_match(
    rt: records.RecordsTableEncoded,
    rt_num_tz: int,
) -> Tuple[Dict[npt.UInt32, int], Dict[npt.UInt32, int]]:
  """
  Performs a search on the given clip's record table against the records table
  database through the following steps:
    * Construct the records table database
    * Filter down potential tracks by target zone matching
    * Further filter down potential tracks by performing time coherence matching
      on the potential tracks from the target zone matching step

  Params:
    `rt`: the records table of the audio clip
    `rt_num_tz`: the number of target zones in the records table

  Returns: a tuple with the items
    * A mapping of all potential track ids and the number of target zones they
      have matching with the audio clip
    * A mapping of all potential track ids and the number of matching time
      coherent records in the audio clip
  """

  # TODO: remove
  # metrics.start("rtdb_construct", "Constructing records table database")
  # rtdb = search.construct_record_table_database()
  # metrics.end("rtdb_construct")

  metrics.start("find_tz_matches", "Finding target zone matches")
  tz_matches = search.find_target_zone_matches(
      rt, rt_num_tz)
  metrics.end("find_tz_matches")

  metrics.start("filter_tc", "Filtering tracks by time coherence")
  tc_matches = search.perform_time_coherence_filtering(
      rt, tz_matches.keys())
  metrics.end("filter_tc")

  return tz_matches, tc_matches
