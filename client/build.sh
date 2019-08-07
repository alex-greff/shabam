set -e # -e exit immediately if non-zero exit code occurs 

source /emsdk/emsdk_env.sh --build=Release;

# Ensure the needed directories for the build step exist
mkdir -p /app/wasm /app/build_temp

cd /app

# Compile the code
make

# Clean the compilation
make clean