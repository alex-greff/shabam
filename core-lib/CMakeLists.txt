cmake_minimum_required(VERSION 3.14)
include(ExternalProject)
project(shabam_corelib)

option(USE_CLI11_FULL "Use CLI11 full installation over single file" ON)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(EXTERNAL_DIR ${CMAKE_CURRENT_SOURCE_DIR}/external)
set(SINGLE_FILE_DIR ${EXTERNAL_DIR}/single-file)

set(SHABAM_CLI_TARGET shabam-cli)
set(SHABAM_TESTS_TARGET shabam-tests)

set(COMMON_SOURCES src/subcommand_handlers.cpp src/preprocessing.cpp src/config/toml-config.cpp)
set(CLI_SOURCES src/cli.cpp ${COMMON_SOURCES})
set(TESTS_SOURCES src/test.cpp ${COMMON_SOURCES})

add_executable(${SHABAM_CLI_TARGET} ${CLI_SOURCES})
add_executable(${SHABAM_TESTS_TARGET} ${TESTS_SOURCES})

# Copy the default config file to the build directory
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/config/shabam-config.toml ${CMAKE_BINARY_DIR}/shabam-config.toml COPYONLY)

# --- Catch2 installation ---
# Source: https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md#top
add_subdirectory(${EXTERNAL_DIR}/Catch2)
target_link_libraries(${SHABAM_TESTS_TARGET} PRIVATE Catch2::Catch2WithMain)

# --- CLI11 installation ---
if(USE_CLI11_FULL)
  # CLI11 full edition installation (recommended)
  # Source: https://cliutils.github.io/CLI11/book/chapters/installation.html
  set(CLI11_PRECOMPILED ON)
  target_link_libraries(${SHABAM_CLI_TARGET} INTERFACE CLI11:CLI11)
  target_include_directories(${SHABAM_CLI_TARGET} PRIVATE ${EXTERNAL_DIR}/CLI11/include)
  target_compile_definitions(${SHABAM_CLI_TARGET} PRIVATE USE_CLI11_FULL=1)
else()
  # CLI11 single file installation
  # Sources:
  # - https://cliutils.github.io/CLI11/book/chapters/installation.html
  # - https://stackoverflow.com/a/13703725
  # Add another source after the executable declaration
  # Source: https://stackoverflow.com/a/34533415
  target_sources(${SHABAM_CLI_TARGET} PRIVATE ${SINGLE_FILE_DIR}/CLI11.hpp)
  target_include_directories(${SHABAM_CLI_TARGET} PRIVATE ${SINGLE_FILE_DIR})
  target_compile_definitions(${SHABAM_CLI_TARGET} PRIVATE USE_CLI11_FULL=0)
endif(USE_CLI11_FULL)

unset(USE_CLI11_FULL CACHE)

# --- AudioFile installation ---
add_library(audio-file INTERFACE)
target_include_directories(audio-file INTERFACE ${EXTERNAL_DIR}/AudioFile)
target_link_libraries(${SHABAM_CLI_TARGET} PRIVATE audio-file)
target_link_libraries(${SHABAM_TESTS_TARGET} PRIVATE audio-file)

# --- liquid-dsp installation ---
# Sources:
# - https://github.com/jgaeddert/liquid-dsp/pull/40#issuecomment-2262089630
# - https://liquidsdr.org/doc/installation/
set(LIQUID_DIR ${EXTERNAL_DIR}/liquid-dsp)
ExternalProject_Add(liquid-dsp-project
    SOURCE_DIR ${LIQUID_DIR}
    BUILD_IN_SOURCE TRUE
    CONFIGURE_COMMAND ${LIQUID_DIR}/bootstrap.sh
        COMMAND ${LIQUID_DIR}/configure
            --prefix=${CMAKE_BINARY_DIR}/liquid-dsp
            --enable-fftoverride
            CFLAGS=${CMAKE_C_FLAGS}
            CPPFLAGS=${CMAKE_C_FLAGS}
            CXXFLAGS=${CMAKE_CXX_FLAGS}
            LDFLAGS=${CMAKE_EXE_LINKER_FLAGS}
    INSTALL_COMMAND ""
    BUILD_BYPRODUCTS ${LIQUID_DIR}/libliquid.a
    BUILD_ALWAYS TRUE
)
add_library(liquid-dsp STATIC IMPORTED GLOBAL)
add_dependencies(liquid-dsp liquid-dsp-project)
set_target_properties(liquid-dsp PROPERTIES
    IMPORTED_LOCATION ${LIQUID_DIR}/libliquid.a
)
target_include_directories(liquid-dsp INTERFACE
    $<BUILD_INTERFACE:${LIQUID_DIR}/include>
    $<INSTALL_INTERFACE:${LIQUID_DIR}/include/liquid>
)
target_link_libraries(liquid-dsp INTERFACE m)
# Link to targets
target_link_libraries(${SHABAM_CLI_TARGET} PRIVATE liquid-dsp)
target_link_libraries(${SHABAM_TESTS_TARGET} PRIVATE liquid-dsp)
# Include liquid-dsp headers
target_include_directories(${SHABAM_CLI_TARGET} PRIVATE ${LIQUID_DIR}/include)
target_include_directories(${SHABAM_TESTS_TARGET} PRIVATE ${LIQUID_DIR}/include)
# Suppress compiler warnings from liquid-dsp
# Source: https://stackoverflow.com/a/53981293
target_include_directories(${SHABAM_CLI_TARGET} SYSTEM PRIVATE ${LIQUID_DIR}/include)
target_include_directories(${SHABAM_CLI_TARGET} SYSTEM PRIVATE ${LIQUID_DIR}/include)

add_dependencies(${SHABAM_CLI_TARGET} liquid-dsp)
add_dependencies(${SHABAM_TESTS_TARGET} liquid-dsp)

# --- toml++ installation ---
add_library(tomlplusplus INTERFACE)
target_include_directories(tomlplusplus INTERFACE ${EXTERNAL_DIR}/tomlplusplus/include)
target_link_libraries(${SHABAM_CLI_TARGET} PRIVATE tomlplusplus)
target_link_libraries(${SHABAM_TESTS_TARGET} PRIVATE tomlplusplus)

# --- termcolor installation ---
add_library(termcolor INTERFACE)
target_include_directories(termcolor INTERFACE ${EXTERNAL_DIR}/termcolor/include)
target_link_libraries(${SHABAM_CLI_TARGET} PRIVATE termcolor)
target_link_libraries(${SHABAM_TESTS_TARGET} PRIVATE termcolor)