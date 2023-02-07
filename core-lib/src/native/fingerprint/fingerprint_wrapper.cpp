#include "fingerprint_wrapper.hpp"
#include <assert.h>

FingerprintWrapper::FingerprintWrapper(const Napi::CallbackInfo &info)
    : ObjectWrap(info) {
  // Expected arguments:
  // - partitionCurveTension: number (int)
  // - partitionCount: number (int)
  // - standardDeviationMultiplier: number (float)
  // - slidingWindowWidth: number (int)
  // - slidingWindowHeight: number (int)
  // - spectrogram: Float32Array
  // - spectrogramNumBuckets: number (int, power of 2)
  // - spectrogramNumWindows: number (int)

  Napi::Env env = info.Env();

  if (info.Length() != 8) {
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

  if (!info[5].IsTypedArray()) {
    Napi::TypeError::New(env, "spectrogram argument needs to be a typed array.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[6].IsNumber()) {
    Napi::TypeError::New(
        env, "spectrogramNumBuckets argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[7].IsNumber()) {
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

  auto spectrogram_typed_arr = info[5].As<Napi::TypedArrayOf<float>>();
  size_t spectrogram_length = spectrogram_typed_arr.ElementLength();
  size_t spectrogram_num_buckets = info[6].As<Napi::Number>().Int32Value();
  size_t spectrogram_num_windows = info[7].As<Napi::Number>().Int32Value();
  assert(spectrogram_length =
             spectrogram_num_buckets * spectrogram_num_windows);
  float *spectrogram = new float[spectrogram_length];
  memcpy(spectrogram, spectrogram_typed_arr.Data(),
         spectrogram_length * sizeof(float));
  this->spectrogram = spectrogram;

  this->fingerprint =
      new Fingerprint(spectrogram, spectrogram_length, spectrogram_num_buckets,
                      spectrogram_num_windows, standard_deviation_multiplier,
                      partition_curve_tension, partition_count,
                      sliding_window_width, sliding_window_height);
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
  Napi::Object ret = Napi::Object::New(env);

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

  ret.Set("numWindows", fingerprint->spectrogram_num_windows);
  ret.Set("numPartitions", fingerprint->partition_count);
  ret.Set("numBuckets", fingerprint->spectrogram_num_buckets);
  ret.Set("data", fingerprint_data_typed_arr);
  ret.Set("partitionRanges", partition_ranges_array);

  return ret;
}

Napi::Value
FingerprintWrapper::ComputePartitionRanges(const Napi::CallbackInfo &info) {
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
    Napi::TypeError::New(env,
                         "partitionCurveTension argument needs to be a float.")
        .ThrowAsJavaScriptException();
    return Napi::Array::New(env);
  }

  if (!info[2].IsNumber()) {
    Napi::TypeError::New(
        env, "spectrogramNumBuckets argument needs to be an integer.")
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

void FingerprintWrapper::GetFingerprintData(
    Napi::Env env, Napi::Value &value, fingerprint_data_t &fingerprint_data) {
  if (!value.IsObject()) {
    Napi::TypeError::New(env, "Input value must be an object.")
        .ThrowAsJavaScriptException();
    return;
  }

  Napi::Object obj = value.As<Napi::Object>();

  if (!obj.Has("numWindows")) {
    Napi::TypeError::New(env, "Missing `numWindows` property.")
        .ThrowAsJavaScriptException();
    return;
  }
  if (!obj.Has("numPartitions")) {
    Napi::TypeError::New(env, "Missing `numPartitions` property.")
        .ThrowAsJavaScriptException();
    return;
  }
  if (!obj.Has("numBuckets")) {
    Napi::TypeError::New(env, "Missing `numBuckets` property.")
        .ThrowAsJavaScriptException();
    return;
  }
  if (!obj.Has("partitionRanges")) {
    Napi::TypeError::New(env, "Missing `partitionRanges` property.")
        .ThrowAsJavaScriptException();
    return;
  }
  if (!obj.Has("data")) {
    Napi::TypeError::New(env, "Missing `data` property.")
        .ThrowAsJavaScriptException();
    return;
  }

  size_t num_windows = obj.Get("numWindows").As<Napi::Number>().Int32Value();
  size_t num_partitions =
      obj.Get("numPartitions").As<Napi::Number>().Int32Value();
  size_t num_buckets = obj.Get("numBuckets").As<Napi::Number>().Int32Value();

  Napi::Array partitions_arr = obj.Get("partitionRanges").As<Napi::Array>();
  Napi::Uint32Array data_typed_arr = obj.Get("data").As<Napi::Uint32Array>();

  if (partitions_arr.Length() != num_partitions) {
    Napi::TypeError::New(env,
                         "`partitionRanges` must be of length `numPartitions`.")
        .ThrowAsJavaScriptException();
    return;
  }

  uint32_t *partitions = new uint32_t[num_partitions + 1];
  for (size_t i = 0; i < num_partitions; i++) {
    Napi::Value curr_value = partitions_arr.Get(i);
    if (!curr_value.IsArray()) {
      Napi::TypeError::New(env, "Each item in `partitionRanges` must be a "
                                "tuple of type [number, number].")
          .ThrowAsJavaScriptException();
      return;
    }

    Napi::Array curr_value_arr = curr_value.As<Napi::Array>();
    if (curr_value_arr.Length() != 2) {
      Napi::TypeError::New(env, "Each item in `partitionRanges` must be a "
                                "tuple of type [number, number].")
          .ThrowAsJavaScriptException();
      return;
    }

    Napi::Value left_value = curr_value_arr.Get((uint32_t)0);
    Napi::Value right_value = curr_value_arr.Get(1);

    if (!left_value.IsNumber() || !right_value.IsNumber()) {
      Napi::TypeError::New(env, "Each item in `partitionRanges` must be a "
                                "tuple of type [number, number].")
          .ThrowAsJavaScriptException();
      return;
    }

    size_t range_start = left_value.As<Napi::Number>().Int32Value();
    size_t range_end = right_value.As<Napi::Number>().Int32Value();

    partitions[i] = range_start;
    if (i == (num_partitions - 1)) {
      partitions[i + 1] = range_end;
    }
  }

  size_t fingerprint_length = data_typed_arr.ElementLength();
  uint32_t *fingerprint = new uint32_t[fingerprint_length];
  // TODO: look into using memcpy or something here
  for (size_t i = 0; i < fingerprint_length; i++) {
    fingerprint[i] = data_typed_arr[i];
  }

  fingerprint_data.num_windows = num_windows;
  fingerprint_data.num_partitions = num_partitions;
  fingerprint_data.num_buckets = num_buckets;
  fingerprint_data.partitions = partitions;
  fingerprint_data.fingerprint = fingerprint;
  fingerprint_data.fingerprint_length = fingerprint_length;
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
  Napi::FunctionReference *constructor = new Napi::FunctionReference();
  *constructor = Napi::Persistent(func);
  env.SetInstanceData<Napi::FunctionReference>(constructor);
  return func;
}