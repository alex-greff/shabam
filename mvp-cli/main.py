"""CLI entry module"""
from typing import List, Tuple
from pathlib import Path
import pprint
import typer
from colorama import init as init_colorama
from typing_extensions import Annotated
from modules import initialization, processing, cache
from modules.formatting import DEBUG_STYLE
import modules.config as config

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


@app.command()
def add(
    track_id: Annotated[int, typer.Argument(help="The identifier of the track")],
    track_filepath: Annotated[str, typer.Argument(
        help="Path to the track's wav file")],
    use_cache: Annotated[bool, typer.Option(
        "--use-cache / --no-use-cache", "-c / -C",
        help="Load cached data, if it exists")] = False,
    output_debug_files: Annotated[bool, typer.Option(
        "--output-debug-files / --no-output-debug-files", "-f / -F",
        help="Output debug files including processed audio and visualization graphs")] = False,
    show_debug_stats: Annotated[bool, typer.Option(
        "--show-debug-stats / --no-show-debug-stats", "-s / -S",
        help="Show stats about the processed data")] = False,
    show_debug_metrics: Annotated[bool, typer.Option(
        "--show-debug-metrics / --no-show-debug-metrics", "-m / -M",
        help="Show metrics about all the processing steps being run")] = True
):
  """
  Adds a track to the database.
  """

  # Set runtime config values
  config.debug_output_data = output_debug_files
  config.debug_show_stats = show_debug_stats
  config.debug_show_metrics = show_debug_metrics

  track_title = Path(track_filepath).stem

  # ---------------------------
  # --- Audio preprocessing ---
  # ---------------------------

  data_mono, sample_rate, duration, ds_data, ds_sample_rate = processing.preprocess_audio(
      audio_filepath=track_filepath,
      title=track_title,
      debug_dir=config.DEBUG_TRACK_DIR
  )

  # -------------------------------
  # --- Compute the spectrogram ---
  # -------------------------------

  Sxx_ds, partition_ranges = processing.process_spectrogram(
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

  fp, fp_flat, loaded_fp_from_cache = processing.process_fingerprint(
      audio_id=track_id,
      title=track_title,
      debug_dir=config.DEBUG_TRACK_DIR,
      use_cache=use_cache,
      cache_category="track",
      spectrogram_data=Sxx_ds,
      partition_ranges=partition_ranges,
      ds_sample_rate=ds_sample_rate,
      duration=duration
  )

  # ---------------------------------
  # --- Compute the records table ---
  # ---------------------------------

  rt, num_tz = processing.process_records_table(
      audio_id=track_id,
      use_cache=use_cache,
      cache_category="track",
      fp_flat=fp_flat,
      loaded_fp_from_cache=loaded_fp_from_cache,
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
        "--use-cache / --no-use-cache", "-c / -C",
        help="Load cached data, if it exists")] = False,
    output_debug_files: Annotated[bool, typer.Option(
        "--output-debug-files / --no-output-debug-files", "-f / -F",
        help="Output debug files including processed audio and visualization graphs")] = False,
    show_debug_stats: Annotated[bool, typer.Option(
        "--show-debug-stats / --no-show-debug-stats", "-s / -S",
        help="Show stats about the processed data")] = False,
    show_debug_metrics: Annotated[bool, typer.Option(
        "--show-debug-metrics / --no-show-debug-metrics", "-m / -M",
        help="Show metrics about all the processing steps being run")] = True
):
  """
  Searches for a track.
  """

  # Set runtime config values
  config.debug_output_data = output_debug_files
  config.debug_show_stats = show_debug_stats
  config.debug_show_metrics = show_debug_metrics

  clip_title = Path(recording_filepath).stem

  # ---------------------------
  # --- Audio preprocessing ---
  # ---------------------------

  data_mono, sample_rate, duration, ds_data, ds_sample_rate = processing.preprocess_audio(
      audio_filepath=recording_filepath,
      title=clip_title,
      debug_dir=config.DEBUG_CLIP_DIR
  )

  # -------------------------------
  # --- Compute the spectrogram ---
  # -------------------------------

  Sxx_ds, partition_ranges = processing.process_spectrogram(
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

  fp, fp_flat, loaded_fp_from_cache = processing.process_fingerprint(
      audio_id=clip_title,
      title=clip_title,
      debug_dir=config.DEBUG_CLIP_DIR,
      use_cache=use_cache,
      cache_category="clip",
      spectrogram_data=Sxx_ds,
      partition_ranges=partition_ranges,
      ds_sample_rate=ds_sample_rate,
      duration=duration
  )

  # ---------------------------------
  # --- Compute the records table ---
  # ---------------------------------

  rt, num_tz = processing.process_records_table(
      audio_id=clip_title,
      use_cache=use_cache,
      cache_category="clip",
      fp_flat=fp_flat,
      loaded_fp_from_cache=loaded_fp_from_cache
  )

  # ------------------------
  # --- Search for track ---
  # ------------------------

  tz_matches, tc_matches = processing.search_match(rt, num_tz)

  # TODO: remove
  print("Number of target zones", num_tz)
  print("Target zone matches:")
  pprint.pp(tz_matches)
  print("Time coherent matches")
  pprint.pp(tc_matches)


@app.command()
def clear_cache(
    track: Annotated[bool, typer.Option(
        "--track / --no-track", "-t / -T",
        help="Clear the track cache files")] = True,
    clip: Annotated[bool, typer.Option(
        "--clip / --no-clip", "-c / -C",
        help="Clear the clip cache files")] = True,
    clear_fingerprint: Annotated[bool, typer.Option(
        "--fingerprint / --no-fingerprint", "-p / -P",
        help="Clear the fingerprint caches")] = True,
    flat_fingerprint: Annotated[bool, typer.Option(
        "--flat-fingerprint / --no-flat-fingerprint", "-f / -F",
        help="Clear the flattened fingerprint caches")] = True,
    records_table: Annotated[bool, typer.Option(
        "--records-table / --no-records-table", "-r / -R",
        help="Clear the records table caches")] = True,
    show_debug: Annotated[bool, typer.Option(
        "--show-debug / --no-show-debug", "-d / -D",
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
