#ifndef SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE_WRAPPER_MIN_VIABLE_EXAMPLE
#define SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE_WRAPPER_MIN_VIABLE_EXAMPLE

#include <napi.h>
// #include "records_engine_wrapper_mve.hpp"

// class MemoryRecordsEngineWrapperMVE
//     : public RecordsEngineWrapperMVE<MemoryRecordsEngineWrapperMVE> {
class MemoryRecordsEngineWrapperMVE
    : public Napi::ObjectWrap<MemoryRecordsEngineWrapperMVE> {
public:
  MemoryRecordsEngineWrapperMVE(const Napi::CallbackInfo &info);
  virtual ~MemoryRecordsEngineWrapperMVE(){};

  virtual void StoreRecords(const Napi::CallbackInfo &info);
  virtual void SearchRecords(const Napi::CallbackInfo &info);
  virtual void ClearAllRecords(const Napi::CallbackInfo &info);

  static Napi::Function GetClass(Napi::Env);
};

void MemoryRecordsEngineMVEInheritanceDoNotDelete(Napi::Env env);

#endif