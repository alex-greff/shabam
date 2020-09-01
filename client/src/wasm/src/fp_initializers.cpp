#include "fp_initializers.hpp"
#include "fp_defs.hpp"
#include "fp_global.h"
#include <emscripten.h>
#include <malloc.h>
#include <stddef.h>

/* Allocates memory for a spectrogram configured with the given options. Returns
   a pointer to the struct or NULL if memory allocation fails. */
EMSCRIPTEN_KEEPALIVE
struct spectrogram_data *
create_spectrogram_data(int num_windows, int freq_bin_count, uint8_t *data) {
  struct spectrogram_data *sd =
      (struct spectrogram_data *)malloc(sizeof(struct spectrogram_data));

  if (sd == NULL)
    return NULL;

  sd->num_windows = num_windows;
  sd->freq_bin_count = freq_bin_count;
  sd->data = data;

  return sd;
}

/* Allocates memory for a fingerprint options struct configured with the given
   options. Returns a pointer to the struct or NULL of memory allocation
   fails. */
EMSCRIPTEN_KEEPALIVE
struct fingerprint_options *create_fingerprint_options(int partition_amount,
                                                       int FFT_size,
                                                       int partition_curve) {
  struct fingerprint_options *fo =
      (struct fingerprint_options *)malloc(sizeof(struct fingerprint_options));

  if (fo == NULL)
    return NULL;

  fo->partition_amount = partition_amount;
  fo->FFT_size = FFT_size;
  fo->partition_curve = partition_curve;

  return fo;
}

/* Initializes the global fingerprint options. */
EMSCRIPTEN_KEEPALIVE
void initialize_global_fingerprint_options(int partition_amount,
                                           double partition_curve,
                                           int slider_width, int slider_height,
                                           double std_dev_mult) {
  FP_GLOBAL_SETTINGS.PARTITION_AMOUNT = partition_amount;
  FP_GLOBAL_SETTINGS.PARTITION_CURVE = partition_curve;
  FP_GLOBAL_SETTINGS.SLIDER_WIDTH = slider_width;
  FP_GLOBAL_SETTINGS.SLIDER_HEIGHT = slider_height;
  FP_GLOBAL_SETTINGS.STANDARD_DEVIATION_MULTIPLIER = std_dev_mult;
  FP_GLOBAL_SETTINGS_INITIALIZED = true;
}

/* Returns true if the global fingerprint options is initialized. */
EMSCRIPTEN_KEEPALIVE
bool global_fingerprint_options_initialized(void) {
  return FP_GLOBAL_SETTINGS_INITIALIZED;
}