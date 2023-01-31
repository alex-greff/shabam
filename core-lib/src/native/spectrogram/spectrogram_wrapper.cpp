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
  // TODO: remove
  // this->spectrogram = new Spectrogram(samples, samples_length, window_size,
  //                                     hop_size, FFT_size, nullptr);

  // TODO: remove
  // this->spectrogram_samples = nullptr;
  // this->sample_rate = info[1].As<Napi::Number>();
  // this->FFT_size = info[2].As<Napi::Number>();
  // this->window_duration = info[3].As<Napi::Number>();

  // auto audio_samples_typed_arr = info[0].As<Napi::TypedArrayOf<double>>();
  // size_t num_audio_samples = audio_samples_typed_arr.ElementLength();
  // this->audio_samples = new float[num_audio_samples];
  // memcpy(this->audio_samples, audio_samples_typed_arr.Data(),
  //        num_audio_samples * sizeof(float));
  // this->num_audio_samples = num_audio_samples;

  // this->audio_samples_complex = new liquid_float_complex[num_audio_samples];
  // for (size_t i = 0; i < num_audio_samples; i++) {
  //   this->audio_samples_complex[i].real = this->audio_samples[i];
  //   this->audio_samples_complex[i].imag = 0;
  // }

  // this->spectrogram_samples = nullptr;
  // this->sample_rate = info[1].As<Napi::Number>();
  // this->FFT_size = info[2].As<Napi::Number>();
  // this->window_duration = info[3].As<Napi::Number>();
}

SpectrogramWrapper::~SpectrogramWrapper() {
  delete this->samples;
  delete this->spectrogram;

  // delete this->audio_samples;
  // delete this->audio_samples_complex;
  // if (this->spectrogram_samples != nullptr)
  //   delete this->spectrogram_samples;
}

// TODO: remove?
// void Spectrogram::ComputeFFTData(double *freq_data, int curr_window) {
//   // TODO: implement
// }

void SpectrogramWrapper::Compute(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return;
  }

  this->spectrogram->Compute();

  // TODO: remove
  // double duration = (double)this->num_audio_samples /
  // (double)this->sample_rate;

  // int num_windows = floor(duration / this->window_duration);
  // this->num_windows = num_windows;
  // int freq_bin_size = floor(this->FFT_size / 2);
  // this->freq_bin_size = freq_bin_size;

  // // blackmanharris();

  // liquid_float_complex *spectrogram_samples_complex =
  //     new liquid_float_complex[num_windows * freq_bin_size];

  // for (int curr_window = 0; curr_window < num_windows; curr_window++) {
  //   // double *freq_data = new double[freq_bin_size];

  //   // this->ComputeFFTData(freq_data, curr_window);

  //   // memcpy(&spectrogram_samples[curr_window * freq_bin_size], freq_data,
  //   //        freq_bin_size * sizeof(double));

  //   // delete freq_data;

  //   // double *freq_data = new double[freq_bin_size];

  //   // liquid_float_complex *x = new liquid_float_complex[freq_bin_size];
  //   // liquid_float_complex *y = new liquid_float_complex[freq_bin_size];

  //   size_t audio_samples_start_idx =
  //       floor(this->sample_rate * this->window_duration * curr_window);

  //   int flags = 0;
  //   // fftplan plan =
  //   //     fft_create_plan(freq_bin_size, freq_data,
  //   //                     &spectrogram_samples[curr_window * freq_bin_size],
  //   //                     LIQUID_FFT_FORWARD, flags);
  //   // TODO: is this->FFT_size * this->sample_rate the right size?
  //   fftplan plan = fft_create_plan(
  //       this->FFT_size, &audio_samples_complex[audio_samples_start_idx],
  //       &spectrogram_samples_complex[curr_window * freq_bin_size],
  //       LIQUID_FFT_FORWARD, flags);

  //   fft_execute(plan);
  //   fft_destroy_plan(plan);
  // }

  // // Allocate space for the spectrogram samples and copy over
  // // audio_samples_complex to spectrogram_samples
  // if (this->spectrogram_samples != nullptr)
  //   delete this->spectrogram_samples;
  // float *spectrogram_samples = new float[num_windows * freq_bin_size];
  // this->spectrogram_samples = spectrogram_samples;
  // for (int i = 0; i < num_windows * freq_bin_size; i++) {
  //   spectrogram_samples[i] = spectrogram_samples_complex[i].real;
  // }
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

  // auto constructor = Napi::Persistent(func);
  // constructor.SuppressDestruct();

  return func;
}