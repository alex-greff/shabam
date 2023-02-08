#include "records_table.hpp"
#include <stdexcept>

RecordsTable::RecordsTable(Fingerprint &fingerprint,
                           size_t target_zone_size)
    : fingerprint(fingerprint) {
  this->target_zone_size = target_zone_size;

  this->records = nullptr;
  this->num_records = 0;
}

RecordsTable::~RecordsTable() {
  if (this->records != nullptr)
    delete this->records;
}

void RecordsTable::Compute() {
  if (this->fingerprint.fingerprint == nullptr)
    throw std::domain_error("Fingerprint must be computed.");

  // Initialize the records array
  size_t records_length = this->GetNumTargetZones();
  record_t *records = new record_t[records_length];
  this->records = records;

  size_t target_zone_size = this->target_zone_size;

  // The number of points between the anchor point and the first node of its
  // target zone. This avoids any possibilities of having time deltas of 0
  // since the anchor point is guaranteed to be in a different window than
  // all the points in the target zone
  size_t anchor_point_offset = this->fingerprint.partition_count;

  size_t fingerprint_cell_length =
      this->fingerprint.fingerprint_length / 2;
  uint32_t *fingerprint_data = this->fingerprint.fingerprint;

  size_t curr_record_idx = 0;

  // Treat this cell point as the anchor point and compute its corresponding
  // address records
  for (size_t anchor_cell_idx = 0; anchor_cell_idx < fingerprint_cell_length;
       anchor_cell_idx++) {
    uint32_t anchor_cell_window = fingerprint_data[anchor_cell_idx * 2];
    uint32_t anchor_cell_partition = fingerprint_data[anchor_cell_idx * 2 + 1];

    // Stop generating records if the anchor cell cannot fit a full target
    // zone. Note: this assumes that the order of the cells in the fingerprint
    // is ordered (actually everything assumes this).
    bool can_fit_full_target_zone =
        (anchor_cell_idx + anchor_point_offset + target_zone_size - 1) <
        fingerprint_cell_length;
    if (!can_fit_full_target_zone)
      break;

    // Generate address records for all target zones
    for (size_t zone = 0; zone < target_zone_size; zone++) {
      size_t point_cell_idx =
          anchor_cell_idx + anchor_point_offset + target_zone_size - 1;
      uint32_t point_cell_window = fingerprint_data[point_cell_idx * 2];
      uint32_t point_cell_partition = fingerprint_data[point_cell_idx * 2 + 1];

      // Add a new record in
      record_t *curr_record = &records[curr_record_idx];
      curr_record->anchor_frequency = anchor_cell_partition;
      curr_record->point_frequency = point_cell_partition;
      curr_record->delta = point_cell_window - anchor_cell_window;
      curr_record->anchor_absolute_time = anchor_cell_window;

      curr_record_idx++;
    }
  }
}

size_t RecordsTable::GetNumTargetZones() {
  // Due to the massive size these records tables can be, it is not
  // practical to naively compute the entire table and just .length the array
  // in order to find how many target zones exist in the current record table.

  // To derive the formula by inspection let's look at a simple example:
  // TARGET_ZONE_SIZE = 5, ANCHOR_POINT_OFFSET = 3, fingerprintLength = 10
  // Laying out the fingerprint points sequentially we see the
  // following properties emerges for the anchor points:
  //
  // fp point: |  x0   x1   x2   x3   x4   x5   x6   x7   x8   x9 |
  //  TZ size: |       5       | 4  | 3  | 2  | 1  |      0       |
  //
  // We see that x0, x1, x2 each are able to create target zones of size 5 and
  // as a result will produce records. x3, x4, x5, x6 sequentially
  // can support smaller target zones, which means that since they cannot form
  // full target zones, they will be skipped and no records will be produced.
  // Finally x6, x7, x8, x9 cannot form any target zones so like x4, x5 and
  // x6, no records will be produced. Let's call x0, x1, x2 "full points",
  // x3, x4, x5, x6 "partial points" and x7, x8, x9 "dead points".
  //
  // So the trick that we want to do is figure out how many partial and dead
  // points exist and from there we can easily derive how many full points
  // exist and from there calculate how many target zones are generated in
  // total.
  //
  // By inspection (and some confirmation) we get:
  //   numDeadPoints = ANCHOR_POINT_OFFSET
  //   numPartialPoints = TARGET_ZONE_SIZE - 1
  //   numFullPoints = fingerprintLength - numDeadPoints - numPartialPoints
  //
  // So we know that the number of target zones produced will just be the
  // number of full points
  //   numTargetZones = numFullPoints

  // Here's the implementation (simplified for efficiency):
  return this->target_zone_size *
         (this->fingerprint.partition_count - this->target_zone_size - 1);
}