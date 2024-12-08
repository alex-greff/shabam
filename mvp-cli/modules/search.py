"""Module for managing the searching of tracks"""
import glob
import itertools
from typing import Dict, List, Optional, Set, Tuple
from pathlib import Path
import numpy as np
import nptyping as npt
from modules import records, config, cache
from modules.formatting import WARNING_STYLE

# Maps all couples that correspond to the address key
RecordsTableDatabase = Dict[npt.UInt32, List[npt.UInt64]]


def construct_record_table_database() -> RecordsTableDatabase:
  """
  Constructs the records table database by loading all cached track record tables.

  Returns: the records table database
  """
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
) -> Dict[npt.UInt32, int]:
  """
  Finds all matching target zones in the audio clip with each track in the
  records database. Filters the final result target zone map by the
  `TZ_MATCH_TOLERANCE_COEFFICIENT` coefficient.

  Params:
    `audio_clip_rt`: the records table for the audio clip
    `audio_clip_num_tz`: the number of target zones in the audio clip records table
    `rtdb`: the record table database
  Returns: a map of all matched track ids and the number of target zones in them
    that match in the clip
  """
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
    for _ in clip_couples:
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

  return tz_matches_filtered


def perform_time_coherence_filtering(
    audio_clip_rt: records.RecordsTableEncoded,
    potential_track_ids: List[npt.UInt32],
) -> Dict[npt.UInt32, int]:
  """
  Performs time coherence filtering on the potential tracks in the target zone
  match map. Filters the final result time coherence respect map by the
  `TC_MATCH_TOLERANCE_COEFFICIENT` coefficient.

  Params:
    `audio_clip_rt`: the records table for the audio clip
    `potential_track_ids`: the potential track ids to perform the time coherence filtering
  Returns: a map of matched track ids and the number of records in the clip that
    respected the time coherence of the track records
  """
  # Maps each track to the number of matching time coherent records it has with
  # the clip
  tc_matches: Dict[npt.UInt32, int] = dict()

  for track_id in potential_track_ids:
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
          track_abs_time, track_id = records.decode_couple(track_couple)

          delta = np.int64(track_abs_time) - np.int64(clip_abs_time)
          possible_deltas.add(delta)

    # Slice down the possible deltas set if we surpassed the delta compute threshold
    if len(possible_deltas) > config.POSSIBLE_DELTA_COMPUTE_THRESHOLD:
      print(f"{WARNING_STYLE}\nWarning: delta compute threshold passed for track id {track_id}, only {config.POSSIBLE_DELTA_COMPUTE_THRESHOLD} of {len(possible_deltas)} possible deltas will be computed. Time coherence filtered results may be inaccurate.")

      # Source: https://stackoverflow.com/a/40737853
      possible_deltas = set(itertools.islice(
          possible_deltas, config.POSSIBLE_DELTA_COMPUTE_THRESHOLD))

    # Maps for each delta, the number of notes that respect
    # abs time of note in track = abs time of note in clip + delta
    # Find the delta that gives the maximum number of time coherent notes
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
    tc_matches[track_id] = most_respected_delta_value

  audio_clip_num_records = 0
  for couples in audio_clip_rt.values():
    audio_clip_num_records += len(couples)

  # Filter out potential tracks that have less time coherent respecting records
  # than the total number of records in the clip multiplied by a tolerance coefficient
  tc_matches_filtered = {track_id: num_tc_records
                         for track_id, num_tc_records in tc_matches.items()
                         if num_tc_records >= config.TC_MATCH_TOLERANCE_COEFFICIENT * audio_clip_num_records}

  return tc_matches_filtered
