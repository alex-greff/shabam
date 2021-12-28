/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/* Sample size of the FFT.  */
const FFT_SIZE = 1024;
/* Number of partitions in the fingerprints.
   Range: [1, infinity)
*/
const FINGERPRINT_PARTITION_AMOUNT = 10;
/* Curve used to calculate partitions.
   Range: (1, infinity)
*/
const FINGERPRINT_PARTITION_CURVE = 50;
/* Number of windows on each side of the slider
   TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH + 1
*/
const FINGERPRINT_SLIDER_WIDTH = 20;
/* Number of windows above and below the slider
   TOTAL_SLIDER_HEIGHT = 2 * FINGERPRINT_SLIDER_HEIGHT + 1
*/
const FINGERPRINT_SLIDER_HEIGHT = 2;
/* How much of the standard deviation is added to the fingerprint cell
   acceptance threshold value.
   In general, larger values make the fingerprint cell filtering more sensitive.
   <0: the standard deviation is subtracted from the mean
   0: no weight (only the mean is used)
   1: entire standard deviation is added
   >1: more than the entire standard deviation is added
*/
const FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER = 1;

/**
 * Helper function used by computePartitionRanges to get the boundary indexes
 * of each partition range.
 */
function getBoundaryIndex(partitionIdx, totalPartitions, totalBins, partitionCurve) {
    // Equation: y = b/(c-1)(c^(x/a)-1)
    //   where:
    //     a = number of partitions
    //     b = number of bins (FFT_size / 2)
    //     c = tension on the curve
    return Math.floor((totalBins / (partitionCurve - 1)) *
        (Math.pow(partitionCurve, partitionIdx / totalPartitions) - 1));
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
function computePartitionRanges(partitionAmount = FINGERPRINT_PARTITION_AMOUNT, FFTSize = FFT_SIZE, partitionCurve = FINGERPRINT_PARTITION_CURVE) {
    if (FFTSize / 2 <= 0)
        throw "Invalid number of bins, must have more than 0 bins";
    if (partitionAmount <= 0)
        throw "Invalid number of partitions, must have more than 0 partitions";
    const ret = [];
    // Calculate the boundary ranges for each partition
    for (let partitionIdx = 0; partitionIdx < partitionAmount; partitionIdx++) {
        const min = getBoundaryIndex(partitionIdx, partitionAmount, FFTSize / 2, partitionCurve);
        const max = getBoundaryIndex(partitionIdx + 1, partitionAmount, FFTSize / 2, partitionCurve);
        ret.push([min, max]);
    }
    return ret;
}

/**
 * Returns an array with values from `start` (inclusive) to `end` (exclusive).
 */
function range(start, end) {
    return Array.from({ length: end - start }, (_, i) => i + start);
}

const generateFingerprint$1 = (spectrogramData, options) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultOptions = {
        FFTSize: FFT_SIZE,
        partitionAmount: FINGERPRINT_PARTITION_AMOUNT,
        partitionCurve: FINGERPRINT_PARTITION_CURVE,
    };
    const optionsNormalized = Object.assign(Object.assign({}, defaultOptions), options);
    const { partitionAmount, FFTSize, partitionCurve } = optionsNormalized;
    // Get the partition ranges
    const partitionRanges = computePartitionRanges(partitionAmount, FFTSize, partitionCurve);
    const numWindows = spectrogramData.numberOfWindows;
    const numFrequencies = spectrogramData.frequencyBinCount;
    const numPartitions = partitionRanges.length;
    let cellData = new Uint8Array(numWindows * numPartitions).fill(0);
    // let fingerprintData = new Uint8Array(numWindows * numPartitions).fill(0);
    // const fingerprintPoints: [number, number][] = [];
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
        const partitionSlice = spectrogramData.data.slice(frequencyStartIdx, frequencyEndIdx);
        const maxVal = Math.max(...partitionSlice);
        return maxVal;
    });
    const fingerprintPoints = cellData.reduce((acc, cellValue, cellIdx) => {
        const curWindow = Math.floor(cellIdx / numPartitions);
        const curPartition = cellIdx - curWindow * numPartitions;
        // Determine slider window range
        const SLIDER_WIDTH = FINGERPRINT_SLIDER_WIDTH;
        const SLIDER_HEIGHT = FINGERPRINT_SLIDER_HEIGHT;
        const sliderXStart = Math.max(0, curWindow - SLIDER_WIDTH);
        const sliderXEnd = Math.min(numWindows, curWindow + SLIDER_WIDTH + 1);
        const sliderYStart = Math.max(0, curPartition - SLIDER_HEIGHT);
        const sliderYEnd = Math.min(numPartitions, curPartition + SLIDER_HEIGHT + 1);
        const sliderSize = (sliderXEnd - sliderXStart) * (sliderYEnd - sliderYStart);
        const sliderXRange = range(sliderXStart, sliderXEnd);
        const sliderYRange = range(sliderYStart, sliderYEnd);
        // Compute the mean value of the slider
        const sliderMean = sliderXRange.reduce((accX, sx) => {
            const ySub = sliderYRange.reduce((accY, sy) => {
                const curCellIdx = sx * numPartitions + sy;
                const curCellValue = cellData[curCellIdx];
                return accY + curCellValue;
            }, 0);
            return accX + ySub;
        }, 0) / sliderSize;
        // Compute the variance of the slider
        const sliderVariance = sliderXRange.reduce((accX, sx) => {
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
        const STANDARD_DEVIATION_MULTIPLIER = FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER;
        const thresholdValue = Math.max(0, sliderMean + sliderStandardDeviation * STANDARD_DEVIATION_MULTIPLIER);
        const passes = cellValue > thresholdValue;
        return passes ? [...acc, [curWindow, curPartition]] : acc;
    }, []);
    // Condense the fingerprint points
    let fingerprintData = new Uint32Array(fingerprintPoints.length * 2);
    fingerprintData = fingerprintData.map((_, currIdx) => {
        const i = Math.floor(currIdx / 2);
        const currPoint = fingerprintPoints[i];
        return currPoint[currIdx % 2];
    });
    return {
        numberOfWindows: numWindows,
        numberOfPartitions: numPartitions,
        frequencyBinCount: numFrequencies,
        data: fingerprintData,
        partitionRanges: partitionRanges,
    };
});

