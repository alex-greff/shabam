#include "native/fingerprint/fingerprint_wrapper.hpp"
#include "native/greeting.hpp"
#include "native/search/records_table_wrapper.hpp"
#include "native/spectrogram/spectrogram_wrapper.hpp"
#include <napi.h>
#include <string>

Napi::String greetHello(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  std::string result = helloUser("Bob");

  return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "greetHello"),
              Napi::Function::New(env, greetHello));

  exports.Set(Napi::String::New(env, "Spectrogram"),
              SpectrogramWrapper::GetClass(env));

  exports.Set(Napi::String::New(env, "Fingerprint"),
              FingerprintWrapper::GetClass(env));

  exports.Set(Napi::String::New(env, "RecordsTable"),
              RecordsTableWrapper::GetClass(env));

  return exports;
}

NODE_API_MODULE(core_lib, Init);