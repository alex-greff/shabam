cmake_minimum_required(VERSION 3.14)
include(ExternalProject)
project(shabam_corelib)

option(USE_CLI11_FULL "Use CLI11 full installation over single file" ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(EXTERNAL_DIR external)
set(SINGLE_FILE_DIR ${EXTERNAL_DIR}/single-file)

set(SHABAM_SOURCES src/cli.cpp)
set(TESTS_SOURCES src/test.cpp)

# Catch2 installation
# Source: https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md#top
add_subdirectory(${EXTERNAL_DIR}/Catch2)
add_executable(tests ${TESTS_SOURCES})
target_link_libraries(tests PRIVATE Catch2::Catch2WithMain)


if(USE_CLI11_FULL)
  # CLI11 full edition installation (recommended)
  # Source: https://cliutils.github.io/CLI11/book/chapters/installation.html
  set(CLI11_PRECOMPILED ON)
  add_executable(shabam ${SHABAM_SOURCES})
  target_link_libraries(shabam INTERFACE CLI11:CLI11)
  target_include_directories(shabam PRIVATE ${EXTERNAL_DIR}/CLI11/include)
  target_compile_definitions(shabam PRIVATE USE_CLI11_FULL=1)
else()
  # CLI11 single file installation
  # Sources:
  # - https://cliutils.github.io/CLI11/book/chapters/installation.html
  # - https://stackoverflow.com/a/13703725
  add_executable(shabam ${SHABAM_SOURCES} ${SINGLE_FILE_DIR}/CLI11.hpp)
  target_include_directories(shabam PRIVATE ${SINGLE_FILE_DIR})
  target_compile_definitions(shabam PRIVATE USE_CLI11_FULL=0)
endif(USE_CLI11_FULL)

unset(USE_CLI11_FULL CACHE)

# Install liquid-dsp
# Sources:
# - https://github.com/jgaeddert/liquid-dsp/pull/40#issuecomment-2262089630
# - https://liquidsdr.org/doc/installation/
ExternalProject_Add(liquid-dsp-project
    SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/external/liquid-dsp
    BUILD_IN_SOURCE TRUE
    CONFIGURE_COMMAND ${CMAKE_CURRENT_SOURCE_DIR}/external/liquid-dsp/bootstrap.sh
        COMMAND ${CMAKE_CURRENT_SOURCE_DIR}/external/liquid-dsp/configure
            --prefix=${CMAKE_BINARY_DIR}/liquid-dsp
            --enable-fftoverride
            CFLAGS=${CMAKE_C_FLAGS}
            CPPFLAGS=${CMAKE_C_FLAGS}
            CXXFLAGS=${CMAKE_CXX_FLAGS}
            LDFLAGS=${CMAKE_EXE_LINKER_FLAGS}
    INSTALL_COMMAND ""
    BUILD_BYPRODUCTS ${CMAKE_CURRENT_SOURCE_DIR}/external/liquid-dsp/libliquid.a
    BUILD_ALWAYS TRUE
)
add_library(liquid-dsp STATIC IMPORTED GLOBAL)
add_dependencies(liquid-dsp liquid-dsp-project)
set_target_properties(liquid-dsp PROPERTIES
    IMPORTED_LOCATION ${CMAKE_CURRENT_SOURCE_DIR}/external/liquid-dsp/libliquid.a
)
target_include_directories(liquid-dsp INTERFACE
    $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/external/liquid-dsp/include>
    $<INSTALL_INTERFACE:${CMAKE_BINARY_DIR}/liquid-dsp/include/liquid>
)
target_link_libraries(liquid-dsp INTERFACE m)
# Include liquid-dsp headers
target_include_directories(shabam PRIVATE ${EXTERNAL_DIR}/liquid-dsp/include)
target_include_directories(tests PRIVATE ${EXTERNAL_DIR}/liquid-dsp/include)
# Suppress compiler warnings from liquid-dsp
# Source: https://stackoverflow.com/a/53981293
target_include_directories(shabam SYSTEM PRIVATE ${EXTERNAL_DIR}/liquid-dsp/include)
target_include_directories(shabam SYSTEM PRIVATE ${EXTERNAL_DIR}/liquid-dsp/include)

add_dependencies(shabam liquid-dsp)
add_dependencies(tests liquid-dsp)