#include "records_engine.hpp"

#include <limits.h>
#include <stdint.h>

RecordsEngine::RecordsEngine(size_t target_zone_size,
                             float search_selection_coefficient) {
  this->target_zone_size = target_zone_size;
  this->search_selection_coefficient = search_selection_coefficient;
}

RecordsEngine::~RecordsEngine() {
  if (this->matches != nullptr)
    delete this->matches;
}

uint64_t RecordsEngine::EncodeAddress(uint16_t anchor_frequency,
                                      uint16_t point_frequency,
                                      uint32_t delta) {
  // Bit layout:
  // | most sig                                               least sig |
  // |                          64-bit integer                          |
  // |xxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  // |  anchor freq   |    point freq    |             delta            |

  uint64_t encoded = (uint64_t)anchor_frequency;
  encoded = encoded << 16LL; // Make space for point_frequency
  encoded = encoded | ((uint64_t)point_frequency); // Add point_frequency
  encoded = encoded << 32LL;                       // Make space for delta
  encoded = encoded | ((uint64_t)delta);           // Add delta

  return encoded;
}

std::tuple<uint16_t, uint16_t, uint32_t>
RecordsEngine::DecodeAddress(uint64_t address) {
  // 1111111111111111000000000000000000000000000000000000000000000000
  // = (2^16 - 1) << 48
  // = 65535 << 48
  // = 18446462598732840960
  uint64_t anchor_mask = 18446462598732840960ULL;

  // 0000000000000000111111111111111100000000000000000000000000000000
  // = (2^16 - 1) << 32
  // = 65535 << 32
  // = 281470681743360
  uint64_t point_mask = 281470681743360ULL;

  // 0000000000000000000000000000000011111111111111111111111111111111
  // = 2^32 - 1
  // = 4294967295
  uint64_t delta_mask = 4294967295ULL;

  uint16_t anchor_frequency = (uint16_t)((address & anchor_mask) >> 48ULL);
  uint16_t point_frequency = (uint16_t)((address & point_mask) >> 32ULL);
  uint32_t delta = (uint32_t)(address & delta_mask);

  return std::make_tuple(anchor_frequency, point_frequency, delta);
}

uint64_t RecordsEngine::EncodeCouple(uint32_t absolute_time,
                                     uint32_t track_id) {
  // Bit layout:
  // | most sig                                              least sig |
  // |                          64-bit integer                         |
  // |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
  // |          absolute_time           |           track_id           |

  uint64_t encoded = (uint64_t)absolute_time;
  encoded = encoded << 32ULL;               // Make space for track_id
  encoded = encoded | ((uint64_t)track_id); // Add track_id

  return encoded;
}

std::tuple<uint32_t, uint32_t> RecordsEngine::DecodeCouple(uint64_t couple) {
  // 1111111111111111111111111111111100000000000000000000000000000000
  // = (2^32 - 1) << 32
  // = 4294967295 << 32
  // = 18446462598732840960
  uint64_t absolute_time_mask = 18446744069414584320ULL;

  // 0000000000000000000000000000000011111111111111111111111111111111
  // = 2^32 - 1
  // = 4294967295
  uint64_t track_id_mask = 4294967295ULL;

  uint32_t absolute_time = (uint32_t)((couple & absolute_time_mask) >> 32ULL);
  uint32_t track_id = (uint32_t)(couple & track_id_mask);

  return std::make_tuple(absolute_time, track_id);
}