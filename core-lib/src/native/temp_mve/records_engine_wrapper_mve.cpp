#include "records_engine_wrapper_mve.hpp"
#include <iostream>

using namespace std::string_literals;
using namespace Napi;

template <class T>
RecordsEngineWrapperMVE<T>::RecordsEngineWrapperMVE(
    const Napi::CallbackInfo &info)
    : ObjectWrap<T>(info) {
  // Do nothing
}

template <class T>
Napi::Function RecordsEngineWrapperMVE<T>::GetClass(Napi::Env env) {
  return RecordsEngineWrapperMVE::DefineClass(
      env, "RecordsEngineMVE",
      {
          RecordsEngineWrapperMVE::InstanceMethod(
              "storeRecords", &RecordsEngineWrapperMVE::StoreRecords),
          RecordsEngineWrapperMVE::InstanceMethod(
              "searchRecords", &RecordsEngineWrapperMVE::SearchRecords),
          RecordsEngineWrapperMVE::InstanceMethod(
              "clearAllRecords", &RecordsEngineWrapperMVE::ClearAllRecords),
      });
}

template <class T>
void RecordsEngineWrapperMVE<T>::StoreRecords(const Napi::CallbackInfo &info) {
  std::cout << "RecordsEngineWrapperMVE: StoreRecords" << std::endl;
}

template <class T>
void RecordsEngineWrapperMVE<T>::SearchRecords(const Napi::CallbackInfo &info) {
  std::cout << "RecordsEngineWrapperMVE: SearchRecords" << std::endl;
}

template <class T>
void RecordsEngineWrapperMVE<T>::ClearAllRecords(
    const Napi::CallbackInfo &info) {
  std::cout << "RecordsEngineWrapperMVE: ClearAllRecords" << std::endl;
}

// // TODO: remove
// MemoryRecordsEngineWrapperMVE::MemoryRecordsEngineWrapperMVE(
//     const Napi::CallbackInfo &info)
//     : RecordsEngineWrapperMVE(info) {
//   // Do nothing
// }

// Napi::Function MemoryRecordsEngineWrapperMVE::GetClass(Napi::Env env) {
//   return ObjectWrap<MemoryRecordsEngineWrapperMVE>::DefineClass(
//       env, "MemoryRecordsEngineMVE",
//       {
//           ObjectWrap<MemoryRecordsEngineWrapperMVE>::InstanceMethod(
//               "storeRecords", &MemoryRecordsEngineWrapperMVE::StoreRecords),
//           ObjectWrap<MemoryRecordsEngineWrapperMVE>::InstanceMethod(
//               "searchRecords", &MemoryRecordsEngineWrapperMVE::SearchRecords),
//           ObjectWrap<MemoryRecordsEngineWrapperMVE>::InstanceMethod(
//               "clearAllRecords",
//               &MemoryRecordsEngineWrapperMVE::ClearAllRecords),
//       });
// }

// void MemoryRecordsEngineWrapperMVE::StoreRecords(
//     const Napi::CallbackInfo &info) {
//   std::cout << "MemoryRecordsEngineWrapperMVE: StoreRecords" << std::endl;
// }

// void MemoryRecordsEngineWrapperMVE::SearchRecords(
//     const Napi::CallbackInfo &info) {
//   std::cout << "MemoryRecordsEngineWrapperMVE: SearchRecords" << std::endl;
// }

// void MemoryRecordsEngineWrapperMVE::ClearAllRecords(
//     const Napi::CallbackInfo &info) {
//   std::cout << "MemoryRecordsEngineWrapperMVE: ClearAllRecords" << std::endl;
// }

// NOTE: do NOT delete this function even if your life depends on it.
// Deleting this function will cause the build to break. My best guess is that
// using these classes here stops the compiler from removing the symbols for
// these classes... even though they're used elsewhere in the library.
void RecordsEngineMVEInheritanceDoNotDelete(Napi::Env env) {
  RecordsEngineWrapperMVEInstance::GetClass(env);
  // TODO: remove
  // MemoryRecordsEngineWrapperMVE::GetClass(env);
}