#ifndef FP_INITIALIZERS
#define FP_INITIALIZERS

#include "fp_defs.hpp"
#include <emscripten.h>

extern "C" {

struct spectrogram_data *
create_spectrogram_data(int num_windows, int freq_bin_count, uint8_t *data);

struct fingerprint_options *
create_fingerprint_options(int partition_amount, int *partition_ranges,
                           int num_partition_ranges);

void initialize_global_fingerprint_options(int partition_amount,
                                           double partition_curve,
                                           int slider_width, int slider_height,
                                           double std_dev_mult);

bool global_fingerprint_options_initialized(void);

void free_spectrogram_data(struct spectrogram_data *sd);
void free_fingerprint_options(struct fingerprint_options *options);
void free_fingerprint(struct fingerprint *fp);
}

#endif