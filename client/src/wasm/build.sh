set -e # -e exit immediately if non-zero exit code occurs 

# -------------
# --- Setup ---
# -------------

# Setup emsdk environment variables
source /emsdk_portable/emsdk_env.sh --build=Release;

# ----------------------
# --- Build app code ---
# ----------------------

echo "Building wasm code..."

# Ensure the needed directories for the build step exist
mkdir -p /app/src/wasm/build /app/src/wasm/build_temp

cd /app/src/wasm

# Compile the code
make

# Clean the compilation
make clean

echo "Wasm code compiled!"