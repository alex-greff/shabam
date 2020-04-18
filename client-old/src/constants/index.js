export const FFT_SIZE = 1024; // samples
export const TARGET_SAMPLE_RATE = 16000; // kHz
export const WINDOW_DURATION = 0.02; // seconds
export const WINDOW_SMOOTHING = 0.8; // [0, 1]
export const FINGERPRINT_PARITION_AMOUNT = 10; // [1, infinity)
export const FINGERPRINT_PARITIION_CURVE = 50; // (1, infinity)
export const FINGERPRINT_SLIDER_WIDTH = 10; // num windows on each side
export const FINGERPRINT_THRESHOLD_MULTIPLIER = 0.6; // 0: everything passes, 1: no weight, (at least) >255: nothing passes
export const FINGERPRINT_FREQ_PASS_PERCENT = 0.3; // [0, 1]

export default {
    FFT_SIZE,
    TARGET_SAMPLE_RATE,
    WINDOW_DURATION,
    WINDOW_SMOOTHING,
    FINGERPRINT_PARITION_AMOUNT,
    FINGERPRINT_PARITIION_CURVE,
    FINGERPRINT_SLIDER_WIDTH,
    FINGERPRINT_THRESHOLD_MULTIPLIER,
    FINGERPRINT_FREQ_PASS_PERCENT,
};