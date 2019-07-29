source /emsdk/emsdk_env.sh --build=Release;

# em++ /app/cpp/hello.cpp /app/cpp/fib.cpp -s WASM=1 -s ONLY_MY_CODE=1 -s EXPORT_ALL=1 -o /app/wasm/hello.js

emcc /app/cpp/test.c -s WASM=1 -s ONLY_MY_CODE=1 -s EXPORTED_FUNCTIONS="['_bezier1']" -o /app/wasm/test.js