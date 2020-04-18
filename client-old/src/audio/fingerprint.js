import __range from "lodash/range";
import CONSTANTS from "@/constants";

/**
 * Computes the parition ranges for the given FFT size in respect to the number of paritions needed.
 * 
 * @param {Number} partitionAmount The number of paritions to split into.
 * @param {Number} FFTSize The size of the FFT window.
 * @param {Number} partitionCurve The curve that the partition ranges are calculated on.
 * @return {Array} Returns an array of tuples (2 element arrays) of the computed parition ranges.
 */
export function computePartitionRanges(partitionAmount = CONSTANTS.FINGERPRINT_PARITION_AMOUNT, FFTSize = CONSTANTS.FFT_SIZE, partitionCurve = CONSTANTS.FINGERPRINT_PARITIION_CURVE) {
    function getBoundaryIndex(i_nParitionIdx, i_nTotalParitions, i_nTotalBins) {
        // --- Checks ---
        if (i_nTotalBins <= 0)
            throw new Error("Invalid number of bins, must have more than 0 bins");

        if (i_nParitionIdx < 0) 
            throw new Error("Partition index must be positive");

        if (i_nTotalParitions <= 0)
            throw new Error("Invalid number of partitions, must have more than 0 partitions");

        // Account for the divide by 0 situation
        if (i_nTotalParitions === 1) {
            return [[0, i_nTotalParitions]];
        }

        // Equation: y = b/(c-1)(c^(x/a)-1) 
        //   where:
        //     a = number of paritions
        //     b = number of bins (FFT size/2)
        //     c = tension on the curve
        return Math.floor((i_nTotalBins / (partitionCurve - 1)) * (Math.pow(partitionCurve, i_nParitionIdx / i_nTotalParitions) - 1));
    }

    const aRange = [...Array(partitionAmount).keys()];

    // Calculate the boundary ranges for each partition
    return aRange.reduce((acc, i_nParitionIdx) => {
        const nMin = getBoundaryIndex(i_nParitionIdx, partitionAmount, FFTSize/2);
        const nMax = getBoundaryIndex(i_nParitionIdx + 1, partitionAmount, FFTSize/2);

        return [
            ...acc,
            [nMin, nMax]
        ];
    }, []);
}

class MeanStorage {
    /**
     * Initializes a mean storage instance.
     * 
     * @param {Array} spectrogramData The spectrogram data (an array of Uint8Arrays).
     * @param {Array} partitionRanges The computed parition ranges.
     */
    constructor(spectrogramData, partitionRanges) {
        this.spectrogramData = spectrogramData;
        this.partitionRanges = partitionRanges;
        this.numPartitions = partitionRanges.length;
        this.numWindows = spectrogramData.length;

        this.computedValues = {};
    }

    /**
     * Checks the given coordinates and throws any errors if invalid.
     * 
     * @param {Number} window The index of the window.
     * @param {Number} partition The index of the partition.
     */
    _checkCoordinates(window, partition) {
        if (window < 0 || window >= this.numWindows) {
            throw `Invalid window index '${window}'`;
        }

        if (partition < 0 || partition >= this.numPartitions) {
            throw `Invalid partition index '${partition}'`;
        }
    }

    /**
     * Gets the key of the storage map for the given window-partition coordinate.
     * 
     * @param {Number} window The index of the window.
     * @param {Number} partition The index of the partition.
     * @return {String} The storage map key.
     */
    _getStorageMapKey(window, partition) {
        return `${window}:${partition}`;
    }

    /**
     * Gets the mean value of the cell located at the given window-partition coordinate.
     * 
     * @param {Number} window The index of the window.
     * @param {Number} partition The index of the partition.
     * @param {Boolean} recompute Force recomputation of the mean value, even if it already exists.
     * @return {Number} Returns the mean value of the cell.
     */
    getCellMean(window, partition, recompute = false) {
        this._checkCoordinates(window, partition);

        const sStorageKey = this._getStorageMapKey(window, partition);

        const bMeanAlreadyComputed = !!this.computedValues[sStorageKey];

        // Compute the mean value, if needed
        if (!bMeanAlreadyComputed || recompute) {
            const aPartitionRange = this.partitionRanges[partition];
            const nStartIdx = aPartitionRange[0];
            const nEndIdx = aPartitionRange[1];

            const u8Window = this.spectrogramData[window];

            const u8PartitionSlice = u8Window.slice(nStartIdx, nEndIdx);

            const nPartitionMean = Math.round(u8PartitionSlice.reduce((acc, i_nCurrVal) => acc + i_nCurrVal, 0) / u8PartitionSlice.length);

            this.computedValues[sStorageKey] = nPartitionMean;
        }

        return this.computedValues[sStorageKey];
    }
}

