export interface SpectrogramData {
  /** The number of windows in the spectrogram (x-axis) */
  numberOfWindows: number;
  /** The number of frequency bins in the spectrogram (y-axis) */
  frequencyBinCount: number;
  /** The spectrogram data */
  data: Float64Array;
}

export interface ComputeSpectrogramDataOptions {
  /** The durations (seconds) of the window */
  windowDuration: number;
  /** The number of samples in the FFT window */
  FFTSize: number;
  /** 
   * The smoothing value for the Blackman windowing function used internally
   * by the WebAudio API. 
   * Only used in the browser, ignored on Node.js environments.
   */
  windowSmoothing: number;
}

export type PartitionRanges = [number, number][];

export interface Fingerprint {
  /** The number of windows in the fingerprint (x-axis) */
  numberOfWindows: number;
  /** The number of partitions in the fingerprint (y-axis) */
  numberOfPartitions: number;
  /** The number of frequency bins that the fingerprint was generated from. */
  frequencyBinCount: number;
  /** The fingerprint tuple data. Format: [window, partition][] */
  data: Uint32Array;
  /** The associated partition ranges of the fingerprint */
  partitionRanges: PartitionRanges;
}

export interface FingerprintGeneratorOptions {
  /** The number of partitions used when computing the fingerprint. */
  partitionAmount: number;
  /** The size of the FFT window. */
  FFTSize: number;
  /** The curve that the partition ranges are calculated on. */
  partitionCurve: number;
}

export type FingerprintGeneratorFunction = (
  spectrogramData: SpectrogramData,
  options?: Partial<FingerprintGeneratorOptions>
) => Promise<Fingerprint>;
