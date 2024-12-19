#pragma once

#include "config.hpp"
#include <string>

namespace shabam {
class TomlConfig : public Config {
public:
  TomlConfig(std::string config_filepath);
};
} // namespace shabam