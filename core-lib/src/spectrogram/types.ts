import { type WindowFunction } from "../../build/Release/core_lib_native.node";

export interface SpectrogramData {
  /** The number of windows in the spectrogram (x-axis) */
  numWindows: number;
  /** The number of frequency bins in the spectrogram (y-axis) */
  numBuckets: number;
  /** The spectrogram data */
  data: Float32Array;
}

export interface SpectrogramConfig {
  /**
   * Sample size of the FFT.
   */
  FFTSize: number;

  /**
   * The windowing function to use when computing the spectrogram.
   */
  windowFunction: WindowFunction;

  /**
   * Duration of the spectrogram/fingerprint window (seconds).
   * Note: the window size (sample rate * window duration) should be less than
   * the configured FFT size.
   */
  windowDuration: number;
}