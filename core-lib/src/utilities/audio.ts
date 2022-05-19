import { config } from "../configuration";
import { PartitionRanges } from "../fingerprint/types";

/**
 * Helper function used by computePartitionRanges to get the boundary indexes
 * of each partition range.
 */
function getBoundaryIndex(
  partitionIdx: number,
  totalPartitions: number,
  totalBins: number,
  partitionCurve: number
) {
  // Equation: y = b/(c-1)(c^(x/a)-1)
  //   where:
  //     a = number of partitions
  //     b = number of bins (FFT_size / 2)
  //     c = tension on the curve
  return Math.floor(
    (totalBins / (partitionCurve - 1)) *
      (Math.pow(partitionCurve, partitionIdx / totalPartitions) - 1)
  );
}

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
export function computePartitionRanges(
  partitionAmount = config.FINGERPRINT_PARTITION_AMOUNT,
  FFTSize = config.FFT_SIZE,
  partitionCurve = config.FINGERPRINT_PARTITION_CURVE
): PartitionRanges {
  if (FFTSize / 2 <= 0)
    throw "Invalid number of bins, must have more than 0 bins";
  if (partitionAmount <= 0)
    throw "Invalid number of partitions, must have more than 0 partitions";

  const ret: PartitionRanges = [];

  // Calculate the boundary ranges for each partition
  for (let partitionIdx = 0; partitionIdx < partitionAmount; partitionIdx++) {
    const min = getBoundaryIndex(
      partitionIdx,
      partitionAmount,
      FFTSize / 2,
      partitionCurve
    );
    const max = getBoundaryIndex(
      partitionIdx + 1,
      partitionAmount,
      FFTSize / 2,
      partitionCurve
    );

    ret.push([min, max]);
  }

  return ret;
}

/**
 * Gets the duration (in seconds) of a WAV file with the given number of samples
 * and sample rate.
 *
 * @param numberOfSamples The number of samples.
 * @param sampleRate The sample rate (Hz)
 */
 export function getWavFileDuration(
  numberOfSamples: number,
  sampleRate: number,
): number {
  return numberOfSamples / sampleRate;
}
