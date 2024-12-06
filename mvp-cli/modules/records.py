"""Module for handling track records."""

from typing import Tuple
import numpy as np
import nptyping as npt


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
  ```
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

  ```
  |                    32-bit unsigned integer                    |
  |x x x x x x x x x|x x x x x x x x x|x x x x x x x x x x x x x x|
  |   anchor freq   |    point freq   |           delta           |
  ```

  Params:
    `address`: the unsigned 32-bit integer address representation
  Returns:
    A tuple of [`anchor_freq`, `point_freq`, `delta`]

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
  ```
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
  ```
  |                      64-bit unsigned integer                    |
  |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  |            absTime             |             trackId            |
  ```

  Params:
    `couple`: the unsigned 64-bit integer couple representation
  Returns:
    A tuple of [`abs_time`, `track_id`]

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
