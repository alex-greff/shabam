export const FFT_SIZE = 1024; // samples
export const TARGET_SAMPLE_RATE = 16000; // kHz
export const WINDOW_DURATION = 0.05; // seconds
export const WINDOW_SMOOTHING = 0.8; // [0, 1]
export const FINGERPRINT_PARITION_AMOUNT = 6; // [1, infinity)
export const FINGERPRINT_PARITIION_CURVE = 80; // (1, infinity)

export default {
    FFT_SIZE,
    TARGET_SAMPLE_RATE,
    WINDOW_DURATION,
    WINDOW_SMOOTHING,
    FINGERPRINT_PARITION_AMOUNT,
    FINGERPRINT_PARITIION_CURVE,
};