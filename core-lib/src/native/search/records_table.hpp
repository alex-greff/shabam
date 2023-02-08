#ifndef SHABAM_CORE_LIB_RECORDS_TABLE
#define SHABAM_CORE_LIB_RECORDS_TABLE

#include "../fingerprint/fingerprint.hpp"

/** A single record. */
typedef struct Record {
  uint32_t anchor_frequency;
  uint32_t point_frequency;
  uint32_t delta;
  uint32_t anchor_absolute_time;
} record_t;

/**
 * Computes the records tables from a given fingerprint.
*/
class RecordsTable {
private:
  Fingerprint &fingerprint;

  /**
   * The number of points in a target zone.
  */
  size_t target_zone_size;

public:
  RecordsTable(Fingerprint &fingerprint, size_t target_zone_size);
  ~RecordsTable();

  /**
   * The array of records from the fingerprint.
  */
  record_t *records;

  /**
   * The number of items in the records array.
  */
  size_t num_records;

  /**
   * Computes the records array.
  */
  void Compute();

  /**
   * Gives the number of target zones.
  */
  size_t GetNumTargetZones();
};

#endif