/**
 * Computes the mean of the given slider window.
 * 
 * @param {Number} i_nCurrPartitionIdx The current partition index.
 * @param {Array} i_aSliderPartitionIdxs The array of slider partition window indexes.
 * @param {MeanStorage} i_meanStorage The current mean storage instance.
 */
function computeSliderMean(i_nCurrPartitionIdx, i_aSliderPartitionIdxs, i_meanStorage) {
    return i_aSliderPartitionIdxs.reduce((acc, i_nCurrSliderIdx) => {
        const nCurrCellMean = i_meanStorage.getCellMean(i_nCurrSliderIdx, i_nCurrPartitionIdx);

        return acc + nCurrCellMean;
    }, 0) / i_aSliderPartitionIdxs.length;
}

/**
 * Computes the standard deviation of the given slider window.
 * 
 * @param {Array} i_aSpectrogramData The spectrogram data (an array of Uint8Arrays).
 * @param {Number} i_nCurrPartitionIdx The current partition index.
 * @param {Array} i_aSliderPartitionIdxs The array of slider partition window indexes.
 * @param {Number} i_nSliderMean The mean of the current slider window.
 * @param {Array} i_aPartitionRanges The computed parition ranges.
 */
function computeSliderStandardDeviation(i_aSpectrogramData, i_nCurrPartitionIdx, i_aSliderPartitionIdxs, i_nSliderMean, i_aPartitionRanges) {
    const aCurrPartitionRange = i_aPartitionRanges[i_nCurrPartitionIdx];
    const nPartitionStartIdx = aCurrPartitionRange[0];
    const nPartitionEndIdx = aCurrPartitionRange[1];
    const nCurrpartitionAmount = aCurrPartitionRange[1] - aCurrPartitionRange[0];

    const nPartitionFreqNum = nCurrpartitionAmount * i_aSliderPartitionIdxs.length;

    // Iterate each slider partition
    const nSliderStandardDeviation = Math.sqrt(i_aSliderPartitionIdxs.reduce((acc, i_nCurrSliderIdx) => {
        const u8CurrWindow = i_aSpectrogramData[i_nCurrSliderIdx];
        const u8CurrPartitionSlice = u8CurrWindow.slice(nPartitionStartIdx, nPartitionEndIdx);

        // Iterate each frequency data point in the current partition slice
        const nSigmaSubEvaluation = u8CurrPartitionSlice.reduce((acc, i_nFreqData) => {
            const nVal = Math.pow(i_nFreqData + i_nSliderMean, 2);

            return acc + nVal;
        }, 0);

        return acc + nSigmaSubEvaluation;
    }, 0) / (nPartitionFreqNum - 1));

    return nSliderStandardDeviation;
}

/**
 * Generates the fingerprint for the given spectrogram data.
 * 
 * @param {Array} spectrogramData The spectrogram data (an array of Uint8Arrays).
 * @param {Number} partitionAmount The number of paritions used when computing the fingerprint.
 * @param {Number} FFTSize The size of the FFT window.
 * @param {Number} partitionCurve The curve that the partition ranges are calculated on.
 * @param {Number} fingerprintThresholdMultiplier The threshold multiplier for the fingerprint acceptance qualifier.
 * @return {Array} Returns an array of Uint8Arrays.
 */
