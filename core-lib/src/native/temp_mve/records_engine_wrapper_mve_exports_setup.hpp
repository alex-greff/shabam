#include "memory_records_engine_wrapper_mve.hpp"
#include "records_engine_wrapper_mve.hpp"
#include <napi.h>

Napi::Value SetupRecordsEngineMVEExports(Napi::Env env, Napi::Object exports) {
  Napi::Function ClassBase = RecordsEngineWrapperMVEInstance::GetClass(env);
  Napi::Function ClassExtended = MemoryRecordsEngineWrapperMVE::GetClass(env);
  exports.Set("RecordsEngineMVE", ClassBase);
  exports.Set("MemoryRecordsEngineMVE", ClassExtended);
  Napi::Function setProto = env.Global()
                                .Get("Object")
                                .ToObject()
                                .Get("setPrototypeOf")
                                .As<Napi::Function>();
  setProto.Call({ClassExtended, ClassBase});
  setProto.Call({ClassExtended.Get("prototype"), ClassBase.Get("prototype")});
  return exports;
}