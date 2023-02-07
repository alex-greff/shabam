#ifndef SHABAM_CORE_LIB_RECORDS_ENGINE
#define SHABAM_CORE_LIB_RECORDS_ENGINE

#include "records_table.hpp"
#include <tuple>

typedef struct RecordsSearchMatch {
  uint32_t track_id;
  float similarity;
} records_search_match_t;

class RecordsEngine {
protected:
  static uint64_t EncodeAddress(uint16_t anchor_frequency,
                                uint16_t point_frequency, uint32_t delta);
  static std::tuple<uint16_t, uint16_t, uint32_t>
  DecodeAddress(uint64_t address);

  static uint64_t EncodeCouple(uint32_t absolute_time, uint32_t track_id);
  static std::tuple<uint32_t, uint32_t> DecodeCouple(uint64_t couple);

public:
  RecordsEngine();
  ~RecordsEngine();

  // --- Records Result ---

  /**
   * Array of matches from the most recent search.
   */
  records_search_match_t *matches;

  /**
   * Number of elements in the matches array.
   */
  size_t matches_length;

  virtual void StoreRecords(record_t *records, size_t num_records,
                            uint32_t track_id);
  virtual void SearchRecords(record_t *clip_records, size_t num_clip_records);
  virtual void ClearRecords(uint32_t track_id);
};

#endif