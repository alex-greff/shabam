"""Module for computing fingerprints."""

from typing import List, Tuple
from math import floor
import nptyping as npt
import numpy as np
import modules.config as config
from scipy.signal import windows

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


def _get_slider_boundaries(
    curr_window: int,
    curr_partition: int,
    num_windows: int,
    num_partitions: int,
    slider_width: int,
    slider_height: int,
    use_all_partitions=False
) -> Tuple[Tuple[int, int], Tuple[int, int]]:
  '''
  Determine the slider range.

  When we near the edge of a slider range (either at the front or end
  of the array), the slider with not fit around the centerpoint equally
  on both sides. In these cases, we still keep the same slider size but
  simply shift it enough to still fit within the range.

  ```txt
  Ex 1: fitting slider
  slider_width = 5, num_windows = 9
    |   |   |   |   |   |   |   |   |   |
    0   1   2   3   4   5   6   7   8   9
                          ^
                |-------------------|     (fitting slider)
  ```

  ```txt
  Ex 2: overflowing left side at 1
  slider_width = 5, num_windows = 9
         |   |   |   |   |   |   |   |   |   |
         0   1   2   3   4   5   6   7   8   9
               ^
     |-------------------|       (centered slider)
         |-------------------|   (shifted slider (+1))
  ```

  ```txt
  Ex 3: overflowing left side at 0
  slider_width = 5, num_windows = 9
          |   |   |   |   |   |   |   |   |   |
          0   1   2   3   4   5   6   7   8   9
            ^
  |-------------------|           (centered slider)
          |-------------------|   (shifted slider (+2))
  ```

  ```txt
  Ex 4: overflowing right side
  slider_width = 5, num_windows = 9
    |   |   |   |   |   |   |   |   |   |
    0   1   2   3   4   5   6   7   8   9
                                      ^
                            |-------------------|   (centered slider)
                    |-------------------|           (shifted slider (-2))
  ```

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
        end indexes (inclusive) of the x (window) slider

        `slider_y_start_idx` and `slider_y_end_idx` are the adjusted start and
        end indexes (inclusive) of the y (partition) slider
  '''

  slider_width_half = slider_width // 2
  slider_height_half = slider_height // 2

  slider_width_shift_start = 0
  slider_width_shift_end = 0
  # The slider window is overflowing the left
  if curr_window - slider_width_half < 0:
    slider_width_shift_start = slider_width_half - curr_window
  # The slider width is overflowing the right
  if curr_window + slider_width_half >= num_windows:
    slider_width_shift_end = (num_windows - 1) - \
        curr_window - slider_width_half

  # Same kind of calculations for the height slider
  slider_height_shift_start = 0
  slider_height_shift_end = 0
  if curr_partition - slider_height_half < 0:
    slider_height_shift_start = slider_height_half - curr_partition
  elif curr_partition + slider_height_half >= num_partitions:
    slider_height_shift_end = (num_partitions - 1) - \
        curr_partition - slider_height_half

  # inclusive
  slider_x_start_idx = curr_window - slider_width_half + slider_width_shift_start
  # inclusive
  slider_x_end_idx = curr_window + slider_width_half + slider_width_shift_end

  # inclusive
  slider_y_start_idx = curr_partition - \
      slider_height_half + slider_height_shift_start if not use_all_partitions else 0
  # inclusive
  slider_y_end_idx = curr_partition + slider_height_half + \
      slider_height_shift_end if not use_all_partitions else num_partitions - 1

  return ((slider_x_start_idx, slider_y_start_idx), (slider_x_end_idx, slider_y_end_idx))


def compute_fingerprint(
    data: npt.NDArray, partition_ranges: List[PartitionRange]
) -> npt.NDArray:
  """
  Computes the fingerprint with the given audio spectrogram data and
  partition ranges.

  Params:
    `data`: NDArray of shape (num windows, num bins)
    `partition_ranges`: the partition ranges
  Returns:
    An NDArray of shape (num windows, num partitions)
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

  slider_width = config.SLIDER_WIDTH
  assert slider_width % 2 == 1, "Error: slider width must be an odd number"
  slider_height = config.SLIDER_HEIGHT if config.SLIDER_HEIGHT > 0 else num_partitions
  slider_size = slider_width * slider_height

  window = windows.get_window(config.WINDOW_FUNCTION_CONFIG, slider_width)
  assert len(window) == slider_width  # for sanity

  # Compute the fingerprint data
  passed_cells: npt.NDArray = np.zeros(
      [num_windows, num_partitions], dtype='bool')
  num_passed_cells = 0

  for curr_window in range(num_windows):
    for curr_partition in range(num_partitions):
      slider_start_idxs, slider_end_idxs = _get_slider_boundaries(
          curr_window, curr_partition, num_windows, num_partitions, slider_width,
          slider_height, config.SLIDER_HEIGHT <= 0)
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
        passed_cells[curr_window][curr_partition] = True
        num_passed_cells += 1

  return passed_cells


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
