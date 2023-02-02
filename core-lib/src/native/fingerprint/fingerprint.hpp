#ifndef SHABAM_CORE_LIB_FINGERPRINT
#define SHABAM_CORE_LIB_FINGERPRINT

#include "../windowing.hpp"
#include <cmath>
#include <stdlib.h>
#include <string>

class Fingerprint {
private:
  /**
   * Helper function used by ComputePartitionRanges to get the boundary indexes
   * of each partition range.
   */
  static inline uint32_t GetBoundaryIndex(size_t partition_idx,
                                          size_t total_partitions,
                                          size_t total_bins,
                                          size_t partition_curve) {
    // Equation: y = (b/(c-1))(c^(x/a)-1)
    //   where:
    //     a = number of partitions
    //     b = number of bins (FFT_size / 2)
    //     c = tension on the curve

    return (uint32_t)std::floor(
        (((double)total_bins) / (((double)partition_curve) - 1.0)) *
        (std::pow(partition_curve,
                  ((double)partition_idx) / ((double)total_partitions)) -
         1.0));
  }

public:
  Fingerprint(float *spectrogram, size_t spectrogram_length,
              size_t spectrogram_num_buckets, size_t spectrogram_num_windows,
              float standard_deviation_multiplier,
              float partition_curve_tension, size_t partition_count,
              size_t sliding_window_width, size_t sliding_window_height,
              std::string sliding_window_func_name);

  ~Fingerprint();

  // --- Fingerprint Config ---

  /**
   * The tension of the curve used to calculate the FFT bucket ranges each
   * partition maps to. Higher values result in steeper curves.
   *
   * Range: (0, infinity)
   */
  float partition_curve_tension;

  /**
   * The number of partitions (y-axis) in the fingerprint.
   */
  size_t partition_count;

  /**
   * How much of the standard deviation is added to the fingerprint cell
   * acceptance threshold value.
   *
   * In general, larger values make the fingerprint cell filtering more
   * sensitive:
   *   <0: the standard deviation is subtracted from the mean (not recommended)
   *    0: no weight (only the mean is used)
   *    1: the entire standard deviation is added
   *   >1: x times the standard deviation is added (recommended)
   */
  float standard_deviation_multiplier;

  /**
   * The width (number of windows) of the sliding window.
   * Must be an odd number.
   *
   * Range: [1, spectrogram_num_windows or spectrogram_num_windows - 1],
   *        whichever is odd
   */
  size_t sliding_window_width;

  /**
   * The height (number of partitions) of the sliding window.
   * Must be an odd number.
   *
   * Range: [1, partition_count or partition_count - 1], whichever is odd
   */
  size_t sliding_window_height;

  /**
   * The windowing function to use to calculate the mean weightings of the
   * cells.
   */
  window_function sliding_window_func;

  // --- Spectrogram Info ---

  /**
   * The spectrogram array.
   */
  float *spectrogram;

  /**
   * The total number of elements in the spectrogram array.
   *
   * Note:
   * spectrogram_length = spectrogram_num_buckets * spectrogram_num_windows
   */
  size_t spectrogram_length;

  /**
   * The number of FFT buckets in the spectrogram.
   *
   * Note: FFT size = 2 * FFT buckets
   */
  size_t spectrogram_num_buckets;

  /**
   * The number of windows in the spectrogram.
   */
  size_t spectrogram_num_windows;

  // --- Result Data ---

  /**
   * The fingerprint data.
   *
   * Data format: (window_idx, partition_idx)[]
   * An array of tuples that indicate which cells at (window_idx, partition_idx)
   * are in an "on" state. Any points not included are in the "off" state.
   */
  uint32_t *fingerprint;

  /**
   * The number of elements in the fingerprint array.
   *
   * Note: fingerprint_length / 2 = the number of fingerprint "on" points.
   */
  size_t fingerprint_length;

  /**
   * Computes and populates the fingerprint.
   */
  void Compute();

  /**
   * Computes the partition ranges from the given parameters.
   *
   * @param partitions The preallocated partition array that the results will be
   * written into. Must be allocated with `partition_count + 1` elements.
   *
   * Data format:
   * [partitions[i], partitions[i+1]] the min (inclusive) and max (exclusive)
   * FFT buckets that belong to partition i in [0, partition_count - 1].
   *
   * @param partition_count The number of partitions.
   * @param partition_curve_tension The tension of the partition curve.
   * @param spectrogram_num_buckets The number of buckets in the spectrogram
   * these partition ranges are being computed off of.
   */
  static void ComputePartitionRanges(uint32_t *partitions,
                                     size_t partition_count,
                                     size_t partition_curve_tension,
                                     size_t spectrogram_num_buckets) {
    for (size_t partition_idx = 0; partition_idx < partition_count + 1;
         partition_idx++) {
      partitions[partition_idx] =
          GetBoundaryIndex(partition_idx, partition_count,
                           spectrogram_num_buckets, partition_curve_tension);
    }
  }
};

#endif