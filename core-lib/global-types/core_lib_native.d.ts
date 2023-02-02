// Typescript declarations for the native extension for the core library
declare module "*core_lib_native.node" {
  type WindowFunction = "hamming" | "hann" | "blackman-harris" | "blackman-harris-7" | "flat-top";

  interface SpectrogramData {
    data: Float32Array;
    numBuckets: number;
    numWindows: number;
  }

  class Spectrogram {
    constructor(
      samples: Float32Array,
      windowFunction: WindowFunction,
      windowSize: number,
      hopSize: number,
      FFTSize: number
    );

    compute(): void;
    getSpectrogram(): SpectrogramData;
  }

  type PartitionRanges = [number, number][];

  interface FingerprintData {
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

  class Fingerprint {
    constructor(
      partitionCurveTension: number,
      partitionCount: number,
      standardDeviationMultiplier: number,
      slidingWindowWidth: number,
      slidingWindowHeight: number,
      slidingWindowFuncName: WindowFunction,
      spectrogram: Float32Array,
      spectrogramNumBuckets: number,
      spectrogramNumWindows: number
    );

    compute(): void;
    getFingerprint(): FingerprintData;

    static computePartitionRanges(
      partitionCount: number,
      partitionCurveTension: number,
      spectrogramNumBuckets: number,
    ): PartitionRanges;
  }

  function greetHello(): string;
}
