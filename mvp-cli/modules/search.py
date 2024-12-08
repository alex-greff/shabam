"""Module for managing the searching of tracks"""
import glob
import numpy as np
import nptyping as npt
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
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
    audio_clip_num_tz: int,
    rtdb: RecordsTableDatabase
):
  # Counts the number of times a couple of (absolute anchor time, track id)
  # has been matched by the audio clip's record table
  # TODO: should work in a system to account for multiple couples with the
  # same absolute time (i.e. the anchor point is at the same time), maybe keep
  # track of the number of same value couples encountered and use it as a
  # divisor? (it'll still be an approximation but it'll be a closer one)
  couple_matches: Dict[npt.UInt64, int] = dict()

  # unique_matched_couples: Dict[npt.Uin]

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

  # Count the number of target zones matched for each track id
  tz_matches: Dict[npt.UInt32, int] = dict()
  for matched_couple, couple_match_count in couple_matches.items():
    # A target zone is only matched when we match every couple in it
    if couple_match_count < config.TARGET_ZONE_SIZE:
      continue

    _, matched_track_id = records.decode_couple(matched_couple)

    tz_match_count = tz_matches.get(matched_track_id, 0)
    tz_match_count += 1
    tz_matches[matched_track_id] = tz_match_count

  # Filter out potential tracks that have less target zones matched than the
  # total number of target zones in the clip multiplied by a tolerance coefficient
  tz_matches_filtered = {track_id: num_tz_matches
                         for track_id, num_tz_matches in tz_matches.items()
                         if num_tz_matches >= config.TZ_MATCH_TOLERANCE_COEFFICIENT * audio_clip_num_tz}

  return couple_matches, tz_matches_filtered


def perform_time_coherence_filtering(
    audio_clip_rt: records.RecordsTableEncoded,
    tz_matches: Dict[npt.UInt32, int],
):
  # Maps each track to the number of matching time coherent notes it has with
  # the clip
  tc_notes: Dict[npt.UInt32, int] = dict()

  for track_id, _ in tz_matches.items():
    possible_deltas: Set[npt.Int64] = set()

    # Load the track's record table
    rt_name = f"{track_id}.rt"
    rt_cache: Optional[Tuple[records.RecordsTableEncoded, int]] = cache.load(
        rt_name, "track", is_numpy=False)
    assert rt_cache is not None
    rt, _ = rt_cache

    for clip_address, clip_couples in audio_clip_rt.items():
      track_couples = rt.get(clip_address, list())

      for clip_couple in clip_couples:
        clip_abs_time, _ = records.decode_couple(clip_couple)

        for track_couple in track_couples:
          track_abs_time, _ = records.decode_couple(track_couple)

          delta = np.int64(track_abs_time) - np.int64(clip_abs_time)
          possible_deltas.add(delta)

    # TODO: find delta that gives the maximum time coherent notes
    # Maps for each delta, the number of notes that respect
    # abs time of note in track = abs time of note in clip + delta
    respected_delta_map: Dict[int, int] = dict()
    for delta in possible_deltas:
      for clip_address, clip_couples in audio_clip_rt.items():
        track_couples = rt.get(clip_address, list())

        for clip_couple in clip_couples:
          clip_abs_time, _ = records.decode_couple(clip_couple)

          for track_couple in track_couples:
            track_abs_time, _ = records.decode_couple(track_couple)

            respects_delta = (np.int64(clip_abs_time) +
                              delta == np.int64(track_abs_time))
            if respects_delta:
              respected_count = respected_delta_map.get(delta, 0)
              respected_count += 1
              respected_delta_map[delta] = respected_count

    # Find the delta that has the largest number of respected notes
    most_respected_delta = -1
    most_respected_delta_value = -1
    for delta, num_respected in respected_delta_map.items():
      if num_respected > most_respected_delta_value:
        most_respected_delta = delta
        most_respected_delta_value = num_respected
    assert most_respected_delta > -1 and most_respected_delta_value > -1

    # Record the number of time coherent notes for this track
    tc_notes[track_id] = most_respected_delta_value

  return tc_notes
