#pragma once

#include <string>

namespace shabam {
void add_handler(std::string file, std::string name, std::string config_path,
                 bool debug);
void search_handler(std::string file, std::string config_path, bool debug);
} // namespace shabam