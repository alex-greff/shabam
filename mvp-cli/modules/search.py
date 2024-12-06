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

    rt: Optional[records.RecordsTableEncoded] = cache.load(
        rt_name, "track", is_numpy=False)
    assert rt is not None

    # Merge loaded record table into the record table database
    for address, couple in rt.items():
      couples = rtdb.get(address, list())
      couples.append(couple)
      rtdb[address] = couples

  return rtdb


def find_target_zone_matches(
    audio_clip_rt: records.RecordsTableEncoded,
    rtdb: RecordsTableDatabase
):
  # Maps track id to (# target zone matches, % of target zones matched)
  tz_matches: Dict[npt.UInt32, Tuple[int, float]] = dict()

  clip_tz_total_count = len(audio_clip_rt)
  assert clip_tz_total_count > 0

  # Go through each record and count how many matches they have with records
  # in the records table database
  for clip_address, clip_couple in audio_clip_rt.items():
    clip_abs_time, _ = records.decode_couple(clip_couple)

    matched_couples = rtdb.get(clip_address, list())

    for matched_couple in matched_couples:
      matched_abs_time, matched_track_id = records.decode_couple(
          matched_couple)

      tz_match_count, tz_match_percentage = tz_matches.get(
          matched_track_id, (0, 0))
      tz_match_count += 1
      tz_matches[matched_track_id] = (tz_match_count, tz_match_percentage)

  # For all the target zone matches found to the clip, figure out the percentage
  # of the number of target zones in the clip that matched each track
  for track_id, (tz_match_count, _) in tz_matches.items():
    tz_match_percentage = tz_match_count / clip_tz_total_count

    tz_matches[track_id] = (tz_match_count, tz_match_percentage)

  return tz_matches
