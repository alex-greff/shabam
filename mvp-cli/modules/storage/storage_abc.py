"""Module for storing record tables."""
from typing import Dict, List, Optional, Set
from abc import ABC, abstractmethod
import nptyping as npt
from modules import records


class StorageEngine(ABC):
  """
  Abstract base class representing a storage engine. Provides methods needed for
  storing and searching records tables.
  """

  @abstractmethod
  def count_couples_matches(
      self,
      clip_rt: records.RecordsTableEncoded,
      track_id_filter: Optional[Set[npt.UInt32]] = None,
  ) -> Dict[npt.UInt64, int]:
    """
    Given a records table of an audio clip, searches all stored track records
    tables and returns a mapping of all matching couples and the number of times
    each one was matched. If a set of track ids is provided then the matches will
    be drawn from only those track couples.

    Params:
      `clip_rt`: the records table of the audio clip
      `track_id_filter`: the filtered track ids to search within

    Returns: `Dict[couple, num_matches]`
    """

  @abstractmethod
  def get_records_table(self, track_id: npt.UInt32) -> records.RecordsTableEncoded:
    """
    Fetches the records table for the given track id.

    Params:
      `track_id`: the track id to fetch for

    Returns:
      The records table of the track.
    """

  @abstractmethod
  def store_records_table(
      self,
      track_id: npt.UInt32,
      track_rt: records.RecordsTableEncoded,
  ):
    """
    Stores a records table of a track.
    Note: preexistence checks are not guaranteed by this function.

    Params:
      `track_id`: the track id associated with the records table
      `track_rt`: the records table of the track to store
    """

  @abstractmethod
  def delete_records_table(self, track_id: npt.UInt32) -> bool:
    """
    Deletes all records associated with the given track id.

    Params:
      `track_id`: the track id of the records to remove
    Returns: `True` if any records were deleted
    """
