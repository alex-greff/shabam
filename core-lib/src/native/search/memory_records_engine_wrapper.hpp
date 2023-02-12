#ifndef SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE_WRAPPER
#define SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE_WRAPPER

#include "records_engine_wrapper.hpp"
#include "memory_records_engine.hpp"
#include <napi.h>

class MemoryRecordsEngineWrapper
    : public RecordsEngineWrapper<MemoryRecordsEngineWrapper> {
protected:
  MemoryRecordsEngine *records_engine;
public:
  MemoryRecordsEngineWrapper(const Napi::CallbackInfo &info);
  virtual ~MemoryRecordsEngineWrapper();

  static Napi::Function GetClass(Napi::Env env);

  virtual void StoreRecords(const Napi::CallbackInfo &info);
  virtual void SearchRecords(const Napi::CallbackInfo &info);
  virtual void ClearAllRecords(const Napi::CallbackInfo &info);
};

#endif