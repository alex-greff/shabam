#include "spectrogram.hpp"
#include <math.h>

using namespace Napi;

Spectrogram::Spectrogram(const Napi::CallbackInfo &info) : ObjectWrap(info) {
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
    Napi::TypeError::New(env, "sample_rate argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[2].IsNumber()) {
    Napi::TypeError::New(env, "FFT_size argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[3].IsNumber()) {
    Napi::TypeError::New(env, "window_duration argument needs to be a float.")
        .ThrowAsJavaScriptException();
    return;
  }

  auto audio_samples_typed_arr = info[0].As<Napi::TypedArrayOf<double>>();
  size_t num_audio_samples = audio_samples_typed_arr.ElementLength();
  this->audio_samples = new float[num_audio_samples];
  memcpy(this->audio_samples, audio_samples_typed_arr.Data(),
         num_audio_samples * sizeof(float));
  this->num_audio_samples = num_audio_samples;

  this->audio_samples_complex = new liquid_float_complex[num_audio_samples];
  for (size_t i = 0; i < num_audio_samples; i++) {
    this->audio_samples_complex[i].real = this->audio_samples[i];
    this->audio_samples_complex[i].imag = 0;
  }

  this->spectrogram_samples = nullptr;
  this->sample_rate = info[1].As<Napi::Number>();
  this->FFT_size = info[2].As<Napi::Number>();
  this->window_duration = info[3].As<Napi::Number>();
}

Spectrogram::~Spectrogram() {
  delete this->audio_samples;
  delete this->audio_samples_complex;
  if (this->spectrogram_samples != nullptr)
    delete this->spectrogram_samples;
}

// TODO: remove?
// void Spectrogram::ComputeFFTData(double *freq_data, int curr_window) {
//   // TODO: implement
// }

void Spectrogram::ComputeSpectrogram(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return;
  }

  double duration = (double)this->num_audio_samples / (double)this->sample_rate;

  int num_windows = floor(duration / this->window_duration);
  this->num_windows = num_windows;
  int freq_bin_size = floor(this->FFT_size / 2);
  this->freq_bin_size = freq_bin_size;

  liquid_float_complex *spectrogram_samples_complex =
      new liquid_float_complex[num_windows * freq_bin_size];

  for (int curr_window = 0; curr_window < num_windows; curr_window++) {
    // double *freq_data = new double[freq_bin_size];

    // this->ComputeFFTData(freq_data, curr_window);

    // memcpy(&spectrogram_samples[curr_window * freq_bin_size], freq_data,
    //        freq_bin_size * sizeof(double));

    // delete freq_data;

    // double *freq_data = new double[freq_bin_size];

    // liquid_float_complex *x = new liquid_float_complex[freq_bin_size];
    // liquid_float_complex *y = new liquid_float_complex[freq_bin_size];

    size_t audio_samples_start_idx =
        floor(this->sample_rate * this->window_duration * curr_window);

    int flags = 0;
    // fftplan plan =
    //     fft_create_plan(freq_bin_size, freq_data,
    //                     &spectrogram_samples[curr_window * freq_bin_size],
    //                     LIQUID_FFT_FORWARD, flags);
    // TODO: is this->FFT_size * this->sample_rate the right size?
    fftplan plan = fft_create_plan(
        this->FFT_size, &audio_samples_complex[audio_samples_start_idx],
        &spectrogram_samples_complex[curr_window * freq_bin_size],
        LIQUID_FFT_FORWARD, flags);

    fft_execute(plan);
    fft_destroy_plan(plan);
  }

  // Allocate space for the spectrogram samples and copy over
  // audio_samples_complex to spectrogram_samples
  if (this->spectrogram_samples != nullptr)
    delete this->spectrogram_samples;
  float *spectrogram_samples = new float[num_windows * freq_bin_size];
  this->spectrogram_samples = spectrogram_samples;
  for (int i = 0; i < num_windows * freq_bin_size; i++) {
    spectrogram_samples[i] = spectrogram_samples_complex[i].real;
  }
}

Napi::Function Spectrogram::GetClass(Napi::Env env) {
  return DefineClass(
      env, "Spectrogram",
      {
          Spectrogram::InstanceMethod("computeSpectrogram",
                                      &Spectrogram::ComputeSpectrogram),
      });
}