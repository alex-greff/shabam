#ifndef SHABAM_CORE_LIB_RECORDS_ENGINE_WRAPPER_MIN_VIABLE_EXAMPLE
#define SHABAM_CORE_LIB_RECORDS_ENGINE_WRAPPER_MIN_VIABLE_EXAMPLE

#include <napi.h>

template <class T> class RecordsEngineWrapperMVE : public Napi::ObjectWrap<T> {
public:
  RecordsEngineWrapperMVE(const Napi::CallbackInfo &info);
  virtual ~RecordsEngineWrapperMVE(){};

  virtual void StoreRecords(const Napi::CallbackInfo &info);
  virtual void SearchRecords(const Napi::CallbackInfo &info);
  virtual void ClearAllRecords(const Napi::CallbackInfo &info);

  static Napi::Function GetClass(Napi::Env);
};

class RecordsEngineWrapperMVEInstance
    : public RecordsEngineWrapperMVE<RecordsEngineWrapperMVEInstance> {
public:
  using RecordsEngineWrapperMVE::RecordsEngineWrapperMVE;
  virtual ~RecordsEngineWrapperMVEInstance(){};
};

// TODO: remove
// class MemoryRecordsEngineWrapperMVE
//     : public RecordsEngineWrapperMVE<MemoryRecordsEngineWrapperMVE> {
// public:
//   MemoryRecordsEngineWrapperMVE(const Napi::CallbackInfo &info);
//   virtual ~MemoryRecordsEngineWrapperMVE(){};

//   virtual void StoreRecords(const Napi::CallbackInfo &info);
//   virtual void SearchRecords(const Napi::CallbackInfo &info);
//   virtual void ClearAllRecords(const Napi::CallbackInfo &info);

//   static Napi::Function GetClass(Napi::Env);
// };

void RecordsEngineMVEInheritanceDoNotDelete(Napi::Env env);

#endif