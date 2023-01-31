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

  function greetHello(): string;
}
