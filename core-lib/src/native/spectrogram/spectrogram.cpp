#include "spectrogram.hpp"
#include <iostream>
#include <liquid/liquid.h>
#include <math.h>
#include <stdexcept>
#include <string.h>

Spectrogram::Spectrogram(float *samples, size_t samples_length,
                         size_t window_size, size_t hop_size, size_t FFT_size,
                         window_function window_func) {
  if (samples == nullptr)
    throw std::invalid_argument("samples must not be nullptr.");

  if (hop_size % 2 != 1)
    throw std::invalid_argument("hop_size must be an odd number.");

  if (FFT_size < window_size)
    throw std::invalid_argument(
        "FFT_size must be greater than or equal to window_size.");

  if (window_func == nullptr)
    throw std::invalid_argument("window_func must not be nullptr.");

  // Reference:
  // https://www.educative.io/answers/how-to-check-if-a-number-is-a-power-of-2-in-cpp
  if (ceil(log2f32(FFT_size)) != floor(log2f32(FFT_size))) {
    throw std::invalid_argument("FFT_size must be a power of 2.");
  }

  this->samples = samples;
  this->samples_length = samples_length;
  this->window_size = window_size;
  this->hop_size = hop_size;
  this->FFT_size = FFT_size;

  this->spectrogram_result = nullptr;
  this->spectrogram_result_length = 0;
  this->spectrogram_result_num_buckets = 0;
  this->spectrogram_result_num_windows = 0;
}

Spectrogram::~Spectrogram() {
  if (this->spectrogram_result != nullptr)
    delete this->spectrogram_result;
}

void Spectrogram::Compute() {
  size_t hop_size = this->hop_size;
  size_t window_size = this->window_size;
  size_t padded_window_size = this->FFT_size;

  window_function window_func = this->window_func;

  // We fit as many full windows as possible. Remaining samples at the end
  // that don't fit into a window will just be discarded.
  size_t num_windows = floor(
      (double)(this->samples_length - window_size) / (double)hop_size);
  size_t num_buckets = floor(this->FFT_size / 2);

  // TODO: remove
  std::cout << ">>> C++: num_windows " << num_windows << " num_buckets "
            << num_buckets << " samples_length " << this->samples_length
            << " window_size " << window_size << " hop_size " << hop_size
            << " FFT_size " << this->FFT_size << "\n";
  std::cout << "window_size " << window_size << " padded_window_size " << padded_window_size << "\n";

  // Setup spectrogram result
  float *spectrogram_result = new float[num_buckets * num_windows];

  this->spectrogram_result = spectrogram_result;
  this->spectrogram_result_length = num_buckets * num_windows;
  this->spectrogram_result_num_buckets = num_buckets;
  this->spectrogram_result_num_windows = num_windows;

  for (size_t window = 0; window < num_windows; window++) {
    size_t start_idx = window * hop_size;

    // Initialize window samples
    liquid_float_complex *window_samples =
        new liquid_float_complex[padded_window_size];

    // Initialize FFT result
    liquid_float_complex *fft_result =
        new liquid_float_complex[padded_window_size];

    int flags = 0;
    fftplan plan = fft_create_plan(padded_window_size, window_samples,
                                   fft_result, LIQUID_FFT_FORWARD, flags);

    
    // Initialize window_samples
    memset(window_samples, 0,
           padded_window_size * sizeof(liquid_float_complex));
    // Copy in the window sample to the real component
    for (size_t window_idx = 0, sample_idx = start_idx;
         window_idx < window_size; window_idx++, sample_idx++) {
      float window_val = blackmanharris(window_idx, window_size);
      window_samples[window_idx].real = samples[sample_idx] * window_val;
    }

    // Compute FFT
    fft_execute(plan);

    // The start of the bucket that this current window corresponds to
    float *spectrogram_result_bucket =
        &spectrogram_result[window * num_buckets];

    // Copy out FFT result
    // Note: fft_result has a length of FFT_size but half of it is just mirrored
    // so we can just take the first half as our FFT window
    for (size_t bucket_idx = 0; bucket_idx < num_buckets; bucket_idx++) {
      spectrogram_result_bucket[bucket_idx] = fft_result[bucket_idx].real;
    }

    // Cleanup
    fft_destroy_plan(plan);
    delete window_samples;
    delete fft_result;
  }
}