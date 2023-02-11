#ifndef SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE
#define SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE

#include "records_engine_wrapper.hpp"
#include <napi.h>

class MemoryRecordsEngineWrapper
    : public RecordsEngineWrapper<MemoryRecordsEngineWrapper> {
public:
  MemoryRecordsEngineWrapper(const Napi::CallbackInfo &info);
  virtual ~MemoryRecordsEngineWrapper(){};

  static Napi::Function GetClass(Napi::Env env);

  virtual void StoreRecords(const Napi::CallbackInfo &info);
  virtual void SearchRecords(const Napi::CallbackInfo &info);
  virtual void ClearAllRecords(const Napi::CallbackInfo &info);
};

#endif