#if USE_CLI11_FULL == 1
#include <CLI/CLI.hpp>
#else
#include <CLI11.hpp>
#endif
#include "subcommand_handlers.hpp"
#include <iostream>

int main(int argc, char **argv) {
  CLI::App app{"The Shabam CLI"};
  argv = app.ensure_utf8(argv);

  auto add_sub = app.add_subcommand("add", "Adds a track");
  std::string addFile;
  add_sub->add_option("file", addFile, "Filepath to the track to add");
  std::string name;
  add_sub->add_option("name", name, "The name of the track");
  add_sub->callback([&]() { shabam::add_handler(addFile, name); });

  auto search_sub = app.add_subcommand("search", "Searches for a track");
  std::string searchFile;
  search_sub->add_option("file", searchFile,
                        "Filepath to the audio clip to search");
  search_sub->callback([&]() { shabam::search_handler(searchFile); });

  CLI11_PARSE(app, argc, argv);

  return 0;
}