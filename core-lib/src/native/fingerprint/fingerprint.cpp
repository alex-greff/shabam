#include "fingerprint.hpp"
#include "../utils.hpp"
#include "../windowing.hpp"
#include <limits>
#include <stdexcept>
#include <string.h>

Fingerprint::Fingerprint(float *spectrogram, size_t spectrogram_length,
                         size_t spectrogram_num_buckets,
                         size_t spectrogram_num_windows,
                         float standard_deviation_multiplier,
                         float partition_curve_tension, size_t partition_count,
                         size_t sliding_window_width,
                         size_t sliding_window_height,
                         std::string sliding_window_func_name) {
  if (spectrogram == nullptr)
    throw std::invalid_argument("spectrogram must not be nullptr.");

  if (spectrogram_length == 0)
    throw std::invalid_argument("spectrogram_length must non-zero.");

  if (spectrogram_num_buckets == 0)
    throw std::invalid_argument("spectrogram_num_buckets must non-zero.");

  // Reference:
  // https://www.educative.io/answers/how-to-check-if-a-number-is-a-power-of-2-in-cpp
  if (ceil(log2f32(spectrogram_num_buckets)) !=
      floor(log2f32(spectrogram_num_buckets)))
    throw std::invalid_argument(
        "spectrogram_num_buckets must be a power of 2.");

  if (partition_curve_tension == 0)
    throw std::invalid_argument("partition_curve_tension must non-zero.");

  if (partition_count == 0)
    throw std::invalid_argument("partition_count must non-zero.");

  if (sliding_window_width == 0)
    throw std::invalid_argument("sliding_window_width must non-zero.");

  if (spectrogram_num_windows % 2 == 1 &&
      sliding_window_width > spectrogram_num_windows)
    throw std::invalid_argument(
        "sliding_window_width must be in range [1, spectrogram_num_windows].");
  else if (sliding_window_width > spectrogram_num_windows - 1)
    throw std::invalid_argument("sliding_window_width must be in range [1, "
                                "spectrogram_num_windows - 1].");

  if (sliding_window_height == 0)
    throw std::invalid_argument("sliding_window_height must non-zero.");

  if (partition_count % 2 == 1 && sliding_window_height > partition_count)
    throw std::invalid_argument(
        "sliding_window_width must be in range [1, partition_count].");
  else if (sliding_window_height > partition_count - 1)
    throw std::invalid_argument(
        "sliding_window_width must be in range [1, partition_count - 1].");

  if (window_functions.find(sliding_window_func_name) == window_functions.end())
    throw std::invalid_argument(
        "sliding_window_func_name must be a valid window function name.");

  this->spectrogram = spectrogram;
  this->spectrogram_length = spectrogram_length;
  this->spectrogram_num_buckets = spectrogram_num_buckets;
  this->spectrogram_num_windows = spectrogram_num_windows;

  this->standard_deviation_multiplier = standard_deviation_multiplier;

  this->partition_curve_tension = partition_curve_tension;
  this->partition_count = partition_count;

  this->sliding_window_width = sliding_window_width;
  this->sliding_window_height = sliding_window_height;
  this->sliding_window_func = window_functions[sliding_window_func_name];
}

Fingerprint::~Fingerprint() {
  if (this->fingerprint != nullptr)
    delete this->fingerprint;
}

