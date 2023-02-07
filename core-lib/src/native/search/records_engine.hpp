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
  /**
   * The number of points in a target zone.
   */
  size_t target_zone_size;

  /**
   * Dictates how picky the selection cutoff is when comparing the total hit
   * numbers of potential tracks.
   * 0 = every potential track is selected
   * 1 = only clips who have all their target zones match
   * Range: [0, 1]
   */
  float search_selection_coefficient;

  static uint64_t EncodeAddress(uint16_t anchor_frequency,
                                uint16_t point_frequency, uint32_t delta);
  static std::tuple<uint16_t, uint16_t, uint32_t>
  DecodeAddress(uint64_t address);

  static uint64_t EncodeCouple(uint32_t absolute_time, uint32_t track_id);
  static std::tuple<uint32_t, uint32_t> DecodeCouple(uint64_t couple);

public:
  RecordsEngine(size_t target_zone_size, float search_selection_coefficient);
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

  virtual void StoreRecords(RecordsTable &records_table, uint32_t track_id);
  virtual void SearchRecords(RecordsTable &clip_records_table);
  virtual void ClearRecords(uint32_t track_id);
};

#endif