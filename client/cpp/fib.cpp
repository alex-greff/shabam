#include "fib.h"

int fib(int x) {
    if (x < 1)
        return 0;
    if (x == 1)
        return 1;
    return fib(x - 1) + fib(x - 2);
}