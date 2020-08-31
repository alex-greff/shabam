#ifndef FP_GENERATOR
#define FP_GENERATOR

#include "fp_defs.hpp"
#include <emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
struct fingerprint *generate_fingerprint(struct spectrogram_data *spectrogram,
                                         struct fingerprint_options *options);

}

#endif