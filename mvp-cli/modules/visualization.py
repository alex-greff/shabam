
from typing import List, Optional, Tuple
import matplotlib.pyplot as plt
from numerize import numerize
import numpy as np
import nptyping as npt
import modules.fingerprint as fingerprint

def _generate_xaxis_formatter(num_windows: int, duration: float):
  def xaxis_formatter(x: float, pos):
    curr_time = round(x/num_windows*duration, 2)
    return str(curr_time)
  return xaxis_formatter

def _generate_yaxis_formatter(sample_rate: int, num_bins: int):
  max_freq = sample_rate / 2 # Nyquist theorem
  def yaxis_formatter(x: float, pos):
    # print(">>> x", x, num_bins)
    curr_freq = int((x / num_bins) * max_freq)
    return numerize.numerize(curr_freq, 1)
  return yaxis_formatter

def graph_timedomain(
    duration: float,
    data: npt.NDArray,
    data_ds: npt.NDArray,
    save_path: str,
    title: str
):
  num_samples = len(data)
  num_samples_ds = len(data_ds)

  plt.clf()

  x = np.linspace(0, duration, num_samples, endpoint=False)
  ds_x = np.linspace(0, duration, num_samples_ds, endpoint=False)
  plt.plot(x, data, ',', ds_x, data_ds, ',')
  plt.title(title)
  plt.xlabel('Time (s)')
  plt.legend(['data', 'downsampled'], loc='best')
  plt.savefig(save_path)

def graph_spectrogram(
    spectrogram_data: npt.NDArray,
    sample_rate: int,
    duration: float,
    save_path: str,
    title: str,
    partition_ranges: Optional[List[fingerprint.PartitionRange]] = None,
):
  num_bins, num_windows = spectrogram_data.shape

  plt.clf()

  # Plot spectrogram of mono signal
  ax = plt.subplot()
  plt.pcolormesh(spectrogram_data, shading='flat')
  plt.yscale("symlog")
  # plt.yscale("linear")
  plt.title(title)
  plt.ylabel('Frequency (Hz)')
  plt.xlabel('Time (s)')
  ax.yaxis.set_major_formatter(_generate_yaxis_formatter(sample_rate, num_bins))
  ax.xaxis.set_major_formatter(_generate_xaxis_formatter(num_windows, duration))

  # Plot partition ranges, if provided
  if partition_ranges is not None:
    for idx, (start, end) in enumerate(partition_ranges):
      color = 'gray' if idx % 2 == 1 else 'darkgray'
      plt.fill_between([0, num_windows], y1=start, y2=end+1, color=color, alpha=0.2, linewidth=0)

  plt.savefig(save_path)

def graph_fingerprint(
    fingerprint_data: npt.NDArray,
    sample_rate: int,
    duration: float,
    save_path: str,
    title: str,
    partition_ranges: Optional[List[fingerprint.PartitionRange]] = None,
):
  num_windows, num_partitions = fingerprint_data.shape

  plt.clf()

  ax = plt.subplot()
  ax.set_facecolor('dimgrey')

  # Plot points
  for x in range(num_windows):
    for y in range(num_partitions):
      passes = fingerprint_data[x][y]
      if passes:
        plt.plot(x, y + 0.5, '*c', linewidth=2, markersize=2)

  plt.margins(0,0)

  plt.yscale("symlog")
  # plt.yscale("linear")
  plt.title(title)
  plt.ylabel('Frequency (Hz)')
  plt.xlabel('Time (s)')
  ax.yaxis.set_major_formatter(_generate_yaxis_formatter(sample_rate, num_partitions))
  ax.xaxis.set_major_formatter(_generate_xaxis_formatter(num_windows, duration))

  # Plot partition ranges, if provided
  if partition_ranges is not None:
    for idx in range(num_partitions):
      color = 'gray' if idx % 2 == 1 else 'darkgray'
      plt.fill_between([0, num_windows], y1=idx, y2=idx+1, color=color, alpha=0.2, linewidth=0)

  plt.savefig(save_path)