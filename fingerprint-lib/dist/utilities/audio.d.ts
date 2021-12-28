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
