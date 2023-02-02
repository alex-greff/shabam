#include "fingerprint_wrapper.hpp"
#include <assert.h>

using namespace Napi;

FingerprintWrapper::FingerprintWrapper(const Napi::CallbackInfo &info)
    : ObjectWrap(info) {
  // Expected arguments:
  // - partitionCurveTension: number (int)
  // - partitionCount: number (int)
  // - standardDeviationMultiplier: number (float)
  // - slidingWindowWidth: number (int)
  // - slidingWindowHeight: number (int)
  // - slidingWindowFuncName: string
  // - spectrogram: Float32Array
  // - spectrogramNumBuckets: number (int, power of 2)
  // - spectrogramNumWindows: number (int)

  Napi::Env env = info.Env();

  if (info.Length() != 9) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env,
                         "partitionCurveTension argument needs to be a float.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "partitionCount argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[2].IsNumber()) {
    Napi::TypeError::New(
        env, "standardDeviationMultiplier argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[3].IsNumber()) {
    Napi::TypeError::New(env,
                         "slidingWindowWidth argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[4].IsNumber()) {
    Napi::TypeError::New(env,
                         "slidingWindowWidth argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[5].IsString()) {
    Napi::TypeError::New(env,
                         "slidingWindowFuncName argument needs to be a string.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[6].IsTypedArray()) {
    Napi::TypeError::New(env, "spectrogram argument needs to be a typed array.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[7].IsNumber()) {
    Napi::TypeError::New(
        env, "spectrogramNumBuckets argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[8].IsNumber()) {
    Napi::TypeError::New(
        env, "spectrogramNumWindows argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  float partition_curve_tension = info[0].As<Napi::Number>().FloatValue();
  size_t partition_count = info[1].As<Napi::Number>().Int32Value();
  float standard_deviation_multiplier = info[2].As<Napi::Number>().FloatValue();
  size_t sliding_window_width = info[3].As<Napi::Number>().Int32Value();
  size_t sliding_window_height = info[4].As<Napi::Number>().Int32Value();
  Napi::String sliding_window_func_name = info[5].As<Napi::String>();

  auto spectrogram_typed_arr = info[6].As<Napi::TypedArrayOf<float>>();
  size_t spectrogram_length = spectrogram_typed_arr.ElementLength();
  size_t spectrogram_num_buckets = info[7].As<Napi::Number>().Int32Value();
  size_t spectrogram_num_windows = info[8].As<Napi::Number>().Int32Value();
  assert(spectrogram_length =
             spectrogram_num_buckets * spectrogram_num_windows);
  float *spectrogram = new float[spectrogram_length];
  memcpy(spectrogram, spectrogram_typed_arr.Data(),
         spectrogram_length * sizeof(float));
  this->spectrogram = spectrogram;

  this->fingerprint = new Fingerprint(
      spectrogram, spectrogram_length, spectrogram_num_buckets,
      spectrogram_num_windows, standard_deviation_multiplier,
      partition_curve_tension, partition_count, sliding_window_width,
      sliding_window_height, sliding_window_func_name);
}

FingerprintWrapper::~FingerprintWrapper() {
  delete this->spectrogram;
  delete this->fingerprint;
}

void FingerprintWrapper::Compute(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return;
  }

  this->fingerprint->Compute();
}

Napi::Value FingerprintWrapper::GetFingerprint(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::Object ret = Object::New(env);

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return ret;
  }

  Fingerprint *fingerprint = this->fingerprint;

  // Construct the partition range array of tuples
  size_t num_partitions = fingerprint->partition_count;
  float partition_curve_tension = fingerprint->partition_curve_tension;
  size_t spectrogram_num_buckets = fingerprint->spectrogram_num_buckets;
  uint32_t *partitions = new uint32_t[num_partitions + 1];
  Fingerprint::ComputePartitionRanges(partitions, num_partitions,
                                      partition_curve_tension,
                                      spectrogram_num_buckets);
  Napi::Array partition_ranges_array = Napi::Array::New(env);
  for (size_t p = 0; p < num_partitions; p++) {
    Napi::Array partition_tuple = Napi::Array::New(env);
    partition_tuple[(uint32_t)0] = Napi::Number::New(env, partitions[p]);
    partition_tuple[(uint32_t)1] = Napi::Number::New(env, partitions[p + 1]);
    partition_ranges_array[p] = partition_tuple;
  }
  delete partitions;

  uint32_t *fingerprint_data = this->fingerprint->fingerprint;
  Napi::Uint32Array fingerprint_data_typed_arr =
      Napi::Uint32Array::New(env, fingerprint->fingerprint_length);
  for (size_t i = 0; i < fingerprint->fingerprint_length; i++) {
    fingerprint_data_typed_arr[i] = fingerprint_data[i];
  }

  ret.Set("numberOfWindows", fingerprint->spectrogram_num_windows);
  ret.Set("numberOfPartitions", fingerprint->partition_count);
  ret.Set("frequencyBinCount", fingerprint->spectrogram_num_buckets);
  ret.Set("data", fingerprint_data_typed_arr);
  ret.Set("partitionRanges", partition_ranges_array);

  return ret;
}

Napi::Function FingerprintWrapper::GetClass(Napi::Env env) {
  Napi::Function func =
      DefineClass(env, "Fingerprint",
                  {FingerprintWrapper::InstanceMethod(
                       "compute", &FingerprintWrapper::Compute),
                   FingerprintWrapper::InstanceMethod(
                       "getFingerprint", &FingerprintWrapper::GetFingerprint),
                   FingerprintWrapper::StaticMethod(
                       "computePartitionRanges",
                       &FingerprintWrapper::ComputePartitionRanges)});
  return func;
}