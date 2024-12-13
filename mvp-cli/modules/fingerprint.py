"""Module for computing fingerprints."""

from typing import List, Tuple
from math import floor
import nptyping as npt
import numpy as np
from scipy.signal import windows
import modules.config as config
import math

PartitionRange = Tuple[int, int]

# NOTE: num_bins = FFT_SIZE / 2


def _get_partition_range(a: int, b: int, c: int, x: int) -> PartitionRange:
  """
  Given the params for the desired frequency partitioning, and index of desired
  partition, returns tuple of start and end point of the partition.

  Params:
    `a`: number of partitions to divide frequency range into
    `b`: number of bins (half of FFT size)
    `c`: partition curve tension
    `x`: the current partition number (zero-based)
  Returns:
    A tuple of (`start`, `end`) where `start` and `end` respectively are the
    start and end indexes (inclusive) of the partition
  """
  def f(x):
    return floor((b/(c-1))*(c**(x/a) - 1))

  return (f(x), f(x+1)-1)


def get_partition_ranges(a: int, b: int, c: int) -> List[PartitionRange]:
  """
  Given the params for the desired partitioning, returns a list of tuples
  of the start and end indexes (inclusive for both) for all the partition ranges.

  Params:
    `a`: number of partitions to divide frequency range into
    `b`: number of bins (half of FFT size)
    `c`: partition curve tension
  Returns:
    A list of `PartitionRange` tuples

    where,
      `PartitionRange` is a tuple of (`start`, `end`) where `start` and `end`
      respectively are the start and end indexes (inclusive) of the given
      partition
  """
  return [_get_partition_range(a, b, c, x) for x in range(a)]


def _get_slider_axis_boundaries(
    slider_center_index: int,
    slider_width: int,
    axis_size: int,
    use_all_of_axis=False,
) -> Tuple[int, int]:
  """
  Determine the slider range for the given axis.

  When we near the edge of a slider range (either at the front or end
  of the array), the slider with not fit around the centerpoint equally
  on both sides. In these cases, we still keep the same slider size but
  simply shift it enough to still fit within the range. The only time the slider
  will be shrunk is when the slider shifted slider does not fit the given axis
  range.

  ```txt
  Ex 1: fitting slider
  slider_width = 5, num_windows = 9
          | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
                      |---------^---------|      (fitting slider)
  ```

  ```txt
  Ex 2: overflowing left side at 1
  slider_width = 5, num_windows = 9
          | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
      |---------^---------|                      (centered slider)
          |---------^---------|                  (shifted slider (+1))
  ```

  ```txt
  Ex 3: overflowing left side at 0
  slider_width = 5, num_windows = 9
          | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
  |---------^---------|                          (centered slider)
          |---------^---------|                  (shifted slider (+2))
  ```

  ```txt
  Ex 4: overflowing right side
  slider_width = 5, num_windows = 9
          | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
                                  |---------^---------|   (centered slider)
                          |---------^---------|           (shifted slider (-2))

  Params:
    `slider_index`: the current slider index used
    `slider_size`: the size of the slider
    `axis_size`: the number of items in the axis
    `use_all_of_axis`: if set to `True` the function will always return the entire
      axis range
  Returns:
    A tuple `(slider_start_idx, slider_end_idx)`

    where,
      `slider_start_idx` and `slider_end_idx` are the adjusted start and end
      indexes (both inclusive) of the slider
  """
  if use_all_of_axis:
    return 0, axis_size - 1

  # trim the left slider size to handle the even slider size case
  slider_size_left = slider_width // 2 if slider_width % 2 == 1 else slider_width // 2 - 1
  slider_size_right = slider_width // 2

  slider_shift_start = 0
  slider_shift_end = 0
  # The slider is overflowing the left of the axis
  if slider_center_index - slider_size_left < 0:
    slider_shift_end = slider_size_left - slider_center_index
  # The slider is overflowing the right of the axis
  if slider_center_index + slider_size_right >= axis_size:
    slider_shift_start = (axis_size - 1) - \
        slider_center_index - slider_size_right

  # both are inclusive indexes
  slider_start_idx = max(slider_center_index - slider_size_left +
                         slider_shift_start, 0)
  slider_end_idx = min(slider_center_index + slider_size_right +
                       slider_shift_end, axis_size - 1)

  return slider_start_idx, slider_end_idx


