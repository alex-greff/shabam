#if USE_CLI11_FULL==1
#include <CLI/CLI.hpp>
#else
#include <CLI11.hpp>
#endif
#include <iostream>

int main(int argc, char** argv) {
    CLI::App app{"App description"};
    argv = app.ensure_utf8(argv);

    std::string filename = "default";
    app.add_option("-f,--file", filename, "A help string");

    CLI11_PARSE(app, argc, argv);

#if USE_CLI11_FULL==1
  std::cout << "hello world (full)! filename: " << filename << std::endl;
#else
  std::cout << "hello world (single file)! filename: " << filename << std::endl;
#endif

    return 0;
}