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

  interface Record {
    anchorFrequency: number;
    pointFrequency: number;
    delta: number;
    anchorAbsoluteTime: number;
  }

  class RecordsTable {
    constructor(fingerprint: Fingerprint, targetZoneSize: number);

    compute(): void;

    getRecordsTable(): Record[];
  }

  interface RecordsSearchMatch {
    trackId: number;
    similarity: number;
  }

  abstract class RecordsEngine {
    constructor(targetZoneSize: number, searchSelectionCoefficient: number);

    static encodeAddress(
      anchorFrequency: number,
      pointFrequency: number,
      delta: number
    ): bigint;
    static decodeAddress(address: bigint): [number, number, number];
    static encodeCouple(absoluteTime: number, trackId: number): bigint;
    static decodeCouple(couple: bigint): [number, number];

    storeRecords(recordsTable: RecordsTable, trackId: number): void;
    searchRecords(clipRecordsTable: RecordsTable): void;
    clearAllRecords(): void;

    getSearchMatches(): RecordsSearchMatch[];
  }

  class MemoryRecordsEngine extends RecordsEngine {}

  function greetHello(): string;
}