def _get_slider_boundaries(
    curr_window: int,
    curr_partition: int,
    num_windows: int,
    num_partitions: int,
    slider_width: int,
    slider_height: int,
    use_all_partitions=False
) -> Tuple[Tuple[int, int], Tuple[int, int]]:
  """
  Determine the slider range.

  When we near the edge of a slider range (either at the front or end
  of the array), the slider with not fit around the centerpoint equally
  on both sides. In these cases, we still keep the same slider size but
  simply shift it enough to still fit within the range.

  Params:
    `curr_window`: the current window index used
    `curr_partition`: the current partition index used
    `num_windows`: the total number of windows used
    `num_partitions`: the total number number of partitions used
    `slider_width`: the width of the slider
    `slider_height`: the height of the slider
    `use_all_partitions`: if set to `True` the function will ignore the `slider_height`
      param and use the all the partitions (default: `False`)
  Returns:
      A tuple ((`slider_x_start_idx`, `slider_y_start_idx`), (`slider_x_end_idx`, `slider_y_end_idx`))

      where,
        `slider_x_start_idx` and `slider_x_end_idx` are the adjusted start and
        end indexes (both inclusive) of the x (window) slider

        `slider_y_start_idx` and `slider_y_end_idx` are the adjusted start and
        end indexes (both inclusive) of the y (partition) slider
  """

  slider_x_start_idx, slider_x_end_idx = _get_slider_axis_boundaries(
      curr_window, slider_width, num_windows, False)

  slider_y_start_idx, slider_y_end_idx = _get_slider_axis_boundaries(
      curr_partition, slider_height, num_partitions, use_all_of_axis=use_all_partitions)

  return ((slider_x_start_idx, slider_y_start_idx), (slider_x_end_idx, slider_y_end_idx))


def _get_number_of_sliders(
    slider_width: int,
    slider_step: int,
    num_windows: int,
    count_overflow_sliders=True,
) -> int:
  """
  Calculates how many sliders will be needed for a given window range.

  Params:
    `slider_width`: width of the slider
    `slider_step`: step of the slider
    `num_windows`: the number of windows in the range
    `count_overflow_sliders`: flag that indicates of overflowing sliders should be
      accounted for in the calculation
  Returns: the number of sliders needed
  """
  if slider_width > num_windows:
    if count_overflow_sliders:
      return 1
    else:
      return 0

  if slider_step >= slider_width:
    if count_overflow_sliders:
      return math.ceil(num_windows / slider_step)
    else:
      # The equation has two parts:
      # * `math.floor(num_windows / slider_step)` calculates how many sliders with
      # the padding from the slider step can be fit
      # * `1 if num_windows % slider_step >= slider_width else 0` is for accounting
      # for the case where another slider can be fully fit at the end but not
      # all its tailing padding. `num_windows % slider_step` gives us the
      # remaining space left over from fully fitting the sliders with padding
      # with no overflows
      return (math.floor(num_windows / slider_step)
              + (1 if num_windows % slider_step >= slider_width else 0))
  else:  # slider_step < slider_width
    if count_overflow_sliders:
      return math.ceil(num_windows / slider_step)
    else:
      # The equation essentially rephrases the `math.ceil(num_windows / slider_step)`
      # equation by handling the the first slider for it's whole width and then
      # each subsequent slider is treated as a mini slider with a width of slider_step
      # (which is what the equation handles) and the +1 at the end is to account
      # for the entire width slider match
      return math.floor((num_windows - slider_width) / slider_step) + 1


