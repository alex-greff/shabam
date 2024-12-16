"""Module for the naive file-based pickling storage engine"""
import os
import glob
from typing import Dict, List, Optional, Set
import pickle
from pathlib import Path
import nptyping as npt
from modules.storage.storage_abc import StorageEngine
from modules import config, records


class PickleStorageEngine(StorageEngine):
  """
  Storage engine for the naive file-based pickling approach.
  """
  # Maps all couples that correspond to the address key
  RecordsTableDatabase = Dict[npt.UInt32, List[npt.UInt64]]

  def _construct_records_table_database(
      self,
      track_id_filter: Optional[Set[npt.UInt32]] = None
  ) -> RecordsTableDatabase:
    """
    Constructs the records table database by loading all cached track record tables.

    Returns: the records table database
    """
    rtdb: PickleStorageEngine.RecordsTableDatabase = dict()

    computed_rt_files = glob.glob(f"{config.DATA_DIR}/rtdb/*.rt.pkl")

    for rt_file in computed_rt_files:
      # Stem twice to get rid of the .rt.pkl suffix
      rt_filename = int(Path(Path(rt_file).stem).stem)
      # Records table file is not in the filter list, skip it
      if track_id_filter is not None and rt_filename not in track_id_filter:
        continue

      rt: Optional[records.RecordsTableEncoded] = None
      with open(rt_file, "rb") as f:
        rt = pickle.load(f)
      assert rt is not None

      # Merge loaded record table into the record table database
      for address, couples in rt.items():
        merged_couples = rtdb.get(address, list())
        merged_couples.extend(couples)
        rtdb[address] = merged_couples

    return rtdb

  def count_couples_matches(
      self,
      clip_rt: records.RecordsTableEncoded,
      track_id_filter: Optional[Set[npt.UInt32]] = None,
  ) -> Dict[npt.UInt64, int]:
    rtdb = self._construct_records_table_database(track_id_filter)

    # Counts the number of times a couple of (absolute anchor time, track id)
    # has been matched by the audio clip's record table
    couple_matches: Dict[npt.UInt64, int] = dict()

    # Go through each record and count how many matches they have with records
    # in the records table database
    for clip_address, clip_couples in clip_rt.items():
      # Each couple counts as an independent record match
      for _ in clip_couples:
        matched_couples = rtdb.get(clip_address, list())

        for matched_couple in matched_couples:
          couple_match_count = couple_matches.get(matched_couple, 0)
          couple_match_count += 1
          couple_matches[matched_couple] = couple_match_count

    return couple_matches

  def get_records_table(self, track_id: npt.UInt32) -> records.RecordsTableEncoded:
    return self._construct_records_table_database({track_id})

  def store_records_table(
      self,
      track_id: npt.UInt32,
      track_rt: records.RecordsTableEncoded
  ):
    self.delete_records_table(track_id)

    rt_filepath = f"{config.DATA_DIR}/rtdb/{track_id}.rt.pkl"
    # Create directories for the file, if needed
    if not os.path.exists(os.path.dirname(rt_filepath)):
      os.makedirs(os.path.dirname(rt_filepath), exist_ok=True)

    with open(rt_filepath, "wb") as f:
      pickle.dump(track_rt, f)

  def delete_records_table(self, track_id: npt.UInt32):
    rt_filepath = f"{config.DATA_DIR}/rtdb/{track_id}.rt.pkl"
    if os.path.isfile(rt_filepath):
      os.unlink(Path(rt_filepath))
      return True
    else:
      return False
