#include "toml-config.hpp"
#include <format>
#include <string>
#include <toml++/toml.hpp>

using namespace std::literals;

namespace shabam {
TomlConfig::TomlConfig(std::string config_filepath) {
  toml::parse_result config;
  try {
    config = toml::parse_file(config_filepath);
  } catch (const toml::parse_error &err) {
    throw std::invalid_argument(
        std::format("Unable to load config file \"{}\"", config_filepath));
  }

  std::optional<std::string> debug_dir =
      config["debug"]["debugDir"].value<std::string>();
  if (debug_dir) {
    this->debug_dir = debug_dir.value();
  } else {
    throw std::invalid_argument("debug.debugDir is required");
  }

  std::optional<int> pre_sr =
      config["preprocessing"]["preprocessingSampleRate"].value<int>();
  if (pre_sr) {
    this->preprocessing_sample_rate = pre_sr.value();
  } else {
    throw std::invalid_argument(
        "preprocessing.preprocessingSampleRate is required");
  }
}
} // namespace shabam