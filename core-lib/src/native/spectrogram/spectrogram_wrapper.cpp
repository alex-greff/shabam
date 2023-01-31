#include "spectrogram_wrapper.hpp"
#include <liquid/liquid.h>
#include <math.h>

using namespace Napi;

SpectrogramWrapper::SpectrogramWrapper(const Napi::CallbackInfo &info)
    : ObjectWrap(info) {
  // Expected arguments:
  // - samples: Float32Array
  // - windowSize: number (uint)
  // - hopSize: number (uint)
  // - FFTSize: number (uint, power of 2)

  Napi::Env env = info.Env();

  if (info.Length() != 4) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[0].IsTypedArray()) {
    Napi::TypeError::New(env,
                         "audio_sample argument needs to be a typed array.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "windowSize argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[2].IsNumber()) {
    Napi::TypeError::New(env, "hopSize argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[3].IsNumber()) {
    Napi::TypeError::New(env, "FFTSize argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  auto samples_typed_arr = info[0].As<Napi::TypedArrayOf<float>>();
  size_t samples_length = samples_typed_arr.ElementLength();
  float *samples = new float[samples_length];
  memcpy(samples, samples_typed_arr.Data(), samples_length * sizeof(float));
  this->samples = samples;

  int window_size = info[1].As<Napi::Number>().Int32Value();
  int hop_size = info[2].As<Napi::Number>().Int32Value();
  int FFT_size = info[3].As<Napi::Number>().Int32Value();

  this->spectrogram = new Spectrogram(samples, samples_length, window_size,
                                      hop_size, FFT_size, liquid_blackmanharris);
}

SpectrogramWrapper::~SpectrogramWrapper() {
  delete this->samples;
  delete this->spectrogram;
}

void SpectrogramWrapper::Compute(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return;
  }

  this->spectrogram->Compute();
}

Napi::Value SpectrogramWrapper::GetSpectrogram(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::Object ret = Object::New(env);

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return ret;
  }

  Spectrogram *spectrogram = this->spectrogram;
  float *spectrogram_data = spectrogram->spectrogram_result;

  if (spectrogram_data == nullptr) {
    Napi::TypeError::New(env, "Spectrogram has not been computed yet.")
        .ThrowAsJavaScriptException();
    return ret;
  }

  Napi::Float32Array spectrogram_data_typed_arr =
      Napi::Float32Array::New(env, spectrogram->spectrogram_result_length);
  // TODO: look into using memcpy or something here
  for (size_t i = 0; i < spectrogram->spectrogram_result_length; i++) {
    spectrogram_data_typed_arr[i] = spectrogram_data[i];
  }

  ret.Set("data", spectrogram_data_typed_arr);
  ret.Set("numBuckets", spectrogram->spectrogram_result_num_buckets);
  ret.Set("numWindows", spectrogram->spectrogram_result_num_windows);

  return ret;
}

Napi::Function SpectrogramWrapper::GetClass(Napi::Env env) {
  Napi::Function func =
      DefineClass(env, "Spectrogram",
                  {SpectrogramWrapper::InstanceMethod(
                       "compute", &SpectrogramWrapper::Compute),
                   SpectrogramWrapper::InstanceMethod(
                       "getSpectrogram", &SpectrogramWrapper::GetSpectrogram)});

  // TODO: is this persistence stuff needed here
  // auto constructor = Napi::Persistent(func);
  // constructor.SuppressDestruct();

  return func;
}