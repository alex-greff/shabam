"""Module for managing the searching of tracks"""
import glob
import numpy as np
import nptyping as npt
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from modules import records, config, cache

# Maps all couples that correspond to the address key
RecordsTableDatabase = Dict[npt.UInt32, List[npt.UInt64]]


def construct_record_table_database() -> RecordsTableDatabase:
  rtdb: RecordsTableDatabase = dict()

  computed_rt_files = glob.glob(f"{config.DATA_DIR}/track/*.rt.pkl")

  for rt_file in computed_rt_files:
    rt_name = Path(rt_file).stem

    rt_cache: Optional[Tuple[records.RecordsTableEncoded, int]] = cache.load(
        rt_name, "track", is_numpy=False)
    assert rt_cache is not None
    rt, _ = rt_cache

    # Merge loaded record table into the record table database
    for address, couples in rt.items():
      merged_couples = rtdb.get(address, list())
      merged_couples.extend(couples)
      rtdb[address] = merged_couples

  return rtdb


def find_target_zone_matches(
    audio_clip_rt: records.RecordsTableEncoded,
    audio_clip_num_target_zones: int,
    rtdb: RecordsTableDatabase
):
  # Counts the number of times a couple of (absolute anchor time, track id)
  # has been matched by the audio clip's record table
  couple_matches: Dict[npt.UInt64, int] = dict()

  clip_tz_total_count = len(audio_clip_rt)
  assert clip_tz_total_count > 0

  # Go through each record and count how many matches they have with records
  # in the records table database
  for clip_address, clip_couples in audio_clip_rt.items():
    # Each couple counts as an independent record match
    for clip_couple in clip_couples:
      clip_abs_time, _ = records.decode_couple(clip_couple)
      # TODO: need to figure out what to do with the clip absolute time for
      # time coherency checking

      matched_couples = rtdb.get(clip_address, list())

      for matched_couple in matched_couples:
        couple_match_count = couple_matches.get(matched_couple, 0)
        couple_match_count += 1
        couple_matches[matched_couple] = couple_match_count

  # Count the number of target zones matched for each track
  tz_matches: Dict[npt.UInt32, int] = dict()
  for matched_couple, couple_match_count in couple_matches.items():
    # A target zone is only matched when we match every couple in it
    if couple_match_count < config.TARGET_ZONE_SIZE:
      continue

    _, matched_track_id = records.decode_couple(matched_couple)

    tz_match_count = tz_matches.get(matched_track_id, 0)
    tz_match_count += 1
    tz_matches[matched_track_id] = tz_match_count

  return couple_matches, tz_matches
