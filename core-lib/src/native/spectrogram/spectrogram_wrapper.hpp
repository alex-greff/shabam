#ifndef SHABAM_CORE_LIB_SPECTROGRAM_WRAPPER
#define SHABAM_CORE_LIB_SPECTROGRAM_WRAPPER

#include "spectrogram.hpp"
#include <liquid/liquid.h>
#include <napi.h>

class SpectrogramWrapper : public Napi::ObjectWrap<SpectrogramWrapper> {
private:
  // // Napi::Float64Array audio_samples_typed_arr; // TODO: remove
  // float *audio_samples;
  // liquid_float_complex *audio_samples_complex;
  // size_t num_audio_samples;

  // // --- Config Data ---

  // int sample_rate;
  // int FFT_size;
  // float window_duration;

  // // --- Spectrogram Data ---

  // float *spectrogram_samples;
  // int num_windows;
  // int freq_bin_size;

  // --- Internal Functions ---

  // TODO: remove?
  // void ComputeFFTData(double *freq_data, int curr_window);

  float *samples;

  Spectrogram *spectrogram;

public:
  /**
   * Constructs a spectrogram object.
   * Arguments:
   * - audio_samples: Float64Array (or ArrayBuffer)
   * - sample_rate: integer
   * - FFT_size: integer
   * - window_duration: float
   */
  SpectrogramWrapper(const Napi::CallbackInfo &info);
  ~SpectrogramWrapper();
  static Napi::Function GetClass(Napi::Env env);
  void Compute(const Napi::CallbackInfo &info);
  Napi::Value GetSpectrogram(const Napi::CallbackInfo &info);
};

#endif