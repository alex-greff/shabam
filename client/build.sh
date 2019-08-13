set -e # -e exit immediately if non-zero exit code occurs 

# -------------
# --- Setup ---
# -------------

# Setup emsdk environment variables
source /emsdk/emsdk_env.sh --build=Release;

# ---------------------------------
# --- Build KFR with emscripten ---
# ---------------------------------

echo "Building KFR library with emscripten..."

cd /kfr

rm -rf ./build_emscripten
mkdir ./build_emscripten
cd ./build_emscripten

emconfigure cmake -DENABLE_TESTS=OFF -DCMAKE_CXX_COMPILER=clang++-4.0 -DCMAKE_BUILD_TYPE=Release ..

emmake make -j

echo "KFR compiled!"


# ----------------------
# --- Build app code ---
# ----------------------

echo "Building app code..."

# Ensure the needed directories for the build step exist
mkdir -p /app/wasm /app/build_temp

cd /app

# Compile the code
make

# Clean the compilation
make clean

echo "App code compiled!"