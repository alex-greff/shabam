/* Sample size of the FFT.  */
export const FFT_SIZE = 1024;

/* Target sample rate of the spectrogram (kHz). */
export const TARGET_SAMPLE_RATE = 16000;

/* Duration of the spectrogram/fingerprint window (seconds). */
export const WINDOW_DURATION = 0.02;

/* Smoothing used when analyzing the frequency.
   Range: [0, 1]
*/
export const WINDOW_SMOOTHING = 0.8;

/* Number of partitions in the fingerprints.
   Range: [1, infinity)
*/
export const FINGERPRINT_PARTITION_AMOUNT = 10;

/* Curve used to calculate partitions.
   Range: (1, infinity)
*/
export const FINGERPRINT_PARTITION_CURVE = 50;

/* Number of windows on each side of the slider
   TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH + 1
*/
export const FINGERPRINT_SLIDER_WIDTH = 5;

/* Number of windows above and below the slider
   TOTAL_SLIDER_HEIGHT = 2 * FINGERPRINT_SLIDER_HEIGHT + 1
*/
export const FINGERPRINT_SLIDER_HEIGHT = 2;

/* How much of the standard deviation is added to the fingerprint cell
   acceptance threshold value.
   In general, larger values make the fingerprint cell filtering more sensitive.
   <0: the standard deviation is subtracted from the mean
   0: no weight (only the mean is used)
   1: entire standard deviation is added
   >1: more than the entire standard deviation is added
*/
export const FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER = 1;
