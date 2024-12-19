#include "metrics.hpp"
#include "formatting.hpp"
#include <format>
#include <iostream>

namespace shabam {
Metrics::Metrics() {};

void Metrics::start(std::string name, std::string message) {
  this->start(name, message, false);
};

void Metrics::start(std::string name, std::string message,
                    bool include_newline) {
  std::cout << formatting::caret << " " << formatting::normal_style << message
            << "... " << formatting::reset_style;

  if (include_newline) {
    std::cout << std::endl;
  }

  const auto start_time = std::chrono::high_resolution_clock::now();
  this->start_map[name] = start_time;
}

void Metrics::end(std::string name) { this->end(name, ""); };

void Metrics::end(std::string name, std::string suffix) {
  const auto end_time = std::chrono::high_resolution_clock::now();

  if (!this->start_map.contains(name)) {
    throw std::invalid_argument(
        std::format("Metric \"{}\" was never started", name));
  }

  const auto start_time = this->start_map[name];

  // Remove item from start map
  auto iter = this->start_map.find(name);
  if (iter != this->start_map.end()) {
    this->start_map.erase(iter);
  }

  std::chrono::duration<double, std::milli> duration_ms = end_time - start_time;

  std::string suffix_fmt = suffix != "" ? suffix + " " : "";

  std::cout << formatting::bold_style << "done! " << formatting::normal_style
            << suffix_fmt << formatting::dim_style << "(" << duration_ms << ")"
            << formatting::reset_style << std::endl;
};
} // namespace shabam