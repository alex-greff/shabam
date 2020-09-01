// This is the main module that defines the globals and acts as a proxy for
// the other modules
#include "fp_interface.hpp"
#include "fp_generator.hpp"

bool FP_GLOBAL_SETTINGS_INITIALIZED = false;
struct FINGERPRINT_GLOBAL_SETTINGS FP_GLOBAL_SETTINGS;