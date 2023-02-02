import { SpectrogramData } from "../spectrogram/types";

// TODO: remove this?
//  as it's been replaced with the typings from core-lib native

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
