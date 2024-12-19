#pragma once

namespace shabam {
class Config {
protected:
  int preprocessing_sample_rate;

public:
  /**
   * The sample rate the audio is downsampled to before analysis.
   */
  virtual int get_preprocessing_sample_rate() {
    return this->preprocessing_sample_rate;
  };
};
} // namespace shabam