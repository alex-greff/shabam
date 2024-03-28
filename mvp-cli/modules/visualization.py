
import matplotlib.pyplot as plt
from numerize import numerize
import numpy as np
import numpy.typing as npt

def _generate_xaxis_formatter(num_windows: int, duration: float):
  def xaxis_formatter(x: float, pos):
    curr_time = round(x/num_windows*duration, 2)
    return str(curr_time)
  return xaxis_formatter

def _generate_yaxis_formmatter(sample_rate: int, num_bins: int):
  max_freq = sample_rate / 2 # Nyquist theorem
  def yaxis_formatter(x: float, pos):
    curr_freq = int((x / num_bins) * max_freq)
    return numerize.numerize(curr_freq, 1)
  return yaxis_formatter

def graph_timedomain(
    duration: float,
    data: npt.NDArray,
    data_ds: npt.NDArray,
    save_path: str,
):
  num_samples = len(data)
  num_samples_ds = len(data_ds)

  plt.clf()

  x = np.linspace(0, duration, num_samples, endpoint=False)
  ds_x = np.linspace(0, duration, num_samples_ds, endpoint=False)
  plt.plot(x, data, ',', ds_x, data_ds, ',')
  plt.xlabel('Time (s)')
  plt.legend(['data', 'downsampled'], loc='best')
  plt.savefig(save_path)

def graph_spectrogram(
    spectrogram_data: npt.NDArray,
    sample_rate: int,
    duration: float,
    save_path: str
):
  num_bins = spectrogram_data.shape[0]
  num_windows = spectrogram_data.shape[1]

  plt.clf()
  # Plot spectrogram of mono signal
  ax = plt.subplot()
  plt.pcolormesh(spectrogram_data, shading='flat')
  plt.yscale("symlog")
  # plt.yscale("linear")
  plt.ylabel('Frequency (Hz)')
  plt.xlabel('Time (s)')
  ax.yaxis.set_major_formatter(_generate_yaxis_formmatter(sample_rate, num_bins))
  ax.xaxis.set_major_formatter(_generate_xaxis_formatter(num_windows, duration))
  plt.savefig(save_path)