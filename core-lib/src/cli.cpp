#if USE_CLI11_FULL == 1
#include <CLI/CLI.hpp>
#else
#include <CLI11.hpp>
#endif
#include "subcommand_handlers.hpp"
#include <iostream>
#include <string>

#define SHABAM_DEFAULT_CONFIG_FILE "shabam-config.toml"
#define SHABAM_DEBUG_DEFAULT_VALUE false

void add_common_options(CLI::App *app, std::string &config, bool &debug) {
  app->add_option("--config, -c", config,
                  "The config file path. Defaults to \"shabam-config.toml\"");
  app->add_flag("--debug, -d", debug,
                  "Output the debug files. Defaults to false");
}

int main(int argc, char **argv) {
  CLI::App app{"The Shabam CLI"};
  argv = app.ensure_utf8(argv);

  // --- Add command ---
  auto add_sub = app.add_subcommand("add", "Adds a track");
  std::string add_sub_file;
  add_sub->add_option("file", add_sub_file, "Filepath to the track to add")
      ->required();
  std::string name;
  add_sub->add_option("name", name, "The name of the track")->required();
  std::string add_sub_config_path = SHABAM_DEFAULT_CONFIG_FILE;
  bool add_sub_debug = SHABAM_DEBUG_DEFAULT_VALUE;
  add_common_options(add_sub, add_sub_config_path, add_sub_debug);
  add_sub->callback([&]() {
    shabam::add_handler(add_sub_file, name, add_sub_config_path, add_sub_debug);
  });

  // --- Search command ---
  auto search_sub = app.add_subcommand("search", "Searches for a track");
  std::string search_sub_file;
  search_sub
      ->add_option("file", search_sub_file,
                   "Filepath to the audio clip to search")
      ->required();
  std::string search_sub_config_path = SHABAM_DEFAULT_CONFIG_FILE;
  bool search_sub_debug = SHABAM_DEBUG_DEFAULT_VALUE;
  add_common_options(search_sub, search_sub_config_path, search_sub_debug);
  search_sub->callback([&]() {
    shabam::search_handler(search_sub_file, search_sub_config_path,
                           search_sub_debug);
  });

  CLI11_PARSE(app, argc, argv);

  return 0;
}