void Fingerprint::Compute() {
  size_t num_partitions = this->partition_count;
  uint32_t *partitions = new uint32_t[num_partitions + 1];
  Fingerprint::ComputePartitionRanges(partitions, num_partitions,
                                      this->partition_curve_tension,
                                      this->spectrogram_num_buckets);

  size_t num_buckets = this->spectrogram_num_buckets;
  size_t num_windows = this->spectrogram_num_windows;

  float *spectrogram = this->spectrogram;

  float *max_val_cell_data = new float[num_windows * num_partitions];

  // Compute the cell data by finding the strongest frequency of each cell
  // in the spectrogram
  for (size_t curr_window = 0; curr_window < num_windows; curr_window++) {
    for (size_t curr_partition = 0; curr_partition < num_partitions;
         curr_partition++) {
      uint32_t partition_start_idx = partitions[curr_partition];   // inclusive
      uint32_t partition_end_idx = partitions[curr_partition + 1]; // exclusive

      // inclusive
      size_t bucket_start_idx = curr_window * num_buckets + partition_start_idx;
      // exclusive
      size_t bucket_end_idx = curr_window * num_buckets + partition_end_idx;

      float max_val = -INFINITY;
      for (size_t sample_idx = bucket_start_idx; sample_idx < bucket_end_idx;
           sample_idx++) {
        float curr_val = spectrogram[sample_idx];
        max_val = std::max(max_val, curr_val);
      }

      size_t cell_idx = curr_window * num_partitions + curr_partition;
      max_val_cell_data[cell_idx] = max_val;
    }
  }

  size_t slider_width = this->sliding_window_width;
  size_t slider_height = this->sliding_window_height;
  size_t slider_size = slider_width * slider_height;
  window_function slider_window_func = this->sliding_window_func;

  size_t slider_width_half = std::floor(slider_width / 2.0);
  size_t slider_height_half = std::floor(slider_height / 2.0);

  // Representation of the fingerprint with a flag indicating if the given cell
  // is an "on" point in the fingerprint
  bool *passed_cells = new bool[num_windows * num_partitions];
  size_t num_passed_cells = 0; // The number of cells that passed
  memset(passed_cells, 0, sizeof(bool) * num_windows * num_partitions);

  // Compute the fingerprint data
  for (size_t curr_window = 0; curr_window < num_windows; curr_window++) {
    for (size_t curr_partition = 0; curr_partition < num_partitions;
         curr_partition++) {
      // Determine the slider range
      // When we near the edge of a slider range (either at the front or end
      // of the array), the slider with not fit around the centerpoint equally
      // on both sides. In these cases, we still keep the same slider size but
      // simply shift it enough to still fit within the range.
      //
      // Ex 1: fitting slider
      // slider_width = 5
      //   |   |   |   |   |   |   |   |   |   |
      //   0   1   2   3   4   5   6   7   8   9
      //                         ^
      //               |-------------------|     (fitting slider)
      //
      // Ex 2: overflowing left side
      // slider_width = 5
      //        |   |   |   |   |   |   |   |   |   |
      //        0   1   2   3   4   5   6   7   8   9
      //             ^
      //    |-------------------|       (centered slider)
      //        |-------------------|   (shifted slider (+1))
      //
      // Ex 3: overflowing right side
      // slider_width = 5
      //   |   |   |   |   |   |   |   |   |   |
      //   0   1   2   3   4   5   6   7   8   9
      //                                     ^
      //                           |-------------------|   (centered slider)
      //                   |-------------------|           (shifted slider (-2))

      // TODO: factor out into function

      // +value => slider window is overflowing left
      // -value => slider window is overflowing right
      int32_t slider_width_shift = 0;
      // The slider window is overflowing the left
      // Note: we do not do `curr_window - slider_width_half < 0` here because
      // we are dealing with unsigned values here so negatives can screw it up
      if (curr_window < slider_width_half)
        slider_width_shift = slider_width_half - curr_window;
      // The slider width is overflowing the right
      else if (curr_window + slider_width_half >= num_windows)
        slider_width_shift = num_windows - curr_window + slider_width_half;

      // Same kind of calculations for the height slider
      int32_t slider_height_shift = 0;
      if (curr_partition < slider_height_half)
        slider_height_shift = slider_height_half - curr_partition;
      else if (curr_partition + slider_height_half >= num_partitions)
        slider_height_shift =
            num_partitions - curr_partition + slider_height_half;

      // inclusive
      size_t slider_x_start_idx =
          MAX((size_t)0, (size_t)(curr_window - slider_width_half));
      // exclusive
      size_t slider_x_end_idx =
          MIN(curr_window + slider_width_half, num_windows);

      // inclusive
      size_t slider_y_start_idx =
          MAX((size_t)0, (size_t)(curr_partition - slider_height_half));
      // exclusive
      size_t slider_y_end_idx =
          MIN(curr_partition + slider_height_half, num_partitions);

      // The effective slider dimensions when using the window function
      size_t slider_window_width =
          2 * (slider_width_half + std::abs(slider_width_shift)) + 1;
      size_t slider_window_height =
          2 * (slider_height_half + std::abs(slider_height_shift)) + 1;

      // Compute the mean value of the slider, weighted by the
      // windowing function
      float slider_mean = 0.0;
      for (size_t sx = slider_x_start_idx; sx < slider_x_end_idx; sx++) {
        for (size_t sy = slider_y_start_idx; sy < slider_y_end_idx; sy++) {
          float weight_value_x = slider_window_func(
              curr_window - slider_width_shift, slider_window_width);
          float weight_value_y = slider_window_func(
              curr_partition - slider_height_shift, slider_window_height);

          float combined_weight_value = (weight_value_x + weight_value_y) / 2.0;

          size_t curr_cell_idx = sx * num_partitions + sy;
          float curr_cell_value = max_val_cell_data[curr_cell_idx];
          slider_mean += curr_cell_value * combined_weight_value;
        }
      }

      slider_mean = slider_mean / slider_size;

      // Compute the variance of the slider, weighted by the windowing function
      float slider_variance = 0.0;
      for (size_t sx = slider_x_start_idx; sx < slider_x_end_idx; sx++) {
        for (size_t sy = slider_y_start_idx; sy < slider_y_end_idx; sy++) {
          float weight_value_x = slider_window_func(
              curr_window - slider_width_shift, slider_window_width);
          float weight_value_y = slider_window_func(
              curr_partition - slider_height_shift, slider_window_height);

          float combined_weight_value = (weight_value_x + weight_value_y) / 2.0;

          size_t curr_cell_idx = sx * num_partitions + sy;
          float curr_cell_value = max_val_cell_data[curr_cell_idx];
          slider_variance += std::pow(
              (curr_cell_value * combined_weight_value) - slider_mean, 2);
        }
      }
      slider_variance = slider_variance / slider_size;

      // Compute the standard deviation of the slider
      float slider_standard_deviation = std::sqrt(slider_variance);

      // Determine if the current cell passes
      size_t cell_idx = curr_window * num_partitions + curr_partition;
      float cell_value = max_val_cell_data[cell_idx];
      float standard_deviation_multiplier = this->standard_deviation_multiplier;
      float threshold_value =
          MAX(0, slider_mean +
                     slider_standard_deviation * standard_deviation_multiplier);

      bool passes = cell_value > threshold_value;
      if (passes) {
        passed_cells[cell_idx] = true;
        num_passed_cells++;
      }
    }
  }

  // These are unneeded now
  delete partitions;
  delete max_val_cell_data;

  // Condense the fingerprint points
  uint32_t *fingerprint = new uint32_t[num_passed_cells * 2];
  size_t curr_passed_cell = 0;
  for (size_t curr_window = 0; curr_window < num_windows; curr_window++) {
    for (size_t curr_partition = 0; curr_partition < num_partitions;
         curr_partition++) {
      size_t cell_idx = curr_window * num_partitions + curr_partition;
      bool passed = passed_cells[cell_idx];

      // Found a passed cell
      if (passed) {
        fingerprint[curr_passed_cell * 2] = curr_window;
        fingerprint[curr_passed_cell * 2 + 1] = curr_partition;

        curr_passed_cell++;
      }
    }
  }

  this->fingerprint = fingerprint;
  this->fingerprint_length = num_passed_cells * 2;

  // Cleanup
  delete passed_cells;
}