#include <emscripten.h>
#include <iostream>
#include <tuple> // TODO: remove?

using namespace std;

extern "C" {

struct spectrogram_data *
create_spectrogram_data(int num_windows, int freq_bin_count, uint8_t *data);

struct fingerprint_options *create_fingerprint_options(int partition_amount,
                                                       int FFT_size,
                                                       int partition_curve);

struct fingerprint *generate_fingerprint(struct spectrogram_data *spectrogram,
                                         struct fingerprint_options *options);
void temp();
}

struct fingerprint_options {
  int partition_amount;
  int FFT_size;
  int partition_curve;
};

struct spectrogram_data {
  int num_windows;
  int freq_bin_count;
  uint8_t *data;
};

struct fingerprint {
  int num_windows;
  int num_partitions;
  uint8_t *data;
  float *partition_ranges; // TODO: make proper type def
};

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

  // TODO: implement

  return NULL;
}

// TODO: remove
EMSCRIPTEN_KEEPALIVE
void temp() { std::cout << "Hello World" << std::endl; }