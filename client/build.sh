source /emsdk/emsdk_env.sh --build=Release;

# Create the wasm directory, if it does not already exist
mkdir -p /app/wasm


cd /app

# Compile the code
make
