#include "memory_records_engine.hpp"

#include <stdexcept>
#include <unordered_map>
#include <unordered_set>

MemoryRecordsEngine::MemoryRecordsEngine(size_t target_zone_size,
                                         float search_selection_coefficient)
    : RecordsEngine::RecordsEngine(target_zone_size,
                                   search_selection_coefficient) {
  this->matches = nullptr;
  this->matches_length = 0;
}

MemoryRecordsEngine::~MemoryRecordsEngine() {
  // Do nothing
}

void MemoryRecordsEngine::StoreRecords(RecordsTable &records_table,
                                       uint32_t track_id) {
  record_t *records = records_table.records;
  if (records == nullptr) {
    throw std::invalid_argument("Records table must already be computed.");
  }
  size_t num_records = records_table.num_records;

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

void MemoryRecordsEngine::SearchRecords(RecordsTable &clip_records_table) {
  record_t *clip_records = clip_records_table.records;
  if (clip_records == nullptr) {
    throw std::invalid_argument("Clip records table must already be computed.");
  }
  size_t num_clip_records = clip_records_table.num_records;

  // ------------------------------
  // --- Hits Compilation Phase ---
  // ------------------------------

  std::unordered_map<uint64_t, std::vector<uint64_t>> &data_table =
      this->data_table;
  // TODO: remove
  // std::unordered_map<uint32_t, std::vector<std::tuple<uint64_t, uint64_t>>>
  //     &track_id_to_data_table_entries = this->track_id_to_data_table_entries;

  // A map that counts the number of times a couple appears in the clip table
  std::unordered_map<uint64_t, uint32_t> couple_to_hit_counts;

  // For each record in the clip table, lookup its address in the data table
  // and accumulate its results in the `couple_to_hit_counts` map
  for (size_t clip_record_idx = 0; clip_record_idx < num_clip_records;
       clip_record_idx++) {
    record_t *curr_clip_record = &clip_records[clip_record_idx];

    uint64_t clip_address_encoded = RecordsEngine::EncodeAddress(
        curr_clip_record->anchor_frequency, curr_clip_record->point_frequency,
        curr_clip_record->delta);

    // Lookup all couples that match the current clip address
    auto data_table_entry = data_table.find(clip_address_encoded);

    if (data_table_entry != data_table.end()) {
      std::vector<uint64_t> entry_couples = data_table_entry->second;
      for (uint64_t curr_couple_encoded : entry_couples) {
        auto couple_hit_count_entry =
            couple_to_hit_counts.find(curr_couple_encoded);
        uint32_t couple_hit_count =
            couple_hit_count_entry != couple_to_hit_counts.end()
                ? couple_hit_count_entry->second
                : 0;
        couple_to_hit_counts[curr_couple_encoded] = couple_hit_count + 1;
      }
    }
  }

  // -----------------------
  // --- Filtering Phase ---
  // -----------------------

  size_t target_zone_size = this->target_zone_size;

  // Now that we have the couples occurrence count map we can start
  // filtering tracks

  // Tracks the track IDs to the total number of hits that they had in the
  // `couple_to_hit_counts` map
  // Note: TZ = target zone
  std::unordered_map<uint32_t, uint32_t> track_id_to_total_tz_hits;

  // Tracks all couples that had a full target zone worth of hits
  std::unordered_set<uint64_t> couples_with_tz_hit;

  // Populate `track_id_to_total_tz_hits` from `couple_to_hit_counts` and
  // filter out any couples that do not form a target zone
  for (auto couple_to_hit_entry : couple_to_hit_counts) {
    uint64_t couple_encoded = couple_to_hit_entry.first;
    uint32_t num_hits = couple_to_hit_entry.second;

    // Ignore couples that appear less than `target_zone_times` times
    // (i.e. a full target zone was not matched for this anchor)
    // (i.e. all points that don't form a target zone)
    // TODO: the article used 4 but I used 5 here, I should double check
    // again to see if this is right and he made a typo
    if (num_hits < target_zone_size)
      continue;

    couples_with_tz_hit.insert(couple_encoded);

    uint32_t absolute_time;
    uint32_t track_id;
    std::tie(absolute_time, track_id) =
        RecordsEngine::DecodeCouple(couple_encoded);

    auto track_id_to_tz_hits_entry = track_id_to_total_tz_hits.find(track_id);
    uint32_t curr_total_tz_hits =
        track_id_to_tz_hits_entry != track_id_to_total_tz_hits.end()
            ? track_id_to_tz_hits_entry->second
            : 0;
    track_id_to_total_tz_hits[track_id] = curr_total_tz_hits + 1;
  }

  size_t clip_table_num_tz = clip_records_table.GetNumTargetZones();
  float search_selection_coefficient = this->search_selection_coefficient;

  // Filter out all track that do not pass the cutoff
  // Reference on how to delete from map while iterating:
  // https://stackoverflow.com/a/8234813
  for (auto it = track_id_to_total_tz_hits.cbegin();
       it != track_id_to_total_tz_hits.cend();) {
    uint32_t total_num_tz_hits = it->second;

    if (total_num_tz_hits < search_selection_coefficient * clip_table_num_tz) {
      track_id_to_total_tz_hits.erase(it++);
    } else {
      ++it;
    }
  }

  // TODO: remove, for now just return every potential match
  size_t _num_matches = track_id_to_total_tz_hits.size();
  records_search_match_t *_matches = new records_search_match_t[_num_matches];
  size_t _curr_match_idx = 0;
  for (auto entry : track_id_to_total_tz_hits) {
    uint32_t track_id = entry.first;
    uint32_t total_num_tz_hits = entry.second;
    records_search_match_t *curr_match = &_matches[_curr_match_idx];
    curr_match->track_id = track_id;
    curr_match->similarity = total_num_tz_hits;
    _curr_match_idx++;
  }
  // Clear existing result, if any
  if (this->matches != nullptr)
    delete this->matches;
  this->matches = _matches;
  this->matches_length = _num_matches;

  // TODO: implement time coherency filtering
}

void MemoryRecordsEngine::ClearAllRecords() {
  this->data_table.clear();
  this->track_id_to_data_table_entries.clear();
}