#pragma once

#include <string>

namespace shabam {
class Config {
protected:
  std::string debug_dir;
  int preprocessing_sample_rate;

public:
  /**
   * The directory for the debug output files to be saved to.
   */
  virtual std::string get_debug_dir() {
    return this->debug_dir;
  };

  /**
   * The sample rate the audio is downsampled to before analysis.
   */
  virtual int get_preprocessing_sample_rate() {
    return this->preprocessing_sample_rate;
  };
};
} // namespace shabam