const generateFingerprint = (spectrogramData, options) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultOptions = {
        FFTSize: FFT_SIZE,
        partitionAmount: FINGERPRINT_PARTITION_AMOUNT,
        partitionCurve: FINGERPRINT_PARTITION_CURVE,
    };
    const optionsNormalized = Object.assign(Object.assign({}, defaultOptions), options);
    const { partitionAmount, FFTSize, partitionCurve } = optionsNormalized;
    // Get the partition ranges
    const partitionRanges = computePartitionRanges(partitionAmount, FFTSize, partitionCurve);
    const numWindows = spectrogramData.numberOfWindows;
    const numFrequencies = spectrogramData.frequencyBinCount;
    const numPartitions = partitionRanges.length;
    const cellData = new Uint8Array(numWindows * numPartitions);
    const fingerprintPoints = [];
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
            const SLIDER_WIDTH = FINGERPRINT_SLIDER_WIDTH;
            const SLIDER_HEIGHT = FINGERPRINT_SLIDER_HEIGHT;
            const sliderXStart = Math.max(0, curWindow - SLIDER_WIDTH);
            const sliderXEnd = Math.min(numWindows, curWindow + SLIDER_WIDTH + 1);
            const sliderYStart = Math.max(0, curPartition - SLIDER_HEIGHT);
            const sliderYEnd = Math.min(numPartitions, curPartition + SLIDER_HEIGHT + 1);
            const sliderSize = (sliderXEnd - sliderXStart) * (sliderYEnd - sliderYStart);
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
            const STANDARD_DEVIATION_MULTIPLIER = FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER;
            const thresholdValue = Math.max(0, sliderMean + sliderStandardDeviation * STANDARD_DEVIATION_MULTIPLIER);
            const passes = cellValue > thresholdValue;
            if (passes)
                fingerprintPoints.push([curWindow, curPartition]);
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
});

export { generateFingerprint$1 as functionalGenerateFingerprint, generateFingerprint as iterativeGenerateFingerprint };
