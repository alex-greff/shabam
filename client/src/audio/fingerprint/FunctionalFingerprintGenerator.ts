import range from "lodash/range";
import {
  FingerprintGeneratorOptions,
  FingerprintGeneratorFunction,
} from "@/audio/types";
import { computePartitionRanges } from "@/audio/utilities";
import * as AudioConstants from "@/audio/constants";

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

  const numWindows = spectrogramData.numberOfWindows;
  const numFrequencies = spectrogramData.frequencyBinCount;
  const numPartitions = partitionRanges.length;

  let cellData = new Uint8Array(numWindows * numPartitions).fill(0);
  let fingerprintData = new Uint8Array(numWindows * numPartitions).fill(0);

  // Compute the cell data by finding the strongest frequency of each cell
  // in the spectrogram
  cellData = cellData.map((_, cellIdx) => {
    const curWindow = Math.floor(cellIdx / numPartitions);
    const curPartition = cellIdx - curWindow * numPartitions;

    const curPartitionRange = partitionRanges[curPartition];
    const partitionStartIdx = curPartitionRange[0];
    const partitionEndIdx = curPartitionRange[1];

    const frequencyStartIdx = curWindow * numFrequencies + partitionStartIdx;
    const frequencyEndIdx = curWindow * numFrequencies + partitionEndIdx;

    const partitionSlice = spectrogramData.data.slice(
      frequencyStartIdx,
      frequencyEndIdx
    );
    const maxVal = Math.max(...partitionSlice);
    return maxVal;
  });

  // Compute the fingerprint data
  fingerprintData = fingerprintData.map((_, cellIdx) => {
    const curWindow = Math.floor(cellIdx / numPartitions);
    const curPartition = cellIdx - curWindow * numPartitions;

    // Determine slider window range
    const SLIDER_WIDTH = AudioConstants.FINGERPRINT_SLIDER_WIDTH;
    const SLIDER_HEIGHT = AudioConstants.FINGERPRINT_SLIDER_HEIGHT;
    const sliderXStart = Math.max(0, curWindow - SLIDER_WIDTH);
    const sliderXEnd = Math.min(numWindows, curWindow + SLIDER_WIDTH + 1);
    const sliderYStart = Math.max(0, curPartition - SLIDER_HEIGHT);
    const sliderYEnd = Math.min(
      numPartitions,
      curPartition + SLIDER_HEIGHT + 1
    );
    const sliderSize =
      (sliderXEnd - sliderXStart) * (sliderYEnd - sliderYStart);

    const sliderXRange = range(sliderXStart, sliderXEnd);
    const sliderYRange = range(sliderYStart, sliderYEnd);

    // Compute the mean value of the slider
    const sliderMean =
      sliderXRange.reduce((accX, sx) => {
        const ySub = sliderYRange.reduce((accY, sy) => {
          const curCellIdx = sx * numPartitions + sy;
          const curCellValue = cellData[curCellIdx];
          return accY + curCellValue;
        }, 0);
        return accX + ySub;
      }, 0) / sliderSize;

    // Compute the variance of the slider
    const sliderVariance =
      sliderXRange.reduce((accX, sx) => {
        const ySub = sliderYRange.reduce((accY, sy) => {
          const curCellIdx = sx * numPartitions + sy;
          const curCellValue = cellData[curCellIdx];
          const cellDifference = curCellValue - sliderMean;
          return accY + Math.pow(cellDifference, 2);
        }, 0);
        return accX + ySub;
      }, 0) / sliderSize;

    // Compute the standard deviation of the slider
    const sliderStandardDeviation = Math.round(Math.sqrt(sliderVariance));

    // Determine if the current cell passes
    const cellValue = cellData[cellIdx];

    const STANDARD_DEVIATION_MULTIPLIER =
      AudioConstants.FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER;
    const thresholdValue = Math.max(
      0,
      sliderMean + sliderStandardDeviation * STANDARD_DEVIATION_MULTIPLIER
    );

    const passes = cellValue > thresholdValue;

    const fingerprintValue = passes ? 1 : 0;
    return fingerprintValue;
  });

  return {
    numberOfWindows: numWindows,
    numberOfPartitions: numPartitions,
    frequencyBinCount: numFrequencies,
    data: fingerprintData,
    partitionRanges: partitionRanges,
  };
};
