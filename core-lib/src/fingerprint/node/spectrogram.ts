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
  sampleRate = config.TARGET_SAMPLE_RATE,
  options: Partial<ComputeSpectrogramDataOptions> = {}
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

  // --- Native version ---

  const audioData = audio.channelData;

  const FFT_SIZE = 2048;
  const WINDOW_DURATION = 0.1; // seconds
  const windowSize = durationToSampleNum(WINDOW_DURATION, sampleRate);
  const hopSize =
    (windowSize / 2) % 2 === 0 ? windowSize / 2 + 1 : windowSize / 2;

  // TODO: remove
  console.log(">>> windowSize", windowSize, "FFT_SIZE", FFT_SIZE, "hopSize", hopSize, "audioData.length", audioData.length)

  const spectrogram = new CoreLibNative.Spectrogram(
    audioData,
    "blackman-harris",
    windowSize,
    hopSize,
    FFT_SIZE,
  );

  spectrogram.compute();
  const spectrogramResult = spectrogram.getSpectrogram();

  return {
    data: spectrogramResult.data,
    frequencyBinCount: spectrogramResult.numBuckets,
    numberOfWindows: spectrogramResult.numWindows,
  };
}
