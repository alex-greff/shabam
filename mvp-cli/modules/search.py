"""Module for managing the searching of tracks"""
import glob
import numpy as np
import nptyping as npt
from pathlib import Path
from typing import Dict, List, Optional
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
  # Counts the number of target zone matches found in the audio clip
  # for each track id
  tz_matches: Dict[npt.UInt32, int] = dict()

  for clip_address, clip_couple in audio_clip_rt.items():
    clip_abs_time, _ = records.decode_couple(clip_couple)

    matched_couples = rtdb.get(clip_address, list())

    for matched_couple in matched_couples:
      matched_abs_time, matched_track_id = records.decode_couple(
          matched_couple)

      tz_match_count = tz_matches.get(matched_track_id, 0)
      tz_match_count += 1
      tz_matches[matched_track_id] = tz_match_count

  return tz_matches
