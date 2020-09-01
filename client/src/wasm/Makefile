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

SRC = /app/src/wasm/src
TEMP = /app/src/wasm/build_temp
OUT = /app/src/wasm/build

# --- Compile steps ---

# Note: there's a hack here where I prepend the following into main-wasm.js
# 1. "var document = {};" to allow for it to be loaded in a web-worker where document does not exist

# Fingerprint compile code

fingerprint.js : fingerprint.bc fp_initializers.bc fp_generator.bc 
	$(CC) $(OPT_LEVEL) \
		$(TEMP)/fingerprint.bc \
		$(TEMP)/fp_initializers.bc \
		$(TEMP)/fp_generator.bc \
		$(COMMON_FLAGS) $(ROOT_FLAGS) \
		-o $(OUT)/$@
	sed -i.old '1s;^;var document = {}\;;' $(OUT)/$@ 

fingerprint.bc : $(SRC)/fingerprint.cpp
	$(CC) $(OPT_LEVEL) $(SRC)/fingerprint.cpp -c $(COMMON_FLAGS) -o $(TEMP)/$@

fp_initializers.bc : $(SRC)/fp_initializers.cpp $(SRC)/fp_initializers.hpp
	$(CC) $(OPT_LEVEL) $(SRC)/fp_initializers.cpp -c $(COMMON_FLAGS) -o $(TEMP)/$@

fp_generator.bc : $(SRC)/fp_generator.cpp $(SRC)/fp_generator.hpp
	$(CC) $(OPT_LEVEL) $(SRC)/fp_generator.cpp -c $(COMMON_FLAGS) -o $(TEMP)/$@


# --- Cleanup ---

clean:
	rm -f $(TEMP_DIR)/*.bc