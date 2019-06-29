#!/bin/bash

CURR_DIR=`pwd`
SCRIPT_DIR="$(dirname "$0")"

# Include the common env script
source "$SCRIPT_DIR/common_env.sh"

# Start command
read -d '' START_CMD << EOF
    # Set environement variables in container
    $SET_CONTAINER_ENV; 

    # Convert all the files in app to Unix-style endings (hide the output of the command)
    find /app -type f -print0 | xargs -0 dos2unix &>/dev/null; 

    # Run interactive bash shell
    bash;
EOF

# Run the container
docker run -it -v "/$CURR_DIR/app:/app" $IMAGE_NAME bash -c "$START_CMD"