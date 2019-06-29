#!/bin/bash

CURR_DIR=`pwd`
SCRIPT_DIR="$(dirname "$0")"

# Include the common env script
source "$SCRIPT_DIR/common_env.sh"


# Start command
read -d '' START_CMD << EOF
    $SET_CONTAINER_ENV;
    bash
EOF

# Run the container
docker run -it -v "/$CURR_DIR/app:/app" $IMAGE_NAME bash -c "$START_CMD"