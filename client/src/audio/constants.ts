// samples
export const FFT_SIZE = 1024; 

// kHz
export const TARGET_SAMPLE_RATE = 16000; 

// seconds
export const WINDOW_DURATION = 0.02; 

// [0, 1]
export const WINDOW_SMOOTHING = 0.8; 

// [1, infinity)
export const FINGERPRINT_PARTITION_AMOUNT = 10; 

// (1, infinity)
export const FINGERPRINT_PARTITION_CURVE = 50; 

// num windows on each side of the slider
// TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH
// export const FINGERPRINT_SLIDER_WIDTH = 10; // TODO: put back
export const FINGERPRINT_SLIDER_WIDTH = 4; 

// How much of the standard deviation is added to the fingerprint cell
// acceptance threshold value. Recommended to have a value [0, 0.5]
// 0: no weight (only mean is used)
// 1: entire standard deviation is added
// >1: more than the entire standard deviation is added
export const FINGERPRINT_STANDARD_DEVIATION_MULTIPLIER = 0.3;
