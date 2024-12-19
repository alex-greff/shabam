#include "preprocessing.hpp"
#include <iostream>
#include <string>
#include <tuple>

namespace shabam {
void add_handler(std::string file, std::string name) {
  // TODO: implement add handler
  std::vector<float> samples;
  int sample_rate;
  // const auto [samples, sample_rate] = shabam::load_audio(file);
  std::tie(samples, sample_rate) = shabam::load_audio(file);

  int ds_sample_rate = sample_rate / 4; // TODO: move to config
  std::vector<float> ds_samples =
      shabam::downsample_audio(samples, sample_rate, ds_sample_rate);

  std::cout << "sample_rate: " << sample_rate << " ds_sample_rate: " << ds_sample_rate << std::endl;
}

void search_handler(std::string file) {
  // TODO: implement search handler
}
} // namespace shabam