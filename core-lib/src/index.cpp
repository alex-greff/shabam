#include "native/fingerprint/fingerprint_wrapper.hpp"
#include "native/greeting.hpp"
#include "native/search/memory_records_engine_wrapper.hpp"
#include "native/search/records_engine_exports_setup.hpp"
#include "native/search/records_engine_wrapper.hpp"
#include "native/search/records_table_wrapper.hpp"
#include "native/spectrogram/spectrogram_wrapper.hpp"
#include "native/temp/cc_inheritance.hpp"
#include "native/temp/cc_inheritance_exports_setup.hpp"
#include <napi.h>
#include <string>

Napi::String greetHello(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  std::string result = helloUser("Bob");

  return Napi::String::New(env, result);
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("greetHello", Napi::Function::New(env, greetHello));

  exports.Set("Spectrogram", SpectrogramWrapper::GetClass(env));

  exports.Set("Fingerprint", FingerprintWrapper::GetClass(env));

  exports.Set("RecordsTable", RecordsTableWrapper::GetClass(env));

  SetupRecordsEngineExports(env, exports);

  SetupCCInheritance(env, exports);

  return exports;
}

NODE_API_MODULE(core_lib, Init);