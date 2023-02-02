#ifndef SHABAM_CORE_LIB_FINGERPRINT_WRAPPER
#define SHABAM_CORE_LIB_FINGERPRINT_WRAPPER

#include "fingerprint.hpp"
#include <napi.h>

class FingerprintWrapper : public Napi::ObjectWrap<FingerprintWrapper> {
private:
  /**
   * Spectrogram data buffer.
  */
  float *spectrogram;

  /**
   * Fingerprint instance tied to the wrapper instance.
  */
  Fingerprint *fingerprint;

public:
  FingerprintWrapper(const Napi::CallbackInfo &info);
  ~FingerprintWrapper();
  static Napi::Function GetClass(Napi::Env env);
  void Compute(const Napi::CallbackInfo &info);
  Napi::Value GetFingerprint(const Napi::CallbackInfo &info);
  static Napi::Value ComputePartitionRanges(const Napi::CallbackInfo &info) {
    // Expected arguments
    // - partitionCount: number (int)
    // - partitionCurveTension: number (float)
    // - spectrogramNumBuckets: number (int)

    Napi::Env env = info.Env();

    if (info.Length() != 3) {
      Napi::TypeError::New(env, "Wrong number of arguments")
          .ThrowAsJavaScriptException();
      return Napi::Array::New(env);
    }

    if (!info[0].IsNumber()) {
      Napi::TypeError::New(env, "partitionCount argument needs to be an integer.")
          .ThrowAsJavaScriptException();
      return Napi::Array::New(env);
    }

    if (!info[1].IsNumber()) {
      Napi::TypeError::New(env, "partitionCurveTension argument needs to be a float.")
          .ThrowAsJavaScriptException();
      return Napi::Array::New(env);
    }

    if (!info[2].IsNumber()) {
      Napi::TypeError::New(env, "spectrogramNumBuckets argument needs to be an integer.")
          .ThrowAsJavaScriptException();
      return Napi::Array::New(env);
    }

    size_t partition_count = info[0].As<Napi::Number>().Int32Value();
    float partition_curve_tension = info[1].As<Napi::Number>().FloatValue();
    size_t spectrogram_num_buckets = info[2].As<Napi::Number>().Int32Value();

    // Construct the partition range array of tuples
    uint32_t *partitions = new uint32_t[partition_count + 1];
    Fingerprint::ComputePartitionRanges(partitions, partition_count,
                                      partition_curve_tension,
                                      spectrogram_num_buckets);
    Napi::Array partition_ranges_array = Napi::Array::New(env);
    for (size_t p = 0; p < partition_count; p++) {
      Napi::Array partition_tuple = Napi::Array::New(env);
      partition_tuple[(uint32_t)0] = Napi::Number::New(env, partitions[p]);
      partition_tuple[(uint32_t)1] = Napi::Number::New(env, partitions[p + 1]);
      partition_ranges_array[p] = partition_tuple;
    }
    delete partitions;

    return partition_ranges_array;
  }
};

#endif