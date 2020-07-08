# Compiles the cpp code to WASM

# Note:
# $@ is the left side of the :
# $^ is the right side of the :

# --- Environment variables ---
CC = emcc

ROOT_FLAGS = \
	-s WASM=1 \
	-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s MODULARIZE=1 \
	-s ENVIRONMENT=web \
	-s BUILD_AS_WORKER=1 \
	-s FILESYSTEM=0	\
	# -s EXPORT_ES6=1 \

COMMON_FLAGS = \
	-std=c++14 \

OPT_LEVEL = -O2

SOURCE_DIR = /app/src/wasm/src
TEMP_DIR = /app/src/wasm/build_temp
OUT_DIR = /app/src/wasm/build

# --- Compile steps ---

# Note: there's a hack here where I prepend the following into main-wasm.js
# 1. "var document = {};" to allow for it to be loaded in a web-worker where document does not exist

# Fingerprint compile code

fingerprint.js : fingerprint.bc
	$(CC) $(OPT_LEVEL) $(TEMP_DIR)/fingerprint.bc $(COMMON_FLAGS) $(ROOT_FLAGS) -o $(OUT_DIR)/$@
	sed -i.old '1s;^;var document = {}\;;' $(OUT_DIR)/$@ 

fingerprint.bc : $(SOURCE_DIR)/fingerprint.cpp
	$(CC) $(OPT_LEVEL) $(SOURCE_DIR)/fingerprint.cpp $(COMMON_FLAGS) -o $(TEMP_DIR)/$@

# Temp compile code, TODO: remove
main-wasm.js : main.bc
	$(CC) $(OPT_LEVEL) $(TEMP_DIR)/main.bc $(COMMON_FLAGS) $(ROOT_FLAGS) -o $(OUT_DIR)/$@
	sed -i.old '1s;^;var document = {}\;;' $(OUT_DIR)/$@ 

main.bc : $(SOURCE_DIR)/main.cpp fibonacci.bc
	$(CC) $(OPT_LEVEL) $(SOURCE_DIR)/main.cpp $(TEMP_DIR)/fibonacci.bc $(COMMON_FLAGS) -o $(TEMP_DIR)/$@

fibonacci.bc : $(SOURCE_DIR)/fibonacci.cpp $(SOURCE_DIR)/fibonacci.hpp
	$(CC) $(OPT_LEVEL) $(SOURCE_DIR)/fibonacci.cpp $(COMMON_FLAGS) -o $(TEMP_DIR)/$@

# --- Cleanup ---

clean:
	rm -f $(TEMP_DIR)/*.bc