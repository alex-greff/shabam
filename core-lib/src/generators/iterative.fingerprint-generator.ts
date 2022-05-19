import { config } from "../configuration";
import {
  FingerprintGeneratorOptions,
  FingerprintGeneratorFunction,
} from "../types";
import { computePartitionRanges } from "../utilities/audio";

export const generateFingerprint: FingerprintGeneratorFunction = async (
  spectrogramData,
  options
) => {
  const defaultOptions: FingerprintGeneratorOptions = {
    FFTSize: config.FFT_SIZE,
    partitionAmount: config.FINGERPRINT_PARTITION_AMOUNT,
    partitionCurve: config.FINGERPRINT_PARTITION_CURVE,
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

  const cellData = new Uint8Array(numWindows * numPartitions);
  const fingerprintPoints: [number, number][] = [];

  // Compute the cell data by finding the strongest frequency of each cell
  // in the spectrogram
  for (let curWindow = 0; curWindow < numWindows; curWindow++) {
    for (let curPartition = 0; curPartition < numPartitions; curPartition++) {
      const curPartitionRange = partitionRanges[curPartition];
      const partitionStartIdx = curPartitionRange[0];
      const partitionEndIdx = curPartitionRange[1];

      const frequencyStartIdx = curWindow * numFrequencies + partitionStartIdx;
      const frequencyEndIdx = curWindow * numFrequencies + partitionEndIdx;

      let maxVal = 0;
      for (let i = frequencyStartIdx; i < frequencyEndIdx; i++) {
        const curVal = spectrogramData.data[i];
        maxVal = curVal > maxVal ? curVal : maxVal;
      }

      const cellIdx = curWindow * numPartitions + curPartition;
      cellData[cellIdx] = maxVal;
    }
  }

  // Compute the fingerprint data
  for (let curWindow = 0; curWindow < numWindows; curWindow++) {
    for (let curPartition = 0; curPartition < numPartitions; curPartition++) {
      // Determine slider window range
      const SLIDER_WIDTH = config.FINGERPRINT_SLIDER_WIDTH;
      const SLIDER_HEIGHT = config.FINGERPRINT_SLIDER_HEIGHT;
      const sliderXStart = Math.max(0, curWindow - SLIDER_WIDTH);
      const sliderXEnd = Math.min(numWindows, curWindow + SLIDER_WIDTH + 1);
      const sliderYStart = Math.max(0, curPartition - SLIDER_HEIGHT);
      const sliderYEnd = Math.min(
        numPartitions,
        curPartition + SLIDER_HEIGHT + 1
      );
      const sliderSize =
        (sliderXEnd - sliderXStart) * (sliderYEnd - sliderYStart);

      // Compute the mean value of the slider
      let sliderMean = 0;
      for (let sx = sliderXStart; sx < sliderXEnd; sx++) {
        for (let sy = sliderYStart; sy < sliderYEnd; sy++) {
          const curCellIdx = sx * numPartitions + sy;
          const curCellValue = cellData[curCellIdx];
          sliderMean += curCellValue;
        }
      }
      sliderMean = sliderMean / sliderSize;

      // Compute the variance of the slider
      let sliderVariance = 0;
      for (let sx = sliderXStart; sx < sliderXEnd; sx++) {
        for (let sy = sliderYStart; sy < sliderYEnd; sy++) {
          const curCellIdx = sx * numPartitions + sy;
          const curCellValue = cellData[curCellIdx];
          const cellDifference = curCellValue - sliderMean;
          sliderVariance += Math.pow(cellDifference, 2);
        }
      }
      sliderVariance = sliderVariance / sliderSize;

      // Compute the standard deviation of the slider
      const sliderStandardDeviation = Math.round(Math.sqrt(sliderVariance));

      // Determine if the current cell passes
      const cellIdx = curWindow * numPartitions + curPartition;
      const cellValue = cellData[cellIdx];

      const STANDARD_DEVIATION_MULTIPLIER =
        config.FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER;
      const thresholdValue = Math.max(
        0,
        sliderMean + sliderStandardDeviation * STANDARD_DEVIATION_MULTIPLIER
      );

      const passes = cellValue > thresholdValue;
      if (passes) fingerprintPoints.push([curWindow, curPartition]);
    }
  }

  // Condense the fingerprint points
  const fingerprintData = new Uint32Array(fingerprintPoints.length * 2);
  for (let i = 0; i < fingerprintPoints.length; i++) {
    const currPoint = fingerprintPoints[i];
    fingerprintData[i * 2] = currPoint[0];
    fingerprintData[i * 2 + 1] = currPoint[1];
  }

  return {
    numberOfWindows: numWindows,
    numberOfPartitions: numPartitions,
    frequencyBinCount: numFrequencies,
    data: fingerprintData,
    partitionRanges: partitionRanges,
  };
};
