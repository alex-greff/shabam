#include "memory_records_engine_wrapper.hpp"

MemoryRecordsEngineWrapper::MemoryRecordsEngineWrapper(
    const Napi::CallbackInfo &info)
    : RecordsEngineWrapper(info) {
  // TODO: implement
}

void MemoryRecordsEngineWrapper::StoreRecords(const Napi::CallbackInfo &info) {
  // TODO: implement
}

void MemoryRecordsEngineWrapper::SearchRecords(const Napi::CallbackInfo &info) {
  // TODO: implement
}

void MemoryRecordsEngineWrapper::ClearAllRecords(
    const Napi::CallbackInfo &info) {
  // TODO: implement
}

Napi::Function MemoryRecordsEngineWrapper::GetClass(Napi::Env env) {
  return Napi::ObjectWrap<MemoryRecordsEngineWrapper>::DefineClass(
      env, "MemoryRecordsEngine",
      {
          Napi::ObjectWrap<MemoryRecordsEngineWrapper>::InstanceMethod(
              "storeRecords", &MemoryRecordsEngineWrapper::StoreRecords),
          Napi::ObjectWrap<MemoryRecordsEngineWrapper>::InstanceMethod(
              "searchRecords", &MemoryRecordsEngineWrapper::SearchRecords),
          Napi::ObjectWrap<MemoryRecordsEngineWrapper>::InstanceMethod(
              "clearAllRecords", &MemoryRecordsEngineWrapper::ClearAllRecords),
      });
}

// NOTE: do NOT delete this function even if your life depends on it. 
// Deleting this function will cause the build to break. My best guess is that
// using these classes here stops the compiler from removing the symbols for
// these classes... even though they're used elsewhere in the library.
void MemoryRecordsEngineWrapperDoNotDelete(Napi::Env env) {
  MemoryRecordsEngineWrapper::GetClass(env);
}