#ifndef SHABAM_CORE_LIB_SPECTROGRAM
#define SHABAM_CORE_LIB_SPECTROGRAM

#include <liquid/liquid.h>
#include <stdlib.h>

typedef float (*window_function)(uint32_t i, uint32_t wlen);

/**
 * Computes the spectrogram of a given signal using the Short Time Fourier
 * Transform (STFT) algorithm.
 */
class Spectrogram {
private:
  // --- Samples ---

  /**
   * The array of samples with length `samples_length`.
   */
  float *samples;

  /**
   * The number of samples in `samples`.
   */
  size_t samples_length;

  // --- Spectrogram Config ---

  /**
   * Sample rate that the samples were taken at (Hz).
   */
  size_t sample_rate;

  /**
   * The number of samples taken in each window. Must be an odd number.
   */
  size_t window_size;

  /**
   * The hop size for each consecutive window.
   * If hop_size = window_size then no overlap exists between adjacent windows.
   * If hop_size < window_size then an overlap of window_size - hop_size exists
   * between adjacent windows.
   * If hop_size > window_size then an unmeasured sample gap of
   * hop_size - window_size exists between adjacent windows (not recommended).
   *
   * In general it is recommended that hop_size ~= window_size / 2
   */
  size_t hop_size;

  /**
   * The size of the FFT taken on each window. FFT_size must be a power of two
   * and FFT_size > window_size.
   */
  size_t FFT_size;

  /**
   * The windowing function to apply.
   * Can use the windowing functions provided by liquid:
   * https://liquidsdr.org/doc/windowing/
  */
  window_function window_func;

public:
  Spectrogram(float *samples, size_t samples_length, size_t window_size,
              size_t hop_size, size_t FFT_size, window_function window_func);
  ~Spectrogram();

  /**
   * Computes and populates the spectrogram.
   */
  void Compute();

  // --- Result Data ---

  /**
   * The computed spectrogram result. Is nullptr if the spectrogram has not been
   * computed yet.
   *
   * The data is a 2D array in a 1D array format.
   * spectrogram_result[window][bucket_num] = spectrogram_result[window *
   * num_buckets + bucket_num]
   */
  float *spectrogram_result;

  /**
   * The number of elements in the `spectrogram_result` array.
   */
  size_t spectrogram_result_length;

  /**
   * The number of buckets in the spectrogram result.
   */
  size_t spectrogram_result_num_buckets;

  /**
   * The number of windows in the spectrogram result.
   */
  size_t spectrogram_result_num_windows;
};

#endif