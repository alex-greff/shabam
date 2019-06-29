#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Include the common env script
source "$SCRIPT_DIR/common_env.sh"

# Build the container
docker build -t $IMAGE_NAME .