def compute_fingerprint(
    data: npt.NDArray,
    partition_ranges: List[PartitionRange],
    ds_sample_rate: int,
) -> npt.NDArray:
  """
  Computes the fingerprint with the given audio spectrogram data and
  partition ranges.

  Params:
    `data`: NDArray of shape (num windows, num bins)
    `partition_ranges`: the partition ranges
  Returns: a tuple of
    `fingerprint`: an NDArray of shape (num windows, num partitions)
    `slider_width`: number of samples used for the slider width
    `slider_height`: number of samples used for the slider height
    `slider_step`: slider step in samples
  """
  num_partitions = len(partition_ranges)
  num_windows, num_bins = data.shape

  # Compute the cell data by finding the strongest frequency of each cell in
  # the spectrogram
  strongest_cells = np.zeros([num_windows, num_partitions])
  for curr_window in range(num_windows):
    for curr_partition in range(num_partitions):
      partition_start_idx, partition_end_idx = partition_ranges[curr_partition]

      max_freq_val = -np.inf
      # +1 since end index is inclusive
      for curr_partition_idx in range(partition_start_idx, partition_end_idx + 1):
        curr_freq_value = data[curr_window][curr_partition_idx]

        if curr_freq_value > max_freq_val:
          max_freq_val = curr_freq_value

      strongest_cells[curr_window][curr_partition] = max_freq_val

  assert config.SLIDER_SIZE_MS is not None or config.SLIDER_SIZE_SAMP is not None, "Error: one of SLIDER_SIZE_MS or SLIDER_SIZE_SAMP must not be None"
  assert config.SLIDER_STEP_MS is not None or config.SLIDER_STEP_SAMP is not None, "Error: one of SLIDER_STEP_MS or SLIDER_STEP_SAMP must not be None"

  if config.SLIDER_SIZE_SAMP is not None:
    assert config.SLIDER_SIZE_SAMP % 2 == 1, "Error: SLIDER_SIZE_SAMP must be an odd number"
  slider_width = (round((config.SLIDER_SIZE_MS / 1000) * ds_sample_rate)
                  if config.SLIDER_SIZE_SAMP is None else config.SLIDER_SIZE_SAMP)  # samples
  assert slider_width is not None
  # adjust slider width to be odd numbered
  if slider_width % 2 == 0:
    slider_width += 1

  slider_step = (round((config.SLIDER_STEP_MS / 1000) * ds_sample_rate)
                 if config.SLIDER_STEP_SAMP is None else config.SLIDER_STEP_SAMP)  # samples
  assert slider_step is not None

  # TODO: remove
  # slider_width = config.SLIDER_WIDTH
  # assert slider_width % 2 == 1, "Error: slider width must be an odd number"
  slider_height = config.SLIDER_HEIGHT if config.SLIDER_HEIGHT > 0 else num_partitions
  slider_size = slider_width * slider_height

  window = windows.get_window(config.WINDOW_FUNCTION_CONFIG, slider_width)
  assert len(window) == slider_width  # for sanity

  use_all_partitions = config.SLIDER_HEIGHT <= 0

  # The number of sliders that will be processed
  num_sliders = _get_number_of_sliders(
      slider_width, slider_step, num_windows, count_overflow_sliders=True)

  passed_cells: npt.NDArray = np.zeros(
      [num_sliders, num_partitions], dtype='bool')
  num_passed_cells = 0

  # TODO: remove
  print(">>> slider_width", slider_width,
        ds_sample_rate, num_sliders, num_windows)

  for slider_idx in range(num_sliders):
    curr_window = slider_idx * slider_step
    for curr_partition in range(num_partitions):
      slider_start_idxs, slider_end_idxs = _get_slider_boundaries(
          curr_window, curr_partition, num_windows, num_partitions, slider_width,
          slider_height, use_all_partitions=use_all_partitions)
      slider_x_start_idx, slider_y_start_idx = slider_start_idxs
      slider_x_end_idx, slider_y_end_idx = slider_end_idxs

      # Compute the mean value of the slider, weighted by the windowing function
      slider_mean = 0
      for sx in range(slider_x_start_idx, slider_x_end_idx + 1):
        # The center point of the window fn array is where the curr_window
        # value is located, thus we need to calculate the offset of sx from that
        slider_x_offset = curr_window - sx
        curr_window_fn_val = window[slider_x_offset]

        for sy in range(slider_y_start_idx, slider_y_end_idx + 1):
          slider_mean += curr_window_fn_val * strongest_cells[sx][sy]
      slider_mean = slider_mean / slider_size

      # Compute the variance of the slider, weighted by the window function
      slider_variance = 0
      for sx in range(slider_x_start_idx, slider_x_end_idx + 1):
        for sy in range(slider_y_start_idx, slider_y_end_idx + 1):
          slider_variance += np.power(strongest_cells[sx][sy] - slider_mean, 2)
      slider_variance = slider_variance / slider_size

      # Compute the standard deviation of the slider
      slider_standard_deviation = np.sqrt(slider_variance)

      # Determine if the current cell passes
      cell_value = strongest_cells[curr_window][curr_partition]
      threshold_value = slider_mean + slider_standard_deviation * \
          config.STANDARD_DEVIATION_MULTIPLIER

      passes = cell_value > threshold_value
      if passes:
        passed_cells[slider_idx][curr_partition] = True
        num_passed_cells += 1

  return passed_cells, slider_width, slider_height, slider_step


def to_flat_fingerprint(fp: npt.NDArray) -> npt.NDArray:
  """
  Converts a given window x partition fingerprint 2D matrix to a flat
  1D array of tuples (window index, partition index) marking the position of
  each hit in the fingerprint 2D matrix.

  Params:
    `fp`: the window x partition fingerprint 2D matrix
  Returns:
    A 1D array of tuples (window index, partition index)
  """

  fp_flat = np.argwhere(fp > 0)
  return fp_flat
