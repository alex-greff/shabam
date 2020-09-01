#include "fp_generator.hpp"
#include "fp_defs.hpp"
#include "fingerprint.hpp"
#include <emscripten.h>
#include <iostream>
#include <malloc.h>
#include <stddef.h>
#include <tgmath.h>

/* Generates the fingerprint with the given spectrogram data and options. */
EMSCRIPTEN_KEEPALIVE
struct fingerprint *generate_fingerprint(struct spectrogram_data *spectrogram,
                                         struct fingerprint_options *options) {
  // Ensure that the global settings have been initialized
  if (FP_GLOBAL_SETTINGS_INITIALIZED == false) {
    return NULL;
  }

  int num_partitions = options->partition_amount;
  int *partition_ranges = options->partition_ranges;

  int num_windows = spectrogram->num_windows;
  int num_frequencies = spectrogram->freq_bin_count;

  // Initialize space for cell data
  uint8_t *cell_data =
      (uint8_t *)malloc(num_windows * num_frequencies * sizeof(uint8_t));
  if (cell_data == NULL) {
    free(partition_ranges);
    return NULL;
  }

  // Initialize space for fingerprint data
  bool *fingerprint_data =
      (bool *)malloc(num_windows * num_frequencies * sizeof(bool));
  if (fingerprint_data == NULL) {
    free(partition_ranges);
    free(cell_data);
    return NULL;
  }

  // Compute the cell data by finding the strongest frequency of each cell
  // in the spectrogram
  for (int cur_window = 0; cur_window < num_windows; cur_window++) {
    for (int cur_partition = 0; cur_partition < num_partitions;
         cur_partition++) {
      int partition_start_idx = partition_ranges[cur_partition * 2];
      int partition_end_idx = partition_ranges[cur_partition * 2 + 1];

      int freq_start_idx = cur_window * num_frequencies + partition_start_idx;
      int freq_end_idx = cur_window * num_frequencies + partition_end_idx;

      uint8_t max_val = 0;
      for (int i = freq_start_idx; i < freq_end_idx; i++) {
        uint8_t cur_val = spectrogram->data[i];
        max_val = cur_val > max_val ? cur_val : max_val;
      }

      int cell_idx = cur_window * num_partitions + cur_partition;
      cell_data[cell_idx] = max_val;
    }
  }

  // Compute the fingerprint data
  int num_fingerprint_cells = 0;
  for (int cur_window = 0; cur_window < num_windows; cur_window++) {
    for (int cur_partition = 0; cur_partition < num_partitions;
         cur_partition++) {
      // Determine slider window range
      int SLIDER_WIDTH = FP_GLOBAL_SETTINGS.SLIDER_WIDTH;
      int SLIDER_HEIGHT = FP_GLOBAL_SETTINGS.SLIDER_HEIGHT;
      int slider_x_start = std::max(0, cur_window - SLIDER_WIDTH);
      int slider_x_end = std::min(num_windows, cur_window + SLIDER_WIDTH + 1);
      int slider_y_start = std::max(0, cur_partition - SLIDER_HEIGHT);
      int slider_y_end =
          std::min(num_partitions, cur_partition + SLIDER_HEIGHT + 1);
      int slider_size =
          (slider_x_end - slider_x_start) * (slider_y_end - slider_y_start);

      // Compute the mean value of the slider
      double slider_mean = 0;
      for (int sx = slider_x_start; sx < slider_x_end; sx++) {
        for (int sy = slider_y_start; sy < slider_y_end; sy++) {
          int cur_cell_idx = sx * num_partitions + sy;
          uint8_t cur_cell_value = cell_data[cur_cell_idx];
          slider_mean += cur_cell_value;
        }
      }
      slider_mean = slider_mean / slider_size;

      // Compute the variance of the slider
      double slider_variance = 0;
      for (int sx = slider_x_start; sx < slider_x_end; sx++) {
        for (int sy = slider_y_start; sy < slider_y_end; sy++) {
          int cur_cell_idx = sx * num_partitions + sy;
          uint8_t cur_cell_value = cell_data[cur_cell_idx];
          double cell_difference = cur_cell_value - slider_mean;
          slider_variance += pow(cell_difference, 2);
        }
      }
      slider_variance = slider_variance / slider_size;

      // Compute the standard deviation of the slider
      double slider_standard_deviation = round(sqrt(slider_variance));

      // Determine of the current cell passes
      int cell_idx = cur_window * num_partitions + cur_partition;
      uint8_t cell_value = cell_data[cell_idx];

      double STANDARD_DEVIATION_MULTIPLIER =
          FP_GLOBAL_SETTINGS.STANDARD_DEVIATION_MULTIPLIER;
      double threshold_value =
          std::max((double)0, slider_mean + slider_standard_deviation *
                                                STANDARD_DEVIATION_MULTIPLIER);

      bool passes = cell_value > threshold_value;
      fingerprint_data[cell_idx] = passes;
      if (passes) {
        num_fingerprint_cells++;
      }
    }
  }

  free(cell_data);

  // Condense the fingerprint points
  uint32_t *fingerprint_points =
      (uint32_t *)malloc(num_fingerprint_cells * 2 * sizeof(uint32_t));
  if (fingerprint_points == NULL) {
    free(partition_ranges);
    free(fingerprint_data);
    return NULL;
  }

  int i = 0;
  for (int cur_window = 0; cur_window < num_windows; cur_window++) {
    for (int cur_partition = 0; cur_partition < num_partitions;
         cur_partition++) {
      int cell_idx = cur_window * num_partitions + cur_partition;
      bool cell_passed = fingerprint_data[cell_idx];

      // We found a passing cell, record it in our fingerprint points
      if (cell_passed) {
        fingerprint_points[i * 2] = cur_window;
        fingerprint_points[i * 2 + 1] = cur_partition;
        i++;
      }
    }
  }

  free(fingerprint_data);

  // Create fingerprint
  struct fingerprint *fp =
      (struct fingerprint *)malloc(sizeof(struct fingerprint));
  if (fp == NULL) {
    free(partition_ranges);
    free(fingerprint_points);
    return NULL;
  }

  fp->num_windows = num_windows;
  fp->num_freq_bins = num_frequencies;
  fp->num_partitions = num_partitions;
  fp->data = fingerprint_points;
  fp->num_data_pair = num_fingerprint_cells;
  fp->partition_ranges = partition_ranges;
  fp->num_partition_ranges = num_partitions;

  return fp;
}