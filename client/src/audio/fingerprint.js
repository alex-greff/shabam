import CONSTANTS from "@/constants";

/**
 * Computes the parition ranges for the given FFT size in respect to the number of paritions needed.
 * 
 * @param {Number} partitionAmount The number of paritions to split into.
 * @param {Number} FFTSize The size of the FFT window.
 * @param {Number} partitionCurve The curve that the partition ranges are calculated on.
 * @return {Array} Returns an array of tuples (2 element arrays) of the computed parition ranges.
 */
function computePartitionRanges(partitionAmount = CONSTANTS.FINGERPRINT_PARITION_AMOUNT, FFTSize = CONSTANTS.FFT_SIZE, partitionCurve = CONSTANTS.FINGERPRINT_PARITIION_CURVE) {
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

/**
 * Computes the paritioned spectrogram version.
 * 
 * @param {Array} spectrogramData The spectrogram data (an array of Uint8Arrays).
 * @param {Array} parititionRanges The computed parition ranges.
 * @return {Array} Returns an array of Uint8Arrays.
 */
function computeParitionedSpectrogram(spectrogramData, parititionRanges) {
    const nNumParitions = parititionRanges.length;

    // Compute the partitioned values for each window
    const paritionedSpectrogram = spectrogramData.map((i_u8CurrWindow) => {
        const partitionedBins = new Uint8Array(nNumParitions);

        // Calculate the average for each of the parition slices
        parititionRanges.forEach((i_aCurrParition, i_nPartitionIdx) => {
            const nStartIdx = i_aCurrParition[0];
            const nEndIdx = i_aCurrParition[1];

            const aWindowSlice = i_u8CurrWindow.slice(nStartIdx, nEndIdx)
            const nBinAverage = Math.round(aWindowSlice.reduce((acc, i_nCurrVal) => acc + i_nCurrVal, 0) / aWindowSlice.length);

            partitionedBins[i_nPartitionIdx] = nBinAverage;
        });

        return partitionedBins;
    });

    return paritionedSpectrogram;
}

/**
 * Computes the average values of each partition band.
 * 
 * @param {Array} partitionedSpectrogram The partitioned spectrogram data (array of Unit8Arrays).
 * @return {Array} Returns an array containing the average values for each partition band.
 */
function generateAverageMap(partitionedSpectrogram) {
    const nNumWindows = partitionedSpectrogram.length;
    const nNumPartitions = partitionedSpectrogram[0].length;

    const aParitionRange = [...Array(nNumPartitions).keys()];
    // For each parition band calculate the average value in all the windows
    const aAverageMap = aParitionRange.reduce((acc, i_nCurrPartition) => {
        const aWindowsRange = [...Array(nNumWindows).keys()];

        const nCurrPartitionAverage = aWindowsRange.reduce((acc, i_nCurrWindow) => {
            return acc + partitionedSpectrogram[i_nCurrWindow][i_nCurrPartition];
        }, 0) / nNumWindows;

        return [...acc, nCurrPartitionAverage];
    }, []);

    return aAverageMap;
}

/**
 * Filters the given partitioned spectrogram data and reduces it to binary values.
 * 
 * @param {Array} partitionedSpectrogram The partitioned spectrogram data (array of Unit8Arrays).
 * @param {Number} fingerprintThresholdMultiplier The threshold multiplier for the fingerprint acceptance qualifier.
 * @return {Array} Returns an array of Uint8Arrays.
 */
function filterAndBinarize(partitionedSpectrogram, fingerprintThresholdMultiplier = CONSTANTS.FINGERPRINT_THRESHOLD_MULTIPLIER) {
    // Get the average map
    const aAverageMap = generateAverageMap(partitionedSpectrogram);

    const nNumPartitions = partitionedSpectrogram[0].length;

    // Compute the fingerprint
    const aFingerprint = partitionedSpectrogram.map((i_aCurrPartition) => {
        return (new Uint8Array(nNumPartitions)).map((_, i_nCurrPartition) => {
            const nCurrFreqVal = i_aCurrPartition[i_nCurrPartition];
            const nCurrAverageVal = aAverageMap[i_nCurrPartition];

            const bPassThreshold = nCurrFreqVal > nCurrAverageVal * fingerprintThresholdMultiplier;
            return (bPassThreshold) ? 1 : 0;
        });
    });
    
    return aFingerprint;
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
    const paritionRanges = computePartitionRanges(partitionAmount, FFTSize, partitionCurve);
    console.log("Parition ranges", paritionRanges);
    
    // Compute the partitioned spectrogram
    const paritionedSpectrogram = computeParitionedSpectrogram(spectrogramData, paritionRanges);
    console.log("Paritioned spectrogram", paritionedSpectrogram);

    // Filter the partitioned spectrogram and reduce to binary values, thus getting the fingerprint
    const aFingerprint = filterAndBinarize(paritionedSpectrogram, fingerprintThresholdMultiplier);
    console.log("Fingerprint", aFingerprint);
}

export default {
    generateFingerprint,
};