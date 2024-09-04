from typing import List, Tuple
from math import floor

# note: num_bins = FFT_SIZE / 2
def _get_partition_range(a: int, b: int, c: int, x: int) -> Tuple[int, int]:
  """
  Given the params for the desired frequency partitioning, and index of desired
  partition, returns tuple of start and end point of the partition.

  Params:
    a: number of partitions to divide frequency range into
    b: number of bins (half of FFT size)
    c: partition curve tension
    x: the current partition number (zero-based)
  """
  def f(x):
    return floor((b/(c-1))*(c**(x/a) - 1))

  return (f(x), f(x+1)-1)

def get_partition_ranges(a: int, b: int, c: int) -> List[Tuple[int, int]]:
  """
  Given the params for the desired partitioning, returns a list of tuples
  of the start and end indexes (inclusive for both) for all the partition ranges.

  Params:
    a: number of partitions to divide frequency range into
    b: number of bins (half of FFT size)
    c: partition curve tension
  """
  return [_get_partition_range(a, b, c, x) for x in range(a)]
