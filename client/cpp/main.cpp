#include <emscripten.h>
#include "fibonacci.hpp"

// This avoids C++'s name mangling
extern "C" {
    int test(int n);
}


EMSCRIPTEN_KEEPALIVE
int test(int n) {
    return fib(n);
}