export function generateFingerprint(spectrogramData, partitionAmount = CONSTANTS.FINGERPRINT_PARITION_AMOUNT, FFTSize = CONSTANTS.FFT_SIZE, partitionCurve = CONSTANTS.FINGERPRINT_PARITIION_CURVE, fingerprintThresholdMultiplier = CONSTANTS.FINGERPRINT_THRESHOLD_MULTIPLIER) {
    // Get the parition ranges
    const aPartitionRanges = computePartitionRanges(partitionAmount, FFTSize, partitionCurve);

    // Initialize the mean storage class
    const meanStorage = new MeanStorage(spectrogramData, aPartitionRanges);

    const nNumWindows = spectrogramData.length;
    const nNumPartitions = aPartitionRanges.length;

    const aFingerprint = Array(nNumWindows).fill(0).map((_, nCurrWindowIdx) => {
        const u8CurrWindow = new Uint8Array(nNumPartitions).map((_, nCurrPartitionIdx) => {
            const aCurrPartitionRange = aPartitionRanges[nCurrPartitionIdx];
            const nPartitionStartIdx = aCurrPartitionRange[0];
            const nPartitionEndIdx = aCurrPartitionRange[1];
            const nCurrpartitionAmount = aCurrPartitionRange[1] - aCurrPartitionRange[0];

            const nSliderStartIdx = Math.max(0, nCurrWindowIdx - CONSTANTS.FINGERPRINT_SLIDER_WIDTH);
            const nSliderEndIdx = Math.min(nNumWindows, nCurrWindowIdx + CONSTANTS.FINGERPRINT_SLIDER_WIDTH + 1);
            const aSliderPartitionIdxs = __range(nSliderStartIdx, nSliderEndIdx);

            // Compute the average frequency value of the entire slider
            const nSliderMean = computeSliderMean(nCurrPartitionIdx, aSliderPartitionIdxs, meanStorage);

            // Compute the standard deviation of the slider
            const nSliderStandardDeviation = computeSliderStandardDeviation(spectrogramData, nCurrPartitionIdx, aSliderPartitionIdxs, nSliderMean, aPartitionRanges);

            // TODO: remove debug statements
            // console.log("Slider partition indexes", aSliderPartitionIdxs);
            // console.log(`(${nCurrWindowIdx}, ${nCurrPartitionIdx}): sliderMean=${nSliderMean} sliderStandardDeviation=${nSliderStandardDeviation}`);

            // Iterate through each frequency band in the current cell
            const u8CurrWindow = spectrogramData[nCurrWindowIdx];
            const u8CurrCellFreqs = u8CurrWindow.slice(nPartitionStartIdx, nPartitionEndIdx);

            const nTotalCellFreqs = nCurrpartitionAmount;
            const nNeededFreqPassAmount = nTotalCellFreqs * CONSTANTS.FINGERPRINT_FREQ_PASS_PERCENT;

            let nPassedFreqs = 0;

            for (let i = 0; i < u8CurrCellFreqs.length; i++) {
                const nCurrFreqValue = u8CurrCellFreqs[i];

                // Frequency passes
                const bFreqPasses = nCurrFreqValue > (nSliderMean + nSliderStandardDeviation) * CONSTANTS.FINGERPRINT_THRESHOLD_MULTIPLIER;
                if (bFreqPasses) {
                    nPassedFreqs++;
                }

                // The entire cell passes
                if (nPassedFreqs >= nNeededFreqPassAmount) {
                    return 1;
                }
            }

            // Cell does not pass
            return 0;
        });
        return u8CurrWindow;
    });

    return aFingerprint;
}

/**
 * Condenses the fingerprint data down to a single Uint8Array. 
 * Note: the number of windows and partition ranges are lost and must be accounted for externally.
 * 
 * @param {Array} i_aFingerprint The fingerprint data (an array of Uint8Arrays).
 */
export function condenseFingerprint(i_aFingerprint) {
    if (i_aFingerprint.length <= 0) {
        return {
            windowNumber: 0,
            partitionNumber: 0,
            condensedData: new Uint8Array(0)
        }
    }

    const nNumWindows = i_aFingerprint.length;
    const nNumPartitions = i_aFingerprint[0].length;

    const u8Condensed = new Uint8Array(nNumWindows * nNumPartitions);

    for (let nCurrWindow = 0; nCurrWindow < nNumWindows; nCurrWindow++) {
        for (let nCurrPartition = 0; nCurrPartition < nNumPartitions; nCurrPartition++) {
            const nCurrIdx = (nCurrWindow * nNumPartitions) + nCurrPartition; // Row access formula
            u8Condensed[nCurrIdx] = i_aFingerprint[nCurrWindow][nCurrPartition];
        }
    }

    return { 
        windowNumber: nNumWindows,
        partitionNumber: nNumPartitions,
        condensedData: u8Condensed 
    };
}

export default {
    computePartitionRanges,
    generateFingerprint,
    condenseFingerprint,
};