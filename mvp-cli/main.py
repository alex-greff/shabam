import typer
import os.path
from scipy.io import wavfile
from scipy import signal
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

DATA_DIR = "data"
DEBUG_DIR = "debug"
DOWNSAMPLE_FACTOR = 4

FFT_SIZE = 4096 # 2**12

app = typer.Typer()

def _setup_dirs():
  Path(DEBUG_DIR).mkdir(parents=True, exist_ok=True)
  Path(DATA_DIR).mkdir(parents=True, exist_ok=True)

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
  wavfile.write(f"{DEBUG_DIR}/{track_title}_mono.wav", sample_rate, data_mono.astype(np.int16))

  ds_data = signal.decimate(data_mono, DOWNSAMPLE_FACTOR)
  ds_sample_rate = int(sample_rate / DOWNSAMPLE_FACTOR)
  ds_num_samples = len(ds_data)

  # Save downsampled wav file
  wavfile.write(f"{DEBUG_DIR}/{track_title}_ds.wav", ds_sample_rate, ds_data.astype(np.int16))

  # Plot time-domain data of original and downsampled audio
  x = np.linspace(0, duration, num_samples, endpoint=False)
  ds_x = np.linspace(0, duration, ds_num_samples, endpoint=False)
  plt.plot(x, data_mono, ',', ds_x, ds_data, ',')
  plt.xlabel('Time, Seconds')
  plt.legend(['data', 'decimated'], loc='best')
  plt.savefig(f"{DEBUG_DIR}/{track_title}_timedomain.png")

  _, _, Sxx = signal.spectrogram(data_mono, sample_rate, nfft=FFT_SIZE)
  Sxx = Sxx[:-1, :]

  plt.clf()
  # Plot spectrogram of mono signal
  plt.pcolormesh(Sxx, shading='flat')
  plt.yscale("symlog")
  plt.ylabel('Frequency Bins')
  plt.xlabel('Windows')
  plt.savefig(f"{DEBUG_DIR}/{track_title}_mono_freqdomain.png")

  _, _, Sxx_ds = signal.spectrogram(ds_data, ds_sample_rate, nfft=FFT_SIZE)
  Sxx_ds = Sxx_ds[:-1, :]

  plt.clf()
  # Plot spectrogram of downsampled signal
  plt.pcolormesh(Sxx_ds, shading='flat')
  plt.yscale("symlog")
  plt.ylabel('Frequency Bins')
  plt.xlabel('Windows')
  plt.savefig(f"{DEBUG_DIR}/{track_title}_ds_freqdomain.png")


@app.command()
def search(recording_filepath: str):
  print(f"TODO: search track {recording_filepath}")


if __name__ == "__main__":
  _setup_dirs()
  app()