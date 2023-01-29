// TODO: this config system isn't great, there should be an explicit API for
// configuring them globally
// Also I should have a separation for each feature (fingerprint, search, etc)

class Configuration {
  /**
   * Sample size of the FFT.
   */
  FFT_SIZE: number = 1024;

  /**
   * Target sample rate of the spectrogram (kHz).
   */
  TARGET_SAMPLE_RATE: number = 16000; // TODO: put back in
  // TARGET_SAMPLE_RATE: number = 44100; // TODO: remove

  // TODO: this should be removed
  /**
   * Duration of the spectrogram/fingerprint window (seconds).
   */
  WINDOW_DURATION: number = 0.05;

  /**
   * Smoothing used when analyzing the frequency for the spectrogram
   * (browser only)
   * Range: [0, 1]
   */
  WINDOW_SMOOTHING: number = 0.8;

  /**
   * Number of partitions in the fingerprints.
   * Range: [1, infinity)
   */
  FINGERPRINT_PARTITION_AMOUNT: number = 50;

  /**
   * Curve used to calculate partitions.
   * Range: (1, infinity)
   */
  FINGERPRINT_PARTITION_CURVE: number = 50;

  /**
   * Number of windows on each side of the slider
   * TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH + 1
   */
  FINGERPRINT_SLIDER_WIDTH: number = 20;

  /**
   * Number of windows above and below the slider
   * TOTAL_SLIDER_HEIGHT = 2 * FINGERPRINT_SLIDER_HEIGHT + 1
   */
  FINGERPRINT_SLIDER_HEIGHT: number = 2;

  /**
   * How much of the standard deviation is added to the fingerprint cell
   * acceptance threshold value.
   * In general, larger values make the fingerprint cell filtering more
   * sensitive.
   * <0: the standard deviation is subtracted from the mean
   * 0: no weight (only the mean is used)
   * 1: entire standard deviation is added
   * >1: more than the entire standard deviation is added
   */
  FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER: number = 1;


  // --- Search Config ---

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
