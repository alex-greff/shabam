source /emsdk/emsdk_env.sh --build=Release;

# Create the wasm directory, if it does not already exist
mkdir -p /app/wasm

# em++ /app/cpp/hello.cpp /app/cpp/fib.cpp -s WASM=1 -s ONLY_MY_CODE=1 -s EXPORT_ALL=1 -o /app/wasm/hello.js

# emcc /app/cpp/test.c -s WASM=1 -s ONLY_MY_CODE=1 -s EXPORTED_FUNCTIONS="['_bezier1']" -o /app/wasm/test.js

# emcc --bind -o /app/wasm/quick_example.js /app/cpp/quick_example.cpp




# emcc -O3 -s WASM=1 -s ONLY_MY_CODE=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -s EXPORT_NAME="fibonacci" -o /app/wasm/fibonacci.js /app/cpp/fibonacci.c

# Note: -O3 mangles the function name, -O1 doesnt seem to though
emcc -O1 -s WASM=1 -s ONLY_MY_CODE=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -s ALLOW_MEMORY_GROWTH=1 -s MODULARIZE=1 -o /app/wasm/fibonacci.js /app/cpp/fibonacci.c
