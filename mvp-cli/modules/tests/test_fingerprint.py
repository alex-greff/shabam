# pylint: disable=missing-module-docstring, missing-class-docstring, missing-function-docstring
# pylint: disable=protected-access
import pytest
from modules import fingerprint


class TestGetSliderAxisBoundaries:
  @pytest.mark.parametrize(
      ("slider_index", "slider_size", "axis_size", "use_all_of_axis",
       "expected_start_idx", "expected_end_idx"),
      [
          # Fitting slider (odd slider size):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #             |---------^---------|
          (5, 5, 9, False, 3, 7),
          # Fitting slider (even slider size):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                 |-----^---------|
          (5, 4, 9, False, 4, 7),
          # Fitting slider (touching the start):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |---------^---------|
          (2, 5, 9, False, 0, 4),
          # Fitting slider (touching the end):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                 |---------^---------|
          (6, 5, 9, False, 4, 8),
          # Fitting slider (touching the start and end):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |-----------------^-----------------|

          (4, 9, 9, False, 0, 8),
          # Fitting slider (slider size of 1):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                     |-^-|
          (5, 1, 9, False, 5, 5),
          # Fitting slider (slider size of 1 at start):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |-^-|
          (0, 1, 9, False, 0, 0),
          # Fitting slider (slider size of 1 at end):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                                 |-^-|

          (8, 1, 9, False, 8, 8),
          # Overflowing start at 1 (odd slider size)
          #     | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |---------^---------|                      (centered slider)
          #     |---------^---------|                  (shifted slider (+1))
          (1, 5, 9, False, 0, 4),
          # Overflowing start at 0 (odd slider size)
          #         | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |---------^---------|                          (centered slider)
          #         |---------^---------|                  (shifted slider (+2))
          (0, 5, 9, False, 0, 4),
          # Overflowing start (even slider size)
          #         | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |---------^-----|                              (centered slider)
          #         |---------^-----|                      (shifted slider (+2))
          (0, 4, 9, False, 0, 3),
          # Overflowing end (even slider size)
          #         | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                                 |---------^-----|   (centered slider)
          #                             |---------^-----|       (shifted slider (-1))
          (8, 4, 9, False, 5, 8),
          # Overflowing end (odd slider size)
          #         | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                             |---------^---------|   (centered slider)
          #                         |---------^---------|       (shifted slider (-2))
          (7, 5, 9, False, 4, 8),
          # Overflowing start and end
          #         | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #     |---------------------^---------------------|   (centered slider)
          #         |-----------------^-----------------|       (shifted slider (+1, -1))
          (4, 11, 9, False, 0, 8),
          # Overflowing start and fills up to end
          #         | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #     |---------------------^-----------------|       (centered slider)
          #         |-----------------^-----------------|       (shifted slider (+1, -1))
          (4, 10, 9, False, 0, 8),

          # Use all of axis (slider size of 1):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                     |-^-|
          # |-----------------^-----------------|   (returned slider)
          (5, 1, 9, True, 0, 8),
          # Use all of axis (even slider size):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                 |-----^-----|
          # |-----------------^-----------------|   (returned slider)
          (5, 3, 9, True, 0, 8),
          # Use all of axis (odd slider size):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                 |-----^-|
          # |-----------------^-----------------|   (returned slider)
          (5, 2, 9, True, 0, 8),
          # Use all of axis (slider size fills entire axis):
          # | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |-----------------^-----------------|
          # |-----------------^-----------------|   (returned slider)
          (5, 9, 9, True, 0, 8),
          # Use all of axis (slider overflows start):
          #     | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |---------^---------|                           (centered slider)
          #     |-----------------^-----------------|   (returned slider)
          (1, 5, 9, True, 0, 8),
          # Use all of axis (slider overflows end):
          #     | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          #                         |---------^---------|   (centered slider)
          #     |-----------------^-----------------|       (returned slider)
          (7, 5, 9, True, 0, 8),
          # Use all of axis (slider overflows start and end):
          #     | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
          # |---------------------^---------------------|   (centered slider)
          #     |-----------------^-----------------|       (returned slider)
          (4, 11, 9, True, 0, 8),
      ]
  )
  def test_get_slider_axis_boundaries(
      self,
      slider_index: int,
      slider_size: int,
      axis_size: int,
      use_all_of_axis: bool,
      expected_start_idx: int,
      expected_end_idx: int,
  ):
    start_idx, end_idx = fingerprint._get_slider_axis_boundaries(
        slider_index, slider_size, axis_size, use_all_of_axis=use_all_of_axis)

    assert start_idx == expected_start_idx
    assert end_idx == expected_end_idx
