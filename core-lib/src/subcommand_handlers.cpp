#include "subcommand_handlers.hpp"
#include "config/toml-config.hpp"
#include "preprocessing.hpp"
#include <iostream>
#include <string>
#include <termcolor/termcolor.hpp>
#include <tuple>

namespace shabam {
void add_handler(std::string file, std::string name, std::string config_path) {
  TomlConfig config = TomlConfig(config_path);

  std::vector<float> samples;
  int sample_rate;
  std::tie(samples, sample_rate) = shabam::load_audio(file);

  int ds_sample_rate = config.get_preprocessing_sample_rate();
  std::vector<float> ds_samples =
      shabam::downsample_audio(samples, sample_rate, ds_sample_rate);

  // TODO: keep implementing

  std::cout << termcolor::red << "sample_rate: " << sample_rate
            << " ds_sample_rate: " << ds_sample_rate << termcolor::reset
            << std::endl;
}

void search_handler(std::string file, std::string config_path) {
  // TODO: implement search handler
}
} // namespace shabam