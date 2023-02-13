#include "memory_records_engine_wrapper_mve.hpp"
#include <iostream>

// MemoryRecordsEngineWrapperMVE::MemoryRecordsEngineWrapperMVE(
//     const Napi::CallbackInfo &info)
//     : RecordsEngineWrapperMVE(info) {
//   // Do nothing
// }

MemoryRecordsEngineWrapperMVE::MemoryRecordsEngineWrapperMVE(
    const Napi::CallbackInfo &info)
    : ObjectWrap(info) {
  // Do nothing
}

Napi::Function MemoryRecordsEngineWrapperMVE::GetClass(Napi::Env env) {
  return ObjectWrap<MemoryRecordsEngineWrapperMVE>::DefineClass(
      env, "MemoryRecordsEngineMVE",
      {
          ObjectWrap<MemoryRecordsEngineWrapperMVE>::InstanceMethod(
              "storeRecords", &MemoryRecordsEngineWrapperMVE::StoreRecords),
          ObjectWrap<MemoryRecordsEngineWrapperMVE>::InstanceMethod(
              "searchRecords", &MemoryRecordsEngineWrapperMVE::SearchRecords),
          ObjectWrap<MemoryRecordsEngineWrapperMVE>::InstanceMethod(
              "clearAllRecords",
              &MemoryRecordsEngineWrapperMVE::ClearAllRecords),
      });
}

void MemoryRecordsEngineWrapperMVE::StoreRecords(
    const Napi::CallbackInfo &info) {
  std::cout << "MemoryRecordsEngineWrapperMVE: StoreRecords" << std::endl;
}

void MemoryRecordsEngineWrapperMVE::SearchRecords(
    const Napi::CallbackInfo &info) {
  std::cout << "MemoryRecordsEngineWrapperMVE: SearchRecords" << std::endl;
}

void MemoryRecordsEngineWrapperMVE::ClearAllRecords(
    const Napi::CallbackInfo &info) {
  std::cout << "MemoryRecordsEngineWrapperMVE: ClearAllRecords" << std::endl;
}

// NOTE: do NOT delete this function even if your life depends on it.
// Deleting this function will cause the build to break. My best guess is that
// using these classes here stops the compiler from removing the symbols for
// these classes... even though they're used elsewhere in the library.
void MemoryRecordsEngineMVEInheritanceDoNotDelete(Napi::Env env) {
  // RecordsEngineWrapperMVEInstance::GetClass(env);
  // MemoryRecordsEngineWrapperMVE::GetClass(env);
}