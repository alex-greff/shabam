export interface SpectrogramData {
    /** The number of windows in the spectrogram (x-axis) */
    numberOfWindows: number;
    /** The number of frequency bins in the spectrogram (y-axis) */
    frequencyBinCount: number;
    /** The spectrogram data */
    data: Uint8Array;
}
export declare type PartitionRanges = [number, number][];
export interface Fingerprint {
    /** The number of windows in the fingerprint (x-axis) */
    numberOfWindows: number;
    /** The number of partitions in the fingerprint (y-axis) */
    numberOfPartitions: number;
    /** The number of frequency bins that the fingerprint was generated from. */
    frequencyBinCount: number;
    /** The fingerprint tuple data. Format: [window, partition][] */
    data: Uint32Array;
    /** The associated partition ranges of the fingerprint */
    partitionRanges: PartitionRanges;
}
export interface FingerprintGeneratorOptions {
    /** The number of partitions used when computing the fingerprint. */
    partitionAmount: number;
    /** The size of the FFT window. */
    FFTSize: number;
    /** The curve that the partition ranges are calculated on. */
    partitionCurve: number;
}
export declare type FingerprintGeneratorFunction = (spectrogramData: SpectrogramData, options: Partial<FingerprintGeneratorOptions>) => Promise<Fingerprint>;
