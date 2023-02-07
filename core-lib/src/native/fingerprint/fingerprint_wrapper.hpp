#ifndef SHABAM_CORE_LIB_FINGERPRINT_WRAPPER
#define SHABAM_CORE_LIB_FINGERPRINT_WRAPPER

#include "fingerprint.hpp"
#include <napi.h>

class FingerprintWrapper : public Napi::ObjectWrap<FingerprintWrapper> {
public:
  FingerprintWrapper(const Napi::CallbackInfo &info);
  ~FingerprintWrapper();
  static Napi::Function GetClass(Napi::Env env);

  /**
   * Spectrogram data buffer.
   */
  float *spectrogram;

  /**
   * Fingerprint instance tied to the wrapper instance.
   */
  Fingerprint *fingerprint;

  void Compute(const Napi::CallbackInfo &info);
  Napi::Value GetFingerprint(const Napi::CallbackInfo &info);
  static Napi::Value ComputePartitionRanges(const Napi::CallbackInfo &info);
  static void GetFingerprintData(Napi::Env env, Napi::Value &value,
                                 fingerprint_data_t &fingerprint_data);
};

#endif