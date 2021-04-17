#!/bin/bash

# Founds all the lines of code in the entire project

find . \
  -name 'override-styles' -prune -false \
  -o -name 'build' -prune -false \
  -o -name 'dist' -prune -false \
  -o -name 'server-old' -prune -false \
  -o -name 'client-old' -prune -false \
  -o -name 'client-vue-ts-old' -prune -false \
  -o -name 'identification_worker' -prune -false \
  -o -name 'fingerprint_worker' -prune -false \
  -o -name 'records_worker' -prune -false \
  -o -name 'server-old' -prune -false \
  -o -name '*.tsx' \
  -o -name '*.js' \
  -o -name '*.ts' \
  -a ! -name '*.g.d.ts' \
  -o -name '*.scss' \
  -o -name '*.cpp' \
  -o -name '*.hpp' | xargs wc -l

