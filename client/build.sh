source /emsdk/emsdk_env.sh --build=Release;

# Create the wasm directory, if it does not already exist
mkdir -p /app/wasm

# TODO: compile actual code
# Note: -O3 mangles the function name, -O1 doesnt seem to though
em++ -O1 \
    /app/cpp/fingerprint.cpp /app/cpp/fibonacci.cpp \
    -s WASM=1 \
    -s ONLY_MY_CODE=1 \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -o /app/wasm/fingerprint.wasm