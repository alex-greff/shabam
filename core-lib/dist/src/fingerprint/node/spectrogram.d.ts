import wavefile from "wavefile";
import { ComputeSpectrogramDataOptions, SpectrogramData } from "../types";
/**
 * Resamples the given audio WAV file to the given sample rate.
 * For Node.js only
 */
export declare function resample(audio: wavefile.WaveFile, sampleRate: number): wavefile.WaveFile;
/**
 * Computes the spectrogram data for the given audio file. Note: assumes the
 * given audio is already resampled to `sampleRate`.
 *
 * @param audio The audio to compute the spectrogram of.
 * @param sampleRate The sample rate of the audio.
 * @param options Spectrogram options.
 */
export declare function computeSpectrogramData(audio: wavefile.WaveFile, sampleRate?: number, options?: Partial<ComputeSpectrogramDataOptions>): Promise<SpectrogramData>;
