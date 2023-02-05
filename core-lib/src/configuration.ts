import { type WindowFunction } from "../build/Release/core_lib_native.node";
import { LoaderConfig } from "./loader/types";
import { FingerprintConfig } from "./fingerprint/types";
import { SpectrogramConfig } from "./spectrogram/types";
// TODO: this config system isn't great, there should be an explicit API for
// configuring them globally
// Also I should have a separation for each feature (fingerprint, search, etc)

class Configuration {
  // ---------------------------------
  // --- Input Audio Configuration ---
  // ---------------------------------

  loaderConfig: LoaderConfig = {
    inputTargetSampleRate: 16000,
  };

  // TODO: remove
  // /**
  //  * Target sample rate of the input audio (kHz).
  //  */
  // INPUT_TARGET_SAMPLE_RATE: number = 16000;

  // ---------------------------------
  // --- Spectrogram Configuration ---
  // ---------------------------------

  spectrogramConfig: SpectrogramConfig = {
    FFTSize: 2048,
    windowFunction: "blackman-harris",
    windowDuration: 0.1
  };

  // TODO: remove
  // /**
  //  * Sample size of the FFT.
  //  */
  // SPECTROGRAM_FFT_SIZE: number = 2048;

  // /**
  //  * The windowing function to use when computing the spectrogram.
  //  */
  // SPECTROGRAM_WINDOW_FUNCTION: WindowFunction = "blackman-harris";

  // // TODO: this should be removed
  // /**
  //  * Duration of the spectrogram/fingerprint window (seconds).
  //  * Note: the window size (sample rate * window duration) should be less than
  //  * the configured FFT size.
  //  */
  // SPECTROGRAM_WINDOW_DURATION: number = 0.1;

  // // TODO: eventually remove this
  // /**
  //  * Smoothing used when analyzing the frequency for the spectrogram
  //  * (browser only)
  //  * Range: [0, 1]
  //  */
  // SPECTROGRAM_WINDOW_SMOOTHING: number = 0.8;

  // ---------------------------------
  // --- Fingerprint Configuration ---
  // ---------------------------------

  fingerprintConfig: FingerprintConfig = {
    partitionAmount: 50,
    partitionCurve: 50.0,
    slidingWindowWidth: 21,
    slidingWindowHeight: 5,
    standardDeviationMultiplier: 2.3,
  };

  // TODO: remove

  // /**
  //  * Number of partitions in the fingerprints. Higher values result in steeper
  //  * curves.
  //  * 
  //  * Range: [1, infinity)
  //  */
  // FINGERPRINT_PARTITION_AMOUNT: number = 50;

  // /**
  //  * Curve used to calculate partitions.
  //  * Range: (1, infinity)
  //  */
  // FINGERPRINT_PARTITION_CURVE: number = 50;

  // /**
  //  * Number of windows on each side of the slider
  //  * TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH + 1
  //  */
  // FINGERPRINT_SLIDER_WIDTH: number = 20;

  // /**
  //  * Number of windows above and below the slider
  //  * TOTAL_SLIDER_HEIGHT = 2 * FINGERPRINT_SLIDER_HEIGHT + 1
  //  */
  // FINGERPRINT_SLIDER_HEIGHT: number = 2;

  // /**
  //  * How much of the standard deviation is added to the fingerprint cell
  //  * acceptance threshold value.
  //  * In general, larger values make the fingerprint cell filtering more
  //  * sensitive.
  //  * <0: the standard deviation is subtracted from the mean
  //  * 0: no weight (only the mean is used)
  //  * 1: entire standard deviation is added
  //  * >1: more than the entire standard deviation is added
  //  */
  // FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER: number = 1;

  // ---------------------
  // --- Search Config ---
  // ---------------------

  /**
   * The size of the target zone.
   */
  TARGET_ZONE_SIZE: number = 5;

  /**
   * How many addresses/couples to flush in each chunk.
   */
  FLUSH_EVERY_NTH_ITEMS: number = 5000;

  /**
   * The number of couples that will be searched in a single database query.
   */
  SEARCH_EVERY_N_COUPLES: number = 5000;

  /**
   * Dictates how picky the selection cutoff is when comparing the total hit
   * numbers of potential tracks.
   * 0 = every potential track is selected
   * 1 = only clips who have all their target zones match
   * Range: [0, 1]
   */
  SEARCH_SELECTION_COEFFICIENT: number = 0.8;
}

let configInstance = new Configuration();

export const config = configInstance;
