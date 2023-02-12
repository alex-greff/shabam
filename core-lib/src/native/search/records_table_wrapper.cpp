#include "records_table_wrapper.hpp"
#include "../fingerprint/fingerprint_wrapper.hpp"

RecordsTableWrapper::RecordsTableWrapper(const Napi::CallbackInfo &info)
    : ObjectWrap(info) {
  // Expected arguments:
  // - fingerprint: Fingerprint
  // - targetZoneSize: number

  Napi::Env env = info.Env();

  if (info.Length() != 2) {
    Napi::TypeError::New(env, "Wrong number of arguments.")
        .ThrowAsJavaScriptException();
    return;
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "targetZoneSize argument needs to be an integer.")
        .ThrowAsJavaScriptException();
    return;
  }

  Napi::Object fingerprint_obj = info[0].ToObject();
  FingerprintWrapper *fingerprint = FingerprintWrapper::Unwrap(fingerprint_obj);
  size_t target_zone_size = info[1].As<Napi::Number>().Int32Value();
  this->records_table =
      new RecordsTable(*fingerprint->fingerprint, target_zone_size);
}

RecordsTableWrapper::~RecordsTableWrapper() { delete this->records_table; }

void RecordsTableWrapper::Compute(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return;
  }

  this->records_table->Compute();
}

Napi::Value
RecordsTableWrapper::GetRecordsTable(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "No arguments expected.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  RecordsTable *records_table = this->records_table;
  record_t *records = records_table->records;
  size_t num_records = records_table->num_records;

  if (records_table == nullptr) {
    Napi::TypeError::New(env, "Records table has not been computed yet.")
        .ThrowAsJavaScriptException();
    return Napi::Value();
  }

  Napi::Array records_table_arr = Napi::Array::New(env, num_records);
  for (size_t i = 0; i < num_records; i++) {
    record_t *curr_record = &records[i];

    Napi::Object curr_obj = Napi::Object::New(env);
    curr_obj.Set("anchorFrequency", curr_record->anchor_frequency);
    curr_obj.Set("pointFrequency", curr_record->point_frequency);
    curr_obj.Set("delta", curr_record->delta);
    curr_obj.Set("anchorAbsoluteTime", curr_record->anchor_absolute_time);

    records_table_arr[i] = curr_obj;
  }

  return records_table_arr;
}

Napi::Function RecordsTableWrapper::GetClass(Napi::Env env) {
  Napi::Function func = DefineClass(
      env, "RecordsTable",
      {RecordsTableWrapper::InstanceMethod("compute",
                                           &RecordsTableWrapper::Compute),
       RecordsTableWrapper::InstanceMethod(
           "getRecordsTable", &RecordsTableWrapper::GetRecordsTable)});
  return func;
}