# pylint: disable=missing-module-docstring, missing-class-docstring, missing-function-docstring
import numpy as np
import pytest
from modules import records


class TestEncodeAndDecodeAddress:
  def test_zeros(self):
    address = records.encode_address(np.uint16(0), np.uint16(0), np.uint16(0))
    assert address == 0

    [anchor_freq, point_freq,
     delta_freq] = records.decode_address(np.uint32(0))
    assert anchor_freq == 0
    assert point_freq == 0
    assert delta_freq == 0

  def test_typical(self):
    address = records.encode_address(
        np.uint16(123), np.uint16(456), np.uint16(789))
    assert address == 1039270677

    [anchor_freq, point_freq,
     delta_freq] = records.decode_address(np.uint32(1039270677))
    assert anchor_freq == 123
    assert point_freq == 456
    assert delta_freq == 789

  def test_max(self):
    address = records.encode_address(
        np.uint16(511), np.uint16(511), np.uint16(16383))
    assert address == 4294967295

    [anchor_freq, point_freq,
     delta_freq] = records.decode_address(np.uint32(4294967295))
    assert anchor_freq == 511
    assert point_freq == 511
    assert delta_freq == 16383

  def test_invalid_params(self):
    # anchor_freq param too big
    with pytest.raises(records.AddressInvalidParameterException):
      records.encode_address(np.uint16(512), np.uint16(0), np.uint16(0))

    # point_freq param too big
    with pytest.raises(records.AddressInvalidParameterException):
      records.encode_address(np.uint16(0), np.uint16(512), np.uint16(0))

    # delta param too big
    with pytest.raises(records.AddressInvalidParameterException):
      records.encode_address(np.uint16(0), np.uint16(0), np.uint16(16384))


class TestEncodeAndDecodeCouple:
  def test_zeros(self):
    couple = records.encode_couple(np.uint32(0), np.uint32(0))
    assert couple == 0

    [abs_time, track_id] = records.decode_couple(np.uint64(0))
    assert abs_time == 0
    assert track_id == 0

  def test_typical(self):
    couple = records.encode_couple(np.uint32(123), np.uint32(456))
    assert couple == 528280977864

    [abs_time, track_id] = records.decode_couple(np.uint64(528280977864))
    assert abs_time == 123
    assert track_id == 456

  def test_max(self):
    uint32_max = np.iinfo(np.uint32).max
    uint64_max = np.iinfo(np.uint64).max

    couple = records.encode_couple(uint32_max, uint32_max)
    assert couple == uint64_max

    [abs_time, track_id] = records.decode_couple(uint64_max)
    assert abs_time == uint32_max
    assert track_id == uint32_max

  def test_abs_time_overflow(self):
    uint32_max = np.iinfo(np.uint32).max

    couple = records.encode_couple(uint32_max + 1, np.uint32(0))
    # the abs_time parameter wraps around to 0
    assert couple == 0

  def test_track_id_overflow(self):
    uint32_max = np.iinfo(np.uint32).max

    couple = records.encode_couple(np.uint32(0), uint32_max + 1)
    # the track_id parameter wraps around to b100000000000000000000000000000000
    # which is 4294967296
    assert couple == 4294967296
