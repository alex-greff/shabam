import { ComputeSpectrogramDataOptions, SpectrogramData } from "../types";
/**
 * Computes the spectrogram data of the given source audio buffer.
 *
 * @param source The source audio buffer.
 * @param options The configuration options.
 */
export declare function computeSpectrogramData(source: AudioBuffer, options?: Partial<ComputeSpectrogramDataOptions>): Promise<SpectrogramData>;
