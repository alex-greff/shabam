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

        // Account for divide by 0 situation
        if (i_nTotalParitions === 1) {
            return [[0, i_nTotalParitions]];
        }

        // Equation: y = b/(c-1)(c^(x/a)-1) where a=number of paritions-1, b=number of bins (FFT size/2)-1, c=tension on the curve
        return Math.floor(((i_nTotalBins - 1 ) / (partitionCurve - 1)) * (Math.pow(partitionCurve, i_nParitionIdx / (i_nTotalParitions - 1)) - 1));
    }

    const aRange = [...Array(partitionAmount - 1).keys()];

    console.log("Range", aRange);

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
 * Generates the fingerprint for the given spectrogram data.
 * 
 * @param {Array} spectrogramData The spectrogram data (an array of Uint8Arrays)
 * @param {Number} partitionAmount The number of paritions used when computing the fingerprint.
 * @param {Number} FFTSize The size of the FFT window.
 * @param {Number} partitionCurve The curve that the partition ranges are calculated on.
 */
export function generateFingerprint(spectrogramData, partitionAmount = CONSTANTS.FINGERPRINT_PARITION_AMOUNT, FFTSize = CONSTANTS.FFT_SIZE, partitionCurve = CONSTANTS.FINGERPRINT_PARITIION_CURVE) {
    const paritionRanges = computePartitionRanges(partitionAmount, FFTSize, partitionCurve);

    console.log("Parition ranges", paritionRanges);
}

export default {
    computePartitionRanges,
    generateFingerprint,
}