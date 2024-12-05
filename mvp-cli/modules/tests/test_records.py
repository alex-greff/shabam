from modules import records


class TestEncodeCouple:
  def test_zeros(self):
    couple = records.encode_couple(0, 0)
    assert couple == 0
