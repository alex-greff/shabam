#ifndef SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE
#define SHABAM_CORE_LIB_MEMORY_RECORDS_ENGINE

#include "./records_engine.hpp"
#include <tuple>
#include <unordered_map>
#include <vector>

class MemoryRecordsEngine : RecordsEngine {
private:
  // Maps addresses to matching couples
  std::unordered_map<uint64_t, std::vector<uint64_t>> data_table;

  // Maps track IDs to all the (address, couple) tuples that exist for it
  std::unordered_map<uint32_t, std::vector<std::tuple<uint64_t, uint64_t>>>
      track_id_to_data_table_entries;

public:
  MemoryRecordsEngine(size_t target_zone_size,
                      float search_selection_coefficient);
  ~MemoryRecordsEngine();

  void StoreRecords(RecordsTable &records_table, uint32_t track_id);
  void SearchRecords(RecordsTable &clip_records_table);
  void ClearRecords(uint32_t track_id);
};

#endif