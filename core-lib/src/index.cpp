#include <napi.h>
#include <string>
#include "native/greeting.hpp"
#include "native/spectrogram/spectrogram.hpp"

Napi::String greetHello(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  std::string result = helloUser("Bob");

  return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
    Napi::String::New(env, "greetHello"),
    Napi::Function::New(env, greetHello)
  );

  exports.Set(
    Napi::String::New(env, "Spectrogram"),
    Spectrogram::GetClass(env)
  );

  return exports;
}

NODE_API_MODULE(core_lib, Init);