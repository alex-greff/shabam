import { SpectrogramData } from "../spectrogram/types";
import { type WindowFunction } from "../../build/Release/core_lib_native.node";

export type PartitionRanges = [number, number][];

export interface FingerprintData {
  /** The number of windows in the fingerprint (x-axis) */
  numWindows: number;
  /** The number of partitions in the fingerprint (y-axis) */
  numPartitions: number;
  /** The number of frequency bins that the fingerprint was generated from. */
  numBuckets: number;
  /** The partition ranges used to compute the fingerprint. */
  partitionRanges: PartitionRanges;
  /** The fingerprint tuple data. Format: [window, partition][] */
  data: Uint32Array;
}

export interface FingerprintConfig {
  /**
   * Number of partitions in the fingerprints. Higher values result in steeper
   * curves.
   * 
   * Range: [1, infinity)
   */
  partitionAmount: number;

  /**
   * Curve used to calculate partitions.
   * Range: (1, infinity)
   */
  partitionCurve: number;

  /**
   * Number of windows on each side of the slider
   * TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH + 1
   */
  slidingWindowWidth: number;

  /**
   * Number of windows above and below the slider
   * TOTAL_SLIDER_HEIGHT = 2 * FINGERPRINT_SLIDER_HEIGHT + 1
   */
  slidingWindowHeight: number;

  /**
   * How much of the standard deviation is added to the fingerprint cell
   * acceptance threshold value.
   * In general, larger values make the fingerprint cell filtering more
   * sensitive.
   * <0: the standard deviation is subtracted from the mean
   * 0: no weight (only the mean is used)
   * 1: entire standard deviation is added
   * >1: more than the entire standard deviation is added
   */
  standardDeviationMultiplier: number;
}

export type FingerprintGeneratorFunction = (
  spectrogramData: SpectrogramData,
  options?: Partial<FingerprintConfig>
) => Promise<FingerprintData>;
