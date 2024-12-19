#include "subcommand_handlers.hpp"
#include "config/toml-config.hpp"
#include "metrics.hpp"
#include "preprocessing.hpp"
#include <cstdint>
#include <format>
#include <iostream>
#include <string>
#include <termcolor/termcolor.hpp>
#include <tuple>

namespace shabam {
void add_handler(std::string file, std::string name, std::string config_path,
                 bool debug) {
  TomlConfig config = TomlConfig(config_path);
  Metrics metrics = Metrics();

  metrics.start("load_audio", "Loading audio");
  std::vector<float> samples;
  uint32_t sample_rate;
  std::tie(samples, sample_rate) = shabam::load_audio(file);
  metrics.end("load_audio");

  if (debug) {
    metrics.start("save_mono", "Saving mono audio file");
    std::string save_location =
        std::format("{}/{}_mono.wav", config.get_debug_dir(), name);
    shabam::save_audio(save_location, samples, sample_rate);
    metrics.end("save_mono");
  }

  metrics.start("downsample", "Downsampling audio");
  uint32_t ds_sample_rate = config.get_preprocessing_sample_rate();
  std::vector<float> ds_samples =
      shabam::downsample_audio(samples, sample_rate, ds_sample_rate);
  metrics.end("downsample");

  if (debug) {
    metrics.start("save_ds", "Saving downsampled audio file");
    std::string save_location =
        std::format("{}/{}_ds.wav", config.get_debug_dir(), name);
    shabam::save_audio(save_location, ds_samples, ds_sample_rate);
    metrics.end("save_ds");
  }

  // TODO: keep implementing

  // TODO: remove
  // std::cout << termcolor::red << "sample_rate: " << sample_rate
  //           << " ds_sample_rate: " << ds_sample_rate << termcolor::reset
  //           << std::endl;
}

void search_handler(std::string file, std::string config_path, bool debug) {
  // TODO: implement search handler
}
} // namespace shabam