import { isNode } from "browser-or-node";
import { FFT } from "dsp.js";
import { assert } from "tsafe";
import wavefile from "wavefile";
import { config } from "../../configuration";
import { ComputeSpectrogramDataOptions, SpectrogramData } from "../types";
import * as AudioUtilities from "../../utilities/audio";


/**
 * Resamples the given audio WAV file to the given sample rate.
 * For Node.js only
 */
export function resample(audio: wavefile.WaveFile, sampleRate: number): wavefile.WaveFile {
  assert(isNode);

  audio.toSampleRate(sampleRate);

  return audio;
}


function computeFFTData(
  audio: wavefile.WaveFile,
  sampleRate = config.TARGET_SAMPLE_RATE,
  windowIndex: number,
  windowDuration: number,
  FFTSize: number,
): Float64Array {
  // Calculate the start index from where the copy will take place
  const startIndex = Math.floor(sampleRate * windowIndex * windowDuration);

  // TODO: only uses one channel at the moment
  // Create the buffer for the FFT
  // Issue with length being ignored: https://github.com/nodejs/node/issues/22387
  const fftBuffer = Buffer.from(audio.getSamples()[0].buffer, startIndex, FFTSize);

  // Perform the FFT
  const fft = new FFT(FFTSize, sampleRate);
  fft.forward(fftBuffer);

  const spectrum = fft.spectrum;

  return spectrum;
}

/**
 * Computes the spectrogram data for the given audio file. Note: assumes the
 * given audio is already resampled to `sampleRate`.
 * 
 * @param audio The audio to compute the spectrogram of.
 * @param sampleRate The sample rate of the audio.
 * @param options Spectrogram options.
 */
export async function computeSpectrogramData(
  audio: wavefile.WaveFile,
  sampleRate = config.TARGET_SAMPLE_RATE,
  options: Partial<ComputeSpectrogramDataOptions> = {},
): Promise<SpectrogramData> {
  assert(isNode);

  const defaultOptions: ComputeSpectrogramDataOptions = {
    windowDuration: config.WINDOW_DURATION,
    FFTSize: config.FFT_SIZE,
    windowSmoothing: config.WINDOW_SMOOTHING,
  };

  const optionsNormalized: ComputeSpectrogramDataOptions = {
    ...defaultOptions,
    ...options,
  };
  const { FFTSize, windowDuration, windowSmoothing } = optionsNormalized;

  const duration = AudioUtilities.getWavFileDuration(
    audio.getSamples()[0].length,
    sampleRate,
  );

  // Calculate the total number of windows for the given audio source
  const numWindows = Math.floor(duration / windowDuration);
  const frequencyBinSize = Math.floor(FFTSize / 2);

  // TODO: should this be Float64Array instead???
  const data = new Uint8Array(numWindows * frequencyBinSize);

  // Compute the frequency data for each of the windows
  for (let currWindow = 0; currWindow < numWindows; currWindow++) {
    const frequencyData = computeFFTData(
      audio,
      sampleRate,
      currWindow,
      windowDuration,
      FFTSize,
    );

    data.set(frequencyData, currWindow * frequencyBinSize);
  }

  return {
    numberOfWindows: numWindows,
    frequencyBinCount: frequencyBinSize,
    data,
  };
}