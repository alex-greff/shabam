# Compiles the cpp code + the KFR DSP library into WASM

# Note:
# $@ is the left side of the :
# $^ is the right side of the :

# --- Environment variables ---
CC = em++

ROOT_FLAGS = \
	-s WASM=1 \
	-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s MODULARIZE=1 \
	-s ENVIRONMENT=web \
	-s FILESYSTEM=0	\

COMMON_FLAGS = \
	-std=c++14 \
	# -I/kfr/include


OPT_LEVEL = -O1

SOURCE_DIR = /app/cpp
TEMP_DIR = /app/build_temp
OUT_DIR = /app/wasm
# KFR_DIR = /kfr/include/kfr

KFR_ARCHIVES = \
	/kfr/build_emscripten/libkfr_dft.a \
	/kfr/build_emscripten/libkfr_io.a


# --- Compile steps ---

main-wasm.js : main.bc
	$(CC) $(OPT_LEVEL) $(TEMP_DIR)/main.bc $(KFR_ARCHIVES) $(COMMON_FLAGS) $(ROOT_FLAGS) -o $(OUT_DIR)/$@

main.bc : $(SOURCE_DIR)/main.cpp fibonacci.bc
	$(CC) $(OPT_LEVEL) $(SOURCE_DIR)/main.cpp $(TEMP_DIR)/fibonacci.bc $(COMMON_FLAGS) -o $(TEMP_DIR)/$@

fibonacci.bc : $(SOURCE_DIR)/fibonacci.cpp $(SOURCE_DIR)/fibonacci.hpp
	$(CC) $(OPT_LEVEL) $(SOURCE_DIR)/fibonacci.cpp $(COMMON_FLAGS) -o $(TEMP_DIR)/$@

# --- Cleanup ---

clean:
	rm -f $(TEMP_DIR)/*.bc