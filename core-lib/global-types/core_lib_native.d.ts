// Typescript declarations for the native extension for the core library
declare module "*core_lib_native.node" {
  type WindowFunction =
    | "hamming"
    | "hann"
    | "blackman-harris"
    | "blackman-harris-7"
    | "flat-top";

  class Spectrogram {
    constructor(
      samples: Float32Array,
      windowFunction: WindowFunction,
      windowSize: number,
      hopSize: number,
      FFTSize: number
    );

    compute(): void;
    getSpectrogram(): import("../src/spectrogram/types").SpectrogramData;
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
    getFingerprint(): import("../src/fingerprint/types").FingerprintData;

    static computePartitionRanges(
      partitionCount: number,
      partitionCurveTension: number,
      spectrogramNumBuckets: number
    ): import("../src/fingerprint/types").PartitionRanges;
  }

  function greetHello(): string;
}
