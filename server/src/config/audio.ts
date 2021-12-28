/* Supported audio file mime types. */
export const SUPPORTED_AUDIO_MIME_TYPES = [
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
];

/* Target sample rate of the spectrogram (Hz). */
export const TARGET_SAMPLE_RATE = 16000;

/* Sample size of the FFT.  */
export const FFT_SIZE = 1024;

/* Duration of the spectrogram/fingerprint window (seconds). */
export const WINDOW_DURATION = 0.05;

/* Smoothing used when analyzing the frequency.
   Range: [0, 1]
*/
export const WINDOW_SMOOTHING = 0.8;
