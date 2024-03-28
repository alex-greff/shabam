import typer
import os.path
from scipy.io import wavfile
from scipy import signal
from scipy.signal import windows
import numpy as np
import numpy.typing as npt
from pathlib import Path
import modules.initialization as initialization
import modules.visualization as visualization
import modules.config as config

app = typer.Typer()

@app.command()
def add(track_filepath: str):
  if not os.path.isfile(track_filepath):
    print(f"File '{track_filepath}' is not a file")
    exit(1)

  track_title = Path(track_filepath).stem

  sample_rate, data = wavfile.read(track_filepath)
  data_mono = data.mean(axis=1)
  num_samples = len(data_mono)
  duration = num_samples / sample_rate # seconds 

  # Save mono wav file
  wavfile.write(f"{config.DEBUG_DIR}/{track_title}_mono.wav", sample_rate, data_mono.astype(np.int16))

  ds_data = signal.decimate(data_mono, config.DOWNSAMPLE_FACTOR)
  ds_sample_rate = int(sample_rate / config.DOWNSAMPLE_FACTOR)

  # Save downsampled wav file
  wavfile.write(f"{config.DEBUG_DIR}/{track_title}_ds.wav", ds_sample_rate, ds_data.astype(np.int16))

  visualization.graph_timedomain(
    duration,
    data_mono,
    ds_data,
    f"{config.DEBUG_DIR}/{track_title}_timedomain.png"
  )

  _, _, Sxx = signal.spectrogram(data_mono, sample_rate, nfft=config.FFT_SIZE)
  Sxx: npt.NDArray = Sxx[:-1, :]

  print(f"Sxx.shape {Sxx.shape}") # TODO: remove

  # g_std = 12  # standard deviation for Gaussian window in samples
  # # win = windows.gaussian(20, std=g_std, sym=True)  # symmetric Gaussian wind.
  # win = windows.tukey(1024)
  # SFT = signal.ShortTimeFFT(win, hop=256, fs=1/sample_rate, mfft=config.FFT_SIZE, scale_to='psd')
  # Sxx = SFT.spectrogram(data_mono)  # calculate absolute square of STFT

  # print(f"win {win}")
  # print(f"data_mono.shape {data_mono.shape}") # TODO: remove
  # print(f"Sxx.shape {Sxx.shape}") # TODO: remove

  visualization.graph_spectrogram(
    Sxx,
    sample_rate,
    duration,
    f"{config.DEBUG_DIR}/{track_title}_mono_freqdomain.png"
  )

  _, _, Sxx_ds = signal.spectrogram(ds_data, ds_sample_rate, nfft=config.FFT_SIZE)
  Sxx_ds: npt.NDArray = Sxx_ds[:-1, :]

  print(f"Sxx_ds.shape {Sxx_ds.shape}") # TODO: remove

  visualization.graph_spectrogram(
    Sxx_ds,
    ds_sample_rate,
    duration,
    f"{config.DEBUG_DIR}/{track_title}_ds_freqdomain.png"
  )


@app.command()
def search(recording_filepath: str):
  print(f"TODO: search track {recording_filepath}")


if __name__ == "__main__":
  initialization.setup_dirs()
  app()