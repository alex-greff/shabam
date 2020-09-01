#include "fp_generator.hpp"
#include "fp_defs.hpp"
#include "fp_global.h"
#include <emscripten.h>
#include <iostream>
#include <malloc.h>
#include <stddef.h>

// TODO: how the generate_fingerprint function is going to work
// 1. The spectrogram data/options will be copied into WASM memory first with
// the
//    pointers to the spectrogram data and options being passed in
// 2. Computes the fingerprint
// 2. Returns a pointer the struct fingerprint instance

/* Generates the fingerprint with the given spectrogram data and options. */
EMSCRIPTEN_KEEPALIVE
struct fingerprint *generate_fingerprint(struct spectrogram_data *spectrogram,
                                         struct fingerprint_options *options) {
  std::cout << "WASM: Hello World from generate_fingerprint" << std::endl;

  printf("WASM: spectrogram: num_windows=%d, freq_bin_count=%d\n",
         spectrogram->num_windows, spectrogram->freq_bin_count);

  if (FP_GLOBAL_SETTINGS_INITIALIZED == false)
    return NULL;

  // TODO: implement

  return NULL;
}