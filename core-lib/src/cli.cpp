#if USE_CLI11_FULL == 1
#include <CLI/CLI.hpp>
#else
#include <CLI11.hpp>
#endif
#include "subcommand_handlers.hpp"
#include <iostream>
#include <string>

#define SHABAM_DEFAULT_CONFIG_FILE "shabam-config.toml"

void add_common_options(CLI::App *app, std::string &config) {
  app->add_option("--config, -c", config,
                  "The config file path. Defaults to \"shabam-config.toml\"");
}

int main(int argc, char **argv) {
  CLI::App app{"The Shabam CLI"};
  argv = app.ensure_utf8(argv);

  // --- Add command ---
  auto add_sub = app.add_subcommand("add", "Adds a track");
  std::string addFile;
  add_sub->add_option("file", addFile, "Filepath to the track to add")
      ->required();
  std::string name;
  add_sub->add_option("name", name, "The name of the track")->required();
  std::string addConfigPath = SHABAM_DEFAULT_CONFIG_FILE;
  add_common_options(add_sub, addConfigPath);
  add_sub->callback(
      [&]() { shabam::add_handler(addFile, name, addConfigPath); });

  // --- Search command ---
  auto search_sub = app.add_subcommand("search", "Searches for a track");
  std::string searchFile;
  search_sub
      ->add_option("file", searchFile, "Filepath to the audio clip to search")
      ->required();
  std::string searchConfigPath = SHABAM_DEFAULT_CONFIG_FILE;
  add_common_options(search_sub, searchConfigPath);
  search_sub->callback(
      [&]() { shabam::search_handler(searchFile, searchConfigPath); });

  CLI11_PARSE(app, argc, argv);

  return 0;
}