declare class Configuration {
    /**
     * Sample size of the FFT.
     */
    FFT_SIZE: number;
    /**
     * Target sample rate of the spectrogram (kHz).
     */
    TARGET_SAMPLE_RATE: number;
    /**
     * Duration of the spectrogram/fingerprint window (seconds).
     */
    WINDOW_DURATION: number;
    /**
     * Smoothing used when analyzing the frequency for the spectrogram
     * (browser only)
     * Range: [0, 1]
     */
    WINDOW_SMOOTHING: number;
    /**
     * Number of partitions in the fingerprints.
     * Range: [1, infinity)
     */
    FINGERPRINT_PARTITION_AMOUNT: number;
    /**
     * Curve used to calculate partitions.
     * Range: (1, infinity)
     */
    FINGERPRINT_PARTITION_CURVE: number;
    /**
     * Number of windows on each side of the slider
     * TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH + 1
     */
    FINGERPRINT_SLIDER_WIDTH: number;
    /**
     * Number of windows above and below the slider
     * TOTAL_SLIDER_HEIGHT = 2 * FINGERPRINT_SLIDER_HEIGHT + 1
     */
    FINGERPRINT_SLIDER_HEIGHT: number;
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
    FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER: number;
}
export declare const config: Configuration;
export {};
