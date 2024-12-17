cmake_minimum_required(VERSION 3.14)
project(shabam_corelib)

option(USE_CLI11_FULL "Use CLI11 full installation over single file" ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(EXTERNAL_DIR external)
set(SINGLE_FILE_DIR ${EXTERNAL_DIR}/single-file)

# Catch2 installation
# Source: https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md#top
add_subdirectory(${EXTERNAL_DIR}/Catch2)
add_executable(tests src/test.cpp)
target_link_libraries(tests PRIVATE Catch2::Catch2WithMain)


if(USE_CLI11_FULL)
  # CLI11 full edition installation (recommended)
  # Source: https://cliutils.github.io/CLI11/book/chapters/installation.html
  set(CLI11_PRECOMPILED ON)
  add_executable(shabam src/cli.cpp)
  target_link_libraries(shabam INTERFACE CLI11:CLI11)
  target_include_directories(shabam PRIVATE ${EXTERNAL_DIR}/CLI11/include)
  target_compile_definitions(shabam PRIVATE USE_CLI11_FULL=1)
else()
  # CLI11 single file installation
  # Sources:
  # - https://cliutils.github.io/CLI11/book/chapters/installation.html
  # - https://stackoverflow.com/a/13703725
  set(SHABAM_SOURCES src/cli.cpp ${SINGLE_FILE_DIR}/CLI11.hpp)
  add_executable(shabam ${SHABAM_SOURCES})
  target_include_directories(shabam PRIVATE ${SINGLE_FILE_DIR})
  target_compile_definitions(shabam PRIVATE USE_CLI11_FULL=0)
endif(USE_CLI11_FULL)


unset(USE_CLI11_FULL CACHE)
