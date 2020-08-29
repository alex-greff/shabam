import range from "lodash/range";
import {
  SpectrogramData,
  FingerprintGeneratorOptions,
  PartitionRanges,
  FingerprintGeneratorFunction,
} from "@/audio/types";
import { MeanStorage } from "@/audio/MeanStorage";
import { computePartitionRanges } from "@/audio/utilities";
import * as AudioConstants from "@/audio/constants";

/**
 * Computes the mean of the given slider window.
 *
 * @param currPartitionIdx The current partition index.
 * @param sliderPartitionIdxs The array of slider partition window indexes.
 * @param meanStorage The current mean storage instance.
 */
function computeSliderMean(
  currPartitionIdx: number,
  sliderPartitionIdxs: number[],
  meanStorage: MeanStorage
): number {
  return (
    sliderPartitionIdxs.reduce((acc, currSliderIdx) => {
      const nCurrCellMean = meanStorage.getCellMean(
        currSliderIdx,
        currPartitionIdx
      );
      return acc + nCurrCellMean;
    }, 0) / sliderPartitionIdxs.length
  );
}

/**
 * Computes the standard deviation of the given slider window.
 *
 * @param spectrogramData The spectrogram data.
 * @param currPartitionIdx The current partition index.
 * @param sliderPartitionIdxs The array of slider partition window indexes.
 * @param sliderMean The mean of the current slider window.
 * @param partitionRanges The computed partition ranges.
 */
function computeSliderStandardDeviation(
  spectrogramData: SpectrogramData,
  currPartitionIdx: number,
  sliderPartitionIdxs: number[],
  sliderMean: number,
  partitionRanges: PartitionRanges
) {
  const currPartitionRange = partitionRanges[currPartitionIdx];
  const partitionStartIdx = currPartitionRange[0];
  const partitionEndIdx = currPartitionRange[1];
  const currPartitionAmount = currPartitionRange[1] - currPartitionRange[0];

  const partitionFreqNum = currPartitionAmount * sliderPartitionIdxs.length;

  // Iterate each slider partition
  const sliderStandardDeviation = Math.sqrt(
    sliderPartitionIdxs.reduce((acc, currSliderIdx) => {
      const spectrogramSliceStartIdx =
        spectrogramData.numberOfWindows * currSliderIdx + partitionStartIdx;
      const spectrogramSliceEndIdx =
        spectrogramData.numberOfWindows * currSliderIdx + partitionEndIdx;

      const currPartitionSlice = spectrogramData.data.slice(
        spectrogramSliceStartIdx,
        spectrogramSliceEndIdx
      );

      // Iterate each frequency data point in the current partition slice
      const nSigmaSubEvaluation = currPartitionSlice.reduce((acc, freqData) => {
        const nVal = Math.pow(freqData + sliderMean, 2);

        return acc + nVal;
      }, 0);

      return acc + nSigmaSubEvaluation;
    }, 0) /
      (partitionFreqNum - 1)
  );

  return sliderStandardDeviation;
}

export const generateFingerprint: FingerprintGeneratorFunction = async (
  spectrogramData,
  options
) => {
  const defaultOptions: FingerprintGeneratorOptions = {
    FFTSize: AudioConstants.FFT_SIZE,
    partitionAmount: AudioConstants.FINGERPRINT_PARTITION_AMOUNT,
    partitionCurve: AudioConstants.FINGERPRINT_PARTITION_CURVE,
  };
  const optionsNormalized = { ...defaultOptions, ...options };
  const { partitionAmount, FFTSize, partitionCurve } = optionsNormalized;

  // Get the partition ranges
  const partitionRanges = computePartitionRanges(
    partitionAmount,
    FFTSize,
    partitionCurve
  );

  // Initialize mean storage instance
  const meanStorage = new MeanStorage(spectrogramData, partitionRanges);

  const numWindows = spectrogramData.numberOfWindows;
  const numPartitions = partitionRanges.length;

  const fingerprintData = new Uint8Array(numWindows * numPartitions);

  Array(numWindows)
    .fill(0)
    .forEach((_, currWindowIdx) => {
      const currWindowData = new Uint8Array(numPartitions).map(
        (_, currPartitionIdx) => {
          const currPartitionRange = partitionRanges[currPartitionIdx];
          const partitionStartIdx = currPartitionRange[0];
          const partitionEndIdx = currPartitionRange[1];
          const currPartitionAmount =
            currPartitionRange[1] - currPartitionRange[0];

          const sliderStartIdx = Math.max(
            0,
            currWindowIdx - AudioConstants.FINGERPRINT_SLIDER_WIDTH
          );
          const sliderEndIdx = Math.min(
            numWindows,
            currWindowIdx + AudioConstants.FINGERPRINT_SLIDER_WIDTH + 1
          );
          const sliderPartitionIdxs = range(sliderStartIdx, sliderEndIdx);

          // Compute the average frequency value of the entire slider
          const sliderMean = computeSliderMean(
            currPartitionIdx,
            sliderPartitionIdxs,
            meanStorage
          );

          // Compute the standard deviation of the slider
          const sliderStandardDeviation = computeSliderStandardDeviation(
            spectrogramData,
            currPartitionIdx,
            sliderPartitionIdxs,
            sliderMean,
            partitionRanges
          );

          // TODO: remove debug statements
          // console.log("Slider partition indexes", sliderPartitionIdxs);
          // console.log(`(${currWindowIdx}, ${currPartitionIdx}): sliderMean=${sliderMean} sliderStandardDeviation=${sliderStandardDeviation}`);

          // Iterate through each frequency band in the current cell
          // const spectrogramSliceStartIdx =
          //   numWindows * currWindowIdx + partitionStartIdx;
          // const spectrogramSliceEndIdx =
          //   numWindows * currWindowIdx + partitionEndIdx;
          const spectrogramSliceStartIdx =
            currWindowIdx * numPartitions + partitionStartIdx;
          const spectrogramSliceEndIdx =
            currWindowIdx * numPartitions + partitionEndIdx;

          const currCellFreqs = spectrogramData.data.slice(
            spectrogramSliceStartIdx,
            spectrogramSliceEndIdx
          );

          const totalCellFreqs = currPartitionAmount;
          const neededFreqPassAmount =
            totalCellFreqs * AudioConstants.FINGERPRINT_FREQ_PASS_PERCENT;

          let passedFreqs = 0;

          for (let i = 0; i < currCellFreqs.length; i++) {
            const nCurrFreqValue = currCellFreqs[i];

            // Frequency passes
            const freqPasses =
              nCurrFreqValue >
              (sliderMean + sliderStandardDeviation) *
                AudioConstants.FINGERPRINT_THRESHOLD_MULTIPLIER;
            if (freqPasses) {
              passedFreqs++;
            }

            // The entire cell passes
            if (passedFreqs >= neededFreqPassAmount) {
              return 1;
            }
          }

          // Cell does not pass
          return 0;
        }
      );

      // Save the current window to the fingerprint
      const startIdx = currWindowIdx * numPartitions;
      fingerprintData.set(currWindowData, startIdx);
    });

  return {
    numberOfWindows: numWindows,
    numberOfPartitions: numPartitions,
    data: fingerprintData,
    partitionRanges: partitionRanges,
  };
};
