declare module "spectro" {
  import { Writable } from "stream";

  type WindowFunctions =
    | "Square"
    | "Hamming"
    | "VonHann"
    | "Blackman"
    | "BlackmanHarris"
    | "BlackmanNuttall"
    | "Bartlett";

  type RGB = [number, number, number];

  interface Config {
    /**
     * Bits per sample (8, 16 or 32)
     */
    bps?: number;
    /**
     * The channels count (at the moment only 1 is allowed)
     */
    channels?: number;
    /**
     *  The window size (must be a power of 2)
     */
    wSize?: number;
    /**
     * The window function to use ('Hamming')
     */
    wFunc?: WindowFunctions;
    /**
     * The overlap size (must be >= 0 and < 1)
     */
    overlap?: number;
    /**
     * The number of workers to use (> 0)
     */
    workers?: number;
  }

  class Spectro extends Writable {
    constructor(config?: Config);

    // on(e: "data", cb: (err: any, frame: number[]) => void): void;
    // on(e: "end", cb: (err: any, data: number[][]) => void): void;

    start(): void;
    stop(): void;
    clear(): void;
    executionTime(): number;

    static colorize(
      colorMap: Record<number, string>
    ): (intensity: number) => RGB;
    static maxApplitude(spectrogram: number[]): number;
    static minApplitude(spectrogram: number[]): number;
  }
  export = Spectro;
}
