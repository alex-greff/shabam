#include "memory_records_engine.hpp"

MemoryRecordsEngine::MemoryRecordsEngine() : RecordsEngine::RecordsEngine();

MemoryRecordsEngine::~MemoryRecordsEngine() : RecordsEngine::~RecordsEngine();

void MemoryRecordsEngine::StoreRecords(record_t *records, size_t num_records,
                                       uint32_t track_id) {
  std::unordered_map<uint64_t, std::vector<uint64_t>> &data_table =
      this->data_table;

  std::unordered_map<uint32_t, std::vector<std::tuple<uint64_t, uint64_t>>>
      &track_id_to_data_table_entries = this->track_id_to_data_table_entries;

  for (size_t record_idx = 0; record_idx < num_records; record_idx++) {
    record_t *curr_record = &records[record_idx];

    uint64_t address_encoded = RecordsEngine::EncodeAddress(
        curr_record->anchor_frequency, curr_record->point_frequency,
        curr_record->delta);
    uint64_t couple_encoded = RecordsEngine::EncodeCouple(
        curr_record->anchor_absolute_time, track_id);

    // Entry already exists
    if (data_table.find(address_encoded) != data_table.end()) {
      std::vector<uint64_t> &couples = data_table[address_encoded];
      couples.push_back(couple_encoded);
    }
    // Entry does not exist
    else {
      std::vector<uint64_t> couples = {couple_encoded};
      data_table[address_encoded] = couples;
    }

    if (track_id_to_data_table_entries.find(track_id) !=
        track_id_to_data_table_entries.end()) {
      std::vector<std::tuple<uint64_t, uint64_t>> &data_table_entries =
          track_id_to_data_table_entries[track_id];
      data_table_entries.push_back(
          std::make_tuple(address_encoded, couple_encoded));
    } else {
      std::vector<std::tuple<uint64_t, uint64_t>> data_table_entries = {
          std::make_tuple(address_encoded, couple_encoded)};
      track_id_to_data_table_entries[track_id] = data_table_entries;
    }
  }
}

void MemoryRecordsEngine::SearchRecords(record_t *clip_records,
                                        size_t num_clip_records) {
  // TODO: implement
}

void MemoryRecordsEngine::ClearRecords(uint32_t track_id) {
  this->data_table.clear();
  this->track_id_to_data_table_entries.clear();
}