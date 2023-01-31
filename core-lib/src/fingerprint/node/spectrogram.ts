import { isNode } from "browser-or-node";
import { assert } from "tsafe";
import { config } from "../../configuration";
import { ComputeSpectrogramDataOptions, SpectrogramData } from "../types";
import { WavFileData } from "./loader";
import CoreLibNative from "../../../build/Release/core_lib_native.node";

/**
 * Converts the given duration (in seconds) to the number of samples it is at
 * the given sample rate.
 */
function durationToSampleNum(duration: number, sampleRate: number) {
  return duration * sampleRate;
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
  audio: WavFileData,
  options: Partial<ComputeSpectrogramDataOptions> = {}
): Promise<SpectrogramData> {
  assert(isNode);

  const defaultOptions: ComputeSpectrogramDataOptions = {
    windowDuration: config.SPECTROGRAM_WINDOW_DURATION,
    FFTSize: config.SPECTROGRAM_FFT_SIZE,
    windowFunction: config.SPECTROGRAM_WINDOW_FUNCTION,
    // NOTE: unused
    windowSmoothing: config.SPECTROGRAM_WINDOW_SMOOTHING,
  };

  const optionsNormalized: ComputeSpectrogramDataOptions = {
    ...defaultOptions,
    ...options,
  };
  const { FFTSize, windowDuration, windowFunction } = optionsNormalized;

  // --- Native version ---

  const audioData = audio.channelData;

  const windowSize = durationToSampleNum(windowDuration, audio.sampleRate);
  const hopSize =
    (windowSize / 2) % 2 === 0 ? windowSize / 2 + 1 : windowSize / 2;

  const spectrogram = new CoreLibNative.Spectrogram(
    audioData,
    windowFunction,
    windowSize,
    hopSize,
    FFTSize
  );

  spectrogram.compute();
  const spectrogramResult = spectrogram.getSpectrogram();

  return {
    data: spectrogramResult.data,
    frequencyBinCount: spectrogramResult.numBuckets,
    numberOfWindows: spectrogramResult.numWindows,
  };
}
