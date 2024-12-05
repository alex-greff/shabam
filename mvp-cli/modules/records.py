from typing import Tuple
import numpy as np
import nptyping as npt


def encode_couple(absTime: npt.UInt32, trackId: npt.UInt32) -> npt.UInt64:
  # Bit layout
  # |                          64-bit integer                         |
  # |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  # |            absTime             |             trackId            |
  return 0


def decode_couple(couple: npt.UInt64) -> Tuple[npt.UInt32, npt.UInt32]:
  # Bit layout
  # |                          64-bit integer                         |
  # |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  # |            absTime             |             trackId            |
  pass
