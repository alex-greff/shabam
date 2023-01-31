declare module "*core_lib_native.node" {
  interface SpectrogramData {
    data: Float32Array;
    numBuckets: number;
    numWindows: number;
  }

  class Spectrogram {
    constructor(
      samples: Float32Array,
      windowSize: number,
      hopSize: number,
      FFTSize: number
    );

    compute(): void;
    getSpectrogram(): SpectrogramData;
  }

  function greetHello(): string;
}
