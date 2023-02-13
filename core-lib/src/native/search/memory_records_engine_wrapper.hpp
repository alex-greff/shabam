#ifndef SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE_WRAPPER
#define SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE_WRAPPER

#include "memory_records_engine.hpp"
#include <napi.h>

class MemoryRecordsEngineWrapper : public Napi::ObjectWrap<MemoryRecordsEngineWrapper> {
protected:
  MemoryRecordsEngine *records_engine;
public:
  MemoryRecordsEngineWrapper(const Napi::CallbackInfo &info);
  virtual ~MemoryRecordsEngineWrapper() {
    delete this->records_engine;
  };

  static Napi::Function GetClass(Napi::Env env);

  virtual void StoreRecords(const Napi::CallbackInfo &info);
  virtual void SearchRecords(const Napi::CallbackInfo &info);
  virtual void ClearAllRecords(const Napi::CallbackInfo &info);
};

#endif