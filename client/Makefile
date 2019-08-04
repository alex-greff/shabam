# Compiles the cpp code + the KFR DSP library into WASM

# Note:
# $@ is the left side of the :
# $^ is the right side of the :

# --- Environment variables ---
CC = em++

MAIN_FLAGS = \
	-s WASM=1 \
	-s ONLY_MY_CODE=1 \
	-s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
	-s ALLOW_MEMORY_GROWTH=1 \
	-s MODULARIZE=1

SOURCE_DIR = /app/cpp
OUT_DIR = /app/wasm


# --- Compile steps ---

main.wasm : main.bc
	$(CC) -O1 $^ $(MAIN_FLAGS) -o $(OUT_DIR)/$@

main.bc : $(SOURCE_DIR)/main.cpp fibonacci.bc
	$(CC) -O1 $^ -o $@

fibonacci.bc : $(SOURCE_DIR)/fibonacci.cpp $(SOURCE_DIR)/fibonacci.hpp
	$(CC) -O1 $(SOURCE_DIR)/fibonacci.cpp -o $@