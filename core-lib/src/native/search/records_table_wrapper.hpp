#ifndef SHABAM_CORE_LIB_RECORDS_TABLE_WRAPPER
#define SHABAM_CORE_LIB_RECORDS_TABLE_WRAPPER

#include "records_table.hpp"
#include <napi.h>

class RecordsTableWrapper : public Napi::ObjectWrap<RecordsTableWrapper> {
private:
  /**
   * Reference to the fingerprint data used.
  */
  fingerprint_data_t *fingerprint_data;

  /**
   * Records table instance tied to wrapper instance.
  */
  RecordsTable *records_table;

public:
  /**
   * Constructs a records table object.
   * Arguments:
   * - fingerprint: Fingerprint
   * - targetZoneSize: number
   */
  RecordsTableWrapper(const Napi::CallbackInfo &info);
  ~RecordsTableWrapper();
  static Napi::Function GetClass(Napi::Env env);

  void Compute(const Napi::CallbackInfo &info);
  Napi::Value GetRecordsTable(const Napi::CallbackInfo &info);
};

#endif