#ifndef FP_DEFS
#define FP_DEFS

#include <stdint.h>

// Note: these types should ALWAYS match their equivalents in @/audio/types.ts

struct FINGERPRINT_GLOBAL_SETTINGS {
  /* The sample size of the FFT. */
  int FFT_SIZE;
  /* Number of partitions in the fingerprints.
    Range: [1, infinity) */
  int PARTITION_AMOUNT;
  /* Curve used to calculate partitions.
   Range: (1, infinity) */
  double PARTITION_CURVE;
  /* Number of windows on each side of the slider
   TOTAL_SLIDER_WIDTH = 2 * FINGERPRINT_SLIDER_WIDTH + 1 */
  int SLIDER_WIDTH;
  /* Number of windows above and below the slider
   TOTAL_SLIDER_HEIGHT = 2 * FINGERPRINT_SLIDER_HEIGHT + 1*/
  int SLIDER_HEIGHT;
  /* How much of the standard deviation is added to the fingerprint cell
   acceptance threshold value.
   In general, larger values make the fingerprint cell filtering more sensitive.
   <0: the standard deviation is subtracted from the mean
   0: no weight (only the mean is used)
   1: entire standard deviation is added
   >1: more than the entire standard deviation is added */
  double STANDARD_DEVIATION_MULTIPLIER;
};

/* Options used when generating a fingerprint. */
struct fingerprint_options {
  int partition_amount; /* The number of partitions used. */
  int FFT_size;         /* The size of the FFT window. */
  int partition_curve;  /* The curve that the partition ranges
                           are calculated on. */
};

/* Spectrogram data representation.
   length of data = num_windows * freq_bin_count
*/
struct spectrogram_data {
  int num_windows;    /* Number of windows (x-axis). */
  int freq_bin_count; /* Number of frequency bins (y-axis). */
  uint8_t *data;      /* Spectrogram data. */
};

/* Fingerprint representation. */
struct fingerprint {
  int num_windows;          /* Number of windows. */
  int num_partitions;       /* Number of partitions. */
  uint32_t *data;           /* The [window, partition] tuple data array. */
  int num_data_pair;        /* The number of pair tuples in data. */
  int *partition_ranges;    /* The partition range tuple array. */
  int num_partition_ranges; /* The number of pair tuples in partition ranges. */
};

#endif