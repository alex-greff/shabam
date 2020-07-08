#include <emscripten.h>
#include <iostream>

extern "C" {
    struct fingerprint *generate_fingerprint(struct spectrogram_data *spectrogram, struct fingerprint_options *options);
}

struct fingerprint_options {
  int partition_amount;
  int FFT_size;
  int partition_curve;
};

struct spectrogram_data {
  int num_windows;
  int freq_bin_count;
  void *data; // TODO: make proper typedef
};

struct fingerprint {
  int num_windows;
  int num_partitions;
  void *data;             // TODO: make proper typedef
  void *partition_ranges; // TODO: make proper typedef
};

// TODO: how the generate_fingerprint function is going to work
// 1. The spectrogram data/options will be copied into WASM memory first with
// the
//    pointers to the spectrogram data and options being passed in
// 2. Computes the fingerprint
// 2. Returns a pointer the struct fingerprint instance
EMSCRIPTEN_KEEPALIVE
struct fingerprint *generate_fingerprint(struct spectrogram_data *spectrogram, struct fingerprint_options *options) {
  std::cout << "Hello World" << std::endl;

  // TODO: implement

  return NULL;
}