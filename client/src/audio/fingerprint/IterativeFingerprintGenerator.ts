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
) {
  let sumTotal = 0;
  for (let i = 0; i < sliderPartitionIdxs.length; i++) {
    const currSliderIdx = sliderPartitionIdxs[i]; // window index

    const currCellMean = meanStorage.getCellMean(
      currSliderIdx,
      currPartitionIdx
    );

    sumTotal += currCellMean;
  }

  return sumTotal / sliderPartitionIdxs.length;
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
  // Number of frequencies in the current partition index
  const partitionFreqNum = partitionEndIdx - partitionStartIdx;

  // Total number of frequencies of all the slider windows
  const partitionsTotalFreqNum = partitionFreqNum * sliderPartitionIdxs.length;

  let sliderStandardDeviation = 0;
  for (let i = 0; i < sliderPartitionIdxs.length; i++) {
    const currSliderIdx = sliderPartitionIdxs[i]; // window index

    const sliceStartIdx =
      currSliderIdx * spectrogramData.frequencyBinCount + partitionStartIdx;
    const sliceEndIdx =
      currSliderIdx * spectrogramData.frequencyBinCount + partitionEndIdx;

    const currPartitionSlice = spectrogramData.data.slice(
      sliceStartIdx,
      sliceEndIdx
    );

    // Iterate each frequency data point in the current partition slice
    let sigmaSubEval = 0;
    for (let j = 0; j < currPartitionSlice.length; j++) {
      const freqData = currPartitionSlice[j];
      sigmaSubEval += Math.pow(freqData + sliderMean, 2);
    }

    sliderStandardDeviation += sigmaSubEval;
  }

  sliderStandardDeviation = Math.sqrt(
    sliderStandardDeviation / (partitionsTotalFreqNum - 1)
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

  for (let windowIdx = 0; windowIdx < numWindows; windowIdx++) {
    const windowData = new Uint8Array(numPartitions);

    for (let partitionIdx = 0; partitionIdx < numPartitions; partitionIdx++) {
      const partitionRange = partitionRanges[partitionIdx];
      const partitionStartIdx = partitionRange[0];
      const partitionEndIdx = partitionRange[1];
      const partitionAmount = partitionEndIdx - partitionStartIdx;

      const sliderStartIdx = Math.max(
        0,
        windowIdx - AudioConstants.FINGERPRINT_SLIDER_WIDTH
      );
      const sliderEndIdx = Math.min(
        numWindows,
        windowIdx + AudioConstants.FINGERPRINT_SLIDER_WIDTH + 1
      );
      const sliderPartitionIdxs = range(sliderStartIdx, sliderEndIdx);

      // Compute the average frequency value of the entire slider
      const sliderMean = computeSliderMean(
        partitionIdx,
        sliderPartitionIdxs,
        meanStorage
      );

      // Compute the standard deviation of the slider
      const sliderStandardDeviation = computeSliderStandardDeviation(
        spectrogramData,
        partitionIdx,
        sliderPartitionIdxs,
        sliderMean,
        partitionRanges
      );

      // Iterate through each frequency band in the current cell
      const spectrogramSliceStartIdx =
        windowIdx * numPartitions + partitionStartIdx;
      const spectrogramSliceEndIdx =
        windowIdx * numPartitions + partitionEndIdx;

      const currPartitionSlice = spectrogramData.data.slice(
        spectrogramSliceStartIdx,
        spectrogramSliceEndIdx
      );

      const totalCellFreqs = partitionAmount;
      const neededFreqPassAmount =
        totalCellFreqs * AudioConstants.FINGERPRINT_FREQ_PASS_PERCENT;

      let passedFreqs = 0;
      for (let i = 0; i < currPartitionSlice.length; i++) {
        const currFreqValue = currPartitionSlice[i];

        const currThresholdValue =
          (sliderMean + sliderStandardDeviation) *
          AudioConstants.FINGERPRINT_THRESHOLD_MULTIPLIER;

        const freqPasses = currFreqValue > currThresholdValue;

        if (freqPasses) {
          passedFreqs++;
        }
      }

      // Cell passes
      if (passedFreqs >= neededFreqPassAmount) {
        windowData[partitionIdx] = 1;
      } 
      // Cell does not pass
      else {
        windowData[partitionIdx] = 0;
      }
    }

    // Save the current window to the fingerprint
    const startIdx = windowIdx * numPartitions;
    fingerprintData.set(windowData, startIdx);
  }

  return {
    numberOfWindows: numWindows,
    numberOfPartitions: numPartitions,
    data: fingerprintData,
    partitionRanges: partitionRanges
  };

  // // TODO: remove
  // return {
  //   numberOfWindows: 0,
  //   numberOfPartitions: 0,
  //   data: new Uint8Array(0),
  //   partitionRanges: [],
  // };
};
