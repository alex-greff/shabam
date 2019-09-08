#!/bin/bash

SCRIPTS_DIR="$(pwd)/scripts"

# Include the common env script
source "$SCRIPTS_DIR/common_env.sh"

# Build the container
docker build -t $IMAGE_NAME .