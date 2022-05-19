declare module "dsp.js" {
  
  class FFT {
    constructor(bufferSize: number, sampleRate: number);

    forward(signal: Buffer): void;

    get spectrum(): Float64Array;
  }
}