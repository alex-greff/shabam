import { PartitionRanges } from "../types";
/**
 * Computes the partition ranges for the given FFT size in respect to the
 * number of partitions needed.
 * Returns an array of tuples (2 element arrays) of the computed
 * partition ranges.
 *
 * @param partitionAmount The number of partitions to split into.
 * @param FFTSize The size of the FFT window.
 * @param partitionCurve The curve that the partition ranges are calculated on.
 */
export declare function computePartitionRanges(partitionAmount?: number, FFTSize?: number, partitionCurve?: number): PartitionRanges;
/**
 * Gets the duration (in seconds) of a WAV file with the given number of samples
 * and sample rate.
 *
 * @param numberOfSamples The number of samples.
 * @param sampleRate The sample rate (Hz)
 */
export declare function getWavFileDuration(numberOfSamples: number, sampleRate: number): number;
