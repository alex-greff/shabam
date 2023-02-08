#ifndef SHABAM_CORE_LIB_RECORDS_ENGINE_WRAPPER
#define SHABAM_CORE_LIB_RECORDS_ENGINE_WRAPPER

#include "records_engine.hpp"
#include <napi.h>

class RecordsEngineWrapper : public Napi::ObjectWrap<RecordsEngineWrapper> {
private:
  /**
   * Records engine instance tried to wrapper instance.
   */
  RecordsEngine *records_engine;

public:
  static Napi::Value EncodeAddress(const Napi::CallbackInfo &info);
  static Napi::Value DecodeAddress(const Napi::CallbackInfo &info);

  static Napi::Value EncodeCouple(const Napi::CallbackInfo &info);
  static Napi::Value DecodeCouple(const Napi::CallbackInfo &info);

  virtual void StoreRecords(const Napi::CallbackInfo &info);
  virtual void SearchRecords(const Napi::CallbackInfo &info);
  virtual void ClearAllRecords(const Napi::CallbackInfo &info);
};

#endif