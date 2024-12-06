"""Module for managing the searching of tracks"""
import glob
from pathlib import Path
from typing import Optional
from modules import records, config, cache

RecordsDatabase = records.RecordsTableEncoded


def _construct_record_table_database() -> RecordsDatabase:
  rtdb: RecordsDatabase = dict()

  computed_rt_files = glob.glob(f"{config.DATA_DIR}/*.rt.pkl")
  print(">>> computed_rts", computed_rt_files)  # TODO: remove

  for rt_file in computed_rt_files:
    rt_name = Path(rt_file).stem

    rt: Optional[records.RecordsTableEncoded] = cache.load(
        rt_name, is_numpy=False)
    assert rt is not None

    # Merge loaded record table into the record table database
    rtdb = {**rtdb, **rt}

  return rtdb


def search_track(track_rt: records.RecordsTableEncoded):
  rtdb = _construct_record_table_database()
