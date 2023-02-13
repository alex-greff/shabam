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
  virtual ~MemoryRecordsEngineWrapper() {
    delete this->records_engine;
  }

  static Napi::Function GetClass(Napi::Env env);

  void StoreRecords(const Napi::CallbackInfo &info);
  void SearchRecords(const Napi::CallbackInfo &info);
  void ClearAllRecords(const Napi::CallbackInfo &info);
};

#endif