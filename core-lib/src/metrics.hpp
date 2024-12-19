#pragma once

#include <chrono>
#include <map>
#include <string>

namespace shabam {
class Metrics {
private:
  std::map<std::string,
           std::chrono::time_point<std::chrono::high_resolution_clock>>
      start_map;

public:
  Metrics();

  void start(std::string name, std::string message);
  void start(std::string name, std::string message, bool include_newline);

  void end(std::string name);
  void end(std::string name, std::string suffix);
};
} // namespace shabam