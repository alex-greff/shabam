cmake_minimum_required(VERSION 3.14)
project(shabam_corelib)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Catch2 installation
# Source: https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md#top
add_subdirectory(lib/Catch2)
add_executable(tests src/test.cpp)
target_link_libraries(tests PRIVATE Catch2::Catch2WithMain)