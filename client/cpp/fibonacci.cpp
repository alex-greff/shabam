#include <emscripten.h>

// This avoids C++'s name mangling
extern "C" {
    int fib(int n);
}

EMSCRIPTEN_KEEPALIVE
int fib(int n) {
    int i, t, a = 0, b = 1;
    for (i = 0; i < n; i++) {
        t = a + b;
        a = b;
        b = t;
    }
    return b;
}