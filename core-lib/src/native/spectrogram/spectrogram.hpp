#pragma once

#include <napi.h>
#include <liquid/liquid.h>

class Spectrogram : public Napi::ObjectWrap<Spectrogram> {
private:
  // Napi::Float64Array audio_samples_typed_arr; // TODO: remove
  float *audio_samples;
  liquid_float_complex *audio_samples_complex;
  size_t num_audio_samples;

  // --- Config Data ---

  int sample_rate;
  int FFT_size;
  float window_duration;

  // --- Spectrogram Data ---

  float *spectrogram_samples;
  int num_windows;
  int freq_bin_size;

  // --- Internal Functions ---

  // TODO: remove?
  // void ComputeFFTData(double *freq_data, int curr_window);

public:
  /**
   * Constructs a spectrogram object.
   * Arguments:
   * - audio_samples: Float64Array (or ArrayBuffer)
   * - sample_rate: integer
   * - FFT_size: integer
   * - window_duration: float
   */
  Spectrogram(const Napi::CallbackInfo &);
  ~Spectrogram();
  static Napi::Function GetClass(Napi::Env);
  void ComputeSpectrogram(const Napi::CallbackInfo &);
};