"""Module for handling track records."""

from typing import Dict, List, Tuple
import numpy as np
import nptyping as npt
from modules import config

RecordsTableEncoded = Dict[npt.UInt32, List[npt.UInt64]]
RecordsTableDecoded = Dict[Tuple[npt.UInt16, npt.UInt16, npt.UInt16],
                           List[Tuple[npt.UInt32, npt.UInt32]]]


class AddressInvalidParameterException(Exception):
  """
  Raised when an invalid parameter is passed to an address function
  """


def encode_address(
    anchor_freq: npt.UInt16,
    point_freq: npt.UInt16,
    delta: npt.UInt16
) -> npt.UInt32:
  """
  Encodes an address into its unsigned 32-bit integer representation.

  Bit layout:
  ```txt
  |                    32-bit unsigned integer                    |
  |x x x x x x x x x|x x x x x x x x x|x x x x x x x x x x x x x x|
  |   anchor freq   |    point freq   |           delta           |
  ```

  Params:
    `anchor_freq`: the anchor frequency value (maximum value 511)
    `point_freq`: the point frequency value (maximum value 511)
    `delta`: the delta value between the anchor and point frequencies (maximum value 16383)
  Returns:
    An unsigned 32-bit integer representation of the address
  """

  PARTITION_MAX = 512  # 2^9
  DELTA_MAX = 16384  # 2^14

  # Check that we can actually encode it in a 32-bit integer
  if anchor_freq >= PARTITION_MAX or point_freq >= PARTITION_MAX or delta >= DELTA_MAX:
    raise AddressInvalidParameterException("An input value is too big")

  encoded = np.uint32(anchor_freq)  # add anchor_freq
  encoded = encoded << np.uint32(9)  # make space for point_freq
  encoded = encoded | np.uint32(point_freq)
  encoded = encoded << np.uint32(14)  # make space for delta
  encoded = encoded | np.uint32(delta)
  return encoded


def decode_address(
    address: npt.UInt32
) -> Tuple[npt.UInt16, npt.UInt16, npt.UInt16]:
  """
  Decodes an unsigned 32-bit integer address representation into its component
  parts.

  Bit layout:

  ```txt
  |                    32-bit unsigned integer                    |
  |x x x x x x x x x|x x x x x x x x x|x x x x x x x x x x x x x x|
  |   anchor freq   |    point freq   |           delta           |
  ```

  Params:
    `address`: the unsigned 32-bit integer address representation
  Returns:
    A tuple of `(anchor_freq, point_freq, delta)`

    where,
      `anchor_freq`: the anchor frequency value (maximum value 511)
      `point_freq`: the point frequency value (maximum value 511)
      `delta`: the delta value between the anchor and point frequencies (maximum value 16383)
  """

  # 11111111100000000000000000000000
  # = 511 << 23
  # = 4286578688 (unsigned)
  ANCHOR_MASK = np.uint32(4286578688)

  # 00000000011111111100000000000000
  # = 511 << 14
  # = 8372224
  POINT_MASK = np.uint32(8372224)

  # 00000000000000000011111111111111
  DELTA_MASK = np.uint32(16383)

  anchor_freq = np.uint16(np.bitwise_and(
      address, ANCHOR_MASK) >> np.uint32(23))
  point_freq = np.uint16(np.bitwise_and(address, POINT_MASK) >> np.uint32(14))
  delta_freq = np.uint16(np.bitwise_and(address, DELTA_MASK))

  return (anchor_freq, point_freq, delta_freq)


def encode_couple(abs_time: npt.UInt32, track_id: npt.UInt32) -> npt.UInt64:
  """
  Encodes a couple into its unsigned 64-bit integer representation.

  Bit layout:
  ```txt
  |                      64-bit unsigned integer                    |
  |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  |            absTime             |             trackId            |
  ```

  Params:
    `abs_time`: the absolute time position (maximum value `UInt32.max`)
    `track_id`: the identifier of the associated track (maximum value `UInt32.max`)
  Returns:
    An unsigned 64-bit integer representation of the couple
  """

  encoded = np.uint64(abs_time)  # add abs_time
  encoded = encoded << np.uint64(32)  # make space for track_id
  encoded = encoded | np.uint64(track_id)
  return encoded


def decode_couple(couple: npt.UInt64) -> Tuple[npt.UInt32, npt.UInt32]:
  """
  Decodes an unsigned 64-bit integer couple representation into its component
  parts.

  Bit layout:
  ```txt
  |                      64-bit unsigned integer                    |
  |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  |            absTime             |             trackId            |
  ```

  Params:
    `couple`: the unsigned 64-bit integer couple representation
  Returns:
    A tuple of `(abs_time, track_id)`

    where,
      `abs_time`: the absolute time position (maximum value `UInt32.max`)
      `track_id`: the identifier of the associated track (maximum value `UInt32.max`)
  """

  # 1111111111111111111111111111111100000000000000000000000000000000
  # 4294967295n << 32n
  # 18446744069414584320n
  ABS_TIME_MASK = np.uint64(18446744069414584320)

  # 11111111111111111111111111111111
  TRACK_ID_MASK = np.uint64(4294967295)

  abs_time = np.uint32(
      np.bitwise_and(couple, ABS_TIME_MASK) >> np.uint64(32))
  track_id = np.uint32(np.bitwise_and(couple, TRACK_ID_MASK))

  return (abs_time, track_id)


def compute_records_table(
    fp_flat: npt.NDArray,
    track_id: npt.UInt32
) -> Tuple[RecordsTableEncoded, int]:
  """
  Computes the encoded records table with the given flat fingerprint array.

  Params:
    `fp_flat`: A 1D array of tuples (window index, partition index) fingerprint points
    `track_id`: the identifier of the associated track
  Returns:
    A tuple with a records table dictionary mapping the encoded address integers
    to their corresponding encoded couple integer and the number of target zones
    in the records table
  """
  records_table: RecordsTableEncoded = dict()

  num_target_zones = 0

  for anchor_idx, anchor_entry in enumerate(fp_flat):
    anchor_entry: Tuple[int, int] = anchor_entry
    anchor_window, anchor_partition = anchor_entry

    couple = encode_couple(np.uint32(anchor_window), track_id)

    # This target zone and all after it will not be able to fit every record in
    # before running out of points, so stop early
    if anchor_idx + config.ANCHOR_OFFSET + config.TARGET_ZONE_SIZE >= fp_flat.shape[0]:
      break

    num_target_zones += 1

    for point_offset in range(1, config.TARGET_ZONE_SIZE + 1):
      point_entry: Tuple[int, int] = fp_flat[anchor_idx +
                                             config.ANCHOR_OFFSET + point_offset]
      point_window, point_partition = point_entry

      delta = point_window - anchor_window

      address = encode_address(np.uint16(anchor_partition), np.uint16(
          point_partition), np.uint16(delta))

      couples_list = records_table.get(address, list())
      couples_list.append(couple)
      records_table[address] = couples_list

  return records_table, num_target_zones


def to_decoded_records_table(rt: RecordsTableEncoded) -> RecordsTableDecoded:
  """
  Converts the given encoded records table to its decoded version.

  Params:
    `rt`: the encoded records table
  Returns:
    A records table dictionary mapping the decoded address
    `(anchor_freq, point_freq, delta)` tuples to their
    corresponding decoded couple `(abs_time, track_id)` tuples
  """
  rt_decoded: RecordsTableDecoded = dict()

  for address, couples in rt.items():
    anchor_freq, point_freq, delta = decode_address(address)

    couples_decoded: List[Tuple[npt.UInt32, npt.UInt32]] = list()
    for couple in couples:
      abs_time, track_id = decode_couple(couple)
      couples_decoded.append((abs_time, track_id))

    rt_decoded[(anchor_freq, point_freq, delta)] = couples_decoded

  return rt_decoded
