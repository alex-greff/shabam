import { type WindowFunction } from "../../build/Release/core_lib_native.node";

export interface SpectrogramData {
  /** The number of windows in the spectrogram (x-axis) */
  numberOfWindows: number;
  /** The number of frequency bins in the spectrogram (y-axis) */
  frequencyBinCount: number;
  /** The spectrogram data */
  data: Float32Array;
}

export interface ComputeSpectrogramDataOptions {
  /** The durations (seconds) of the window */
  windowDuration: number;
  /** The number of samples in the FFT window */
  FFTSize: number;
  /**
   * The window function to use.
   * Only used in Node.js environments.
   */
  windowFunction: WindowFunction;
  /** 
   * The smoothing value for the Blackman windowing function used internally
   * by the WebAudio API. 
   * Only used in the browser, ignored on Node.js environments.
   */
  windowSmoothing: number;
}