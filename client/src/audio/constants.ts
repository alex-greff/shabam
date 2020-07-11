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

// num windows on each side
export const FINGERPRINT_SLIDER_WIDTH = 10; 

// 0: everything passes, 1: no weight, (at least) >255: nothing passes
export const FINGERPRINT_THRESHOLD_MULTIPLIER = 0.6; 

// [0, 1]
export const FINGERPRINT_FREQ_PASS_PERCENT = 0.3; 
