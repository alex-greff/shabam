#include <emscripten.h>
#include<iostream>
#include "fibonacci.hpp"
// #include <kfr/dft.hpp>

// This avoids C++'s name mangling
extern "C" {
    int test(int n);
}


EMSCRIPTEN_KEEPALIVE
int test(int n) {
    std::cout << "Hello World" << std::endl;
    // printf("Sup\n");
    return fib(n);
}