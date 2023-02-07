#ifndef SHABAM_CORE_LIB_SPECTROGRAM_WRAPPER
#define SHABAM_CORE_LIB_SPECTROGRAM_WRAPPER

#include "spectrogram.hpp"
#include <napi.h>

class SpectrogramWrapper : public Napi::ObjectWrap<SpectrogramWrapper> {
private:
  /**
   * Sample data buffer.
  */
  float *samples;

  /**
   * Spectrogram instance tied to the wrapper instance.
  */
  Spectrogram *spectrogram;

public:
  /**
   * Constructs a spectrogram object.
   * Arguments:
   * - samples: Float32Array
   * - windowFuncName: string
   * - windowSize: number (uint)
   * - hopSize: number (uint)
   * - FFTSize: number (uint, power of 2)
   */
  SpectrogramWrapper(const Napi::CallbackInfo &info);
  ~SpectrogramWrapper();
  static Napi::Function GetClass(Napi::Env env);
  
  void Compute(const Napi::CallbackInfo &info);
  Napi::Value GetSpectrogram(const Napi::CallbackInfo &info);
};

#endif