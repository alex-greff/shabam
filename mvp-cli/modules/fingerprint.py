from typing import List, Tuple
# import modules.config as config
from math import floor

# note: num_bins = FFT_SIZE / 2
def _get_partition_range(a: int, b: int, c: int, x: int) -> Tuple[int, int]:
  """
  Given params for desired frequency partitioning, and index of desired partition,
    returns tuple of start and end point of the partition
  a: number of partitions to divide frequency range into
  b: number of bins (half of FFT size)
  c: partition curve tension
  """
  def f(x):
    return floor((b/(c-1))*(c**(x/a) - 1))

  return (f(x), f(x+1)-1)

def _get_partition_ranges(a: int, b: int, c: int) -> List[Tuple[int, int]]:
  return [_get_partition_range(a, b, c, x) for x in range(a)]
