#ifndef SHABAM_CORE_LIB_WINDOWING
#define SHABAM_CORE_LIB_WINDOWING

#include <liquid/liquid.h>
#include <stdlib.h>
#include <unordered_map>

typedef float (*window_function)(uint32_t i, uint32_t wlen);

// Supported window function mappings
static std::unordered_map<std::string, window_function> window_functions = {
    {"hamming", liquid_hamming},
    {"hann", liquid_hann},
    {"blackman-harris", liquid_blackmanharris},
    {"blackman-harris-7", liquid_blackmanharris7},
    {"flat-top", liquid_flattop},
};

#endif