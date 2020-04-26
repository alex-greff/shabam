export const getFingerprintData = (fingerprintBuffer: Buffer) => {
    return Uint8Array.from(fingerprintBuffer);
};

/**
 * Returns the uncondensed version of the fingerprint data (an Array of Uint8Arrays).
 * 
 * @param {Uint8Array} condensedFingerprintData The condensed fingerprint data.
 * @param {Number} numWindows The number of windows.
 * @param {Number} numPartitions The number of partitions.
 */
export const uncondenseFingerprintData = (condensedFingerprintData: Uint8Array, numWindows: number, numPartitions: number) => {
    const aRetFingerprint = [];

    for (let nCurrWindow = 0; nCurrWindow < numWindows; nCurrWindow++) {
        const nStartIdx = nCurrWindow * numPartitions;
        const nEndIdx = (nCurrWindow * numPartitions) + numPartitions;

        const u8CurrWindow = condensedFingerprintData.slice(nStartIdx, nEndIdx);

        aRetFingerprint.push(u8CurrWindow);
    }

    return aRetFingerprint;
};