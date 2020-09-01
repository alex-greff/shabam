#ifndef FP_INITIALIZERS
#define FP_INITIALIZERS

#include "fp_defs.hpp"
#include <emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
struct spectrogram_data *
create_spectrogram_data(int num_windows, int freq_bin_count, uint8_t *data);

EMSCRIPTEN_KEEPALIVE
struct fingerprint_options *create_fingerprint_options(int partition_amount,
                                                       int FFT_size,
                                                       int partition_curve);

EMSCRIPTEN_KEEPALIVE
void initialize_global_fingerprint_options(int partition_amount,
                                           double partition_curve,
                                           int slider_width, int slider_height,
                                           double std_dev_mult);

EMSCRIPTEN_KEEPALIVE
bool global_fingerprint_options_initialized(void);

}

#endif