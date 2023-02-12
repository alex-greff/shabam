#include "memory_records_engine_wrapper.hpp"
#include "records_table_wrapper.hpp"

MemoryRecordsEngineWrapper::MemoryRecordsEngineWrapper(
    const Napi::CallbackInfo &info)
    : RecordsEngineWrapper(info) {
  // Input parameters:
  // - targetZoneSize: number (int)
  // - searchSelectionCoefficient: number (float)

  Napi::Env env = info.Env();

  if (info.Length() != 2) {
    Napi::TypeError::New(env, "Wrong number of arguments.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env, "targetZoneSize argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(
        env, "searchSelectionCoefficient argument needs to be a float.")
        .ThrowAsJavaScriptException();
    return;
  }

  int target_zone_size = info[0].As<Napi::Number>().Int32Value();
  float search_selection_coefficient = info[1].As<Napi::Number>().FloatValue();

  this->records_engine =
      new MemoryRecordsEngine(target_zone_size, search_selection_coefficient);
}

MemoryRecordsEngineWrapper::~MemoryRecordsEngineWrapper() {
  delete this->records_engine;
}

void MemoryRecordsEngineWrapper::StoreRecords(const Napi::CallbackInfo &info) {
  // Input parameters:
  // - recordsTable: RecordsTable
  // - trackId: number (int)

  Napi::Env env = info.Env();

  if (info.Length() != 2) {
    Napi::TypeError::New(env, "Wrong number of arguments.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "trackId argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  Napi::Object records_table_obj = info[0].ToObject();
  RecordsTableWrapper *records_table =
      RecordsTableWrapper::Unwrap(records_table_obj);

  int track_id = info[1].As<Napi::Number>().Int32Value();

  this->records_engine->StoreRecords(*records_table->records_table, track_id);
}

void MemoryRecordsEngineWrapper::SearchRecords(const Napi::CallbackInfo &info) {
  // Input parameters:
  // - clipRecordsTable: RecordsTable

  Napi::Env env = info.Env();

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "Wrong number of arguments.")
        .ThrowAsJavaScriptException();
    return;
  }

  Napi::Object clip_records_table_obj = info[0].ToObject();
  RecordsTableWrapper *clip_records_table =
      RecordsTableWrapper::Unwrap(clip_records_table_obj);

  this->records_engine->SearchRecords(*clip_records_table->records_table);
}

void MemoryRecordsEngineWrapper::ClearAllRecords(
    const Napi::CallbackInfo &info) {
  // Input parameters: (none)

  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return;
  }

  this->records_engine->ClearAllRecords();
}

Napi::Function MemoryRecordsEngineWrapper::GetClass(Napi::Env env) {
  return Napi::ObjectWrap<MemoryRecordsEngineWrapper>::DefineClass(
      env, "MemoryRecordsEngine",
      {
          Napi::ObjectWrap<MemoryRecordsEngineWrapper>::InstanceMethod(
              "storeRecords", &MemoryRecordsEngineWrapper::StoreRecords),
          Napi::ObjectWrap<MemoryRecordsEngineWrapper>::InstanceMethod(
              "searchRecords", &MemoryRecordsEngineWrapper::SearchRecords),
          Napi::ObjectWrap<MemoryRecordsEngineWrapper>::InstanceMethod(
              "clearAllRecords", &MemoryRecordsEngineWrapper::ClearAllRecords),
      });
}

// NOTE: do NOT delete this function even if your life depends on it.
// Deleting this function will cause the build to break. My best guess is that
// using these classes here stops the compiler from removing the symbols for
// these classes... even though they're used elsewhere in the library.
void MemoryRecordsEngineWrapperDoNotDelete(Napi::Env env) {
  MemoryRecordsEngineWrapper::GetClass(env);
}