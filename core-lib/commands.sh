#!/bin/bash

rm tests/data/sine_test.wav.cache.bson; npm run build:native && npm run test:memory-engine
npm run build:native && npm run test:memory-engine