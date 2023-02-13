#ifndef SHABAM_RECORDS_ENGINE_WRAPPER_EXPORTS_SETUP
#define SHABAM_RECORDS_ENGINE_WRAPPER_EXPORTS_SETUP

#include "memory_records_engine_wrapper.hpp"
#include "records_engine_wrapper.hpp"
#include <napi.h>

inline Napi::Value SetupRecordsEngineWrapperExports(Napi::Env env,
                                             Napi::Object exports) {
  Napi::Function RecordsEngineWrapperBaseClass =
      RecordsEngineWrapper::GetClass(env);
  Napi::Function MemoryRecordsEngineWrapperClass =
      MemoryRecordsEngineWrapper::GetClass(env);

  exports.Set("RecordsEngine", RecordsEngineWrapperBaseClass);
  exports.Set("MemoryRecordsEngine", MemoryRecordsEngineWrapperClass);

  // Setup JS inheritance
  Napi::Function setProto = env.Global()
                                .Get("Object")
                                .ToObject()
                                .Get("setPrototypeOf")
                                .As<Napi::Function>();
  setProto.Call(
      {MemoryRecordsEngineWrapperClass, RecordsEngineWrapperBaseClass});
  setProto.Call({MemoryRecordsEngineWrapperClass.Get("prototype"),
                 RecordsEngineWrapperBaseClass.Get("prototype")});

  return exports;
}

#endif