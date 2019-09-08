#!/bin/bash

# Runs the container with the given command

# Parameters:
# $1: The command to run
# $2: The database name
run_container() {
    CURR_DIR=`pwd`
    SCRIPTS_DIR="$(pwd)/scripts"

    # Include the common env script
    source "$SCRIPTS_DIR/common_env.sh"

    generate_set_container_env $2

    # Start command
    read -d '' START_CMD << EOF
        # Set environement variables in container
        $SET_CONTAINER_ENV; 

        # Convert all the files in app to Unix-style endings (hide the output of the command)
        find /app -type f -print0 | xargs -0 dos2unix &>/dev/null; 

        # Run the given command
        $1
EOF

    # Run the container
    docker run -it -v "/$CURR_DIR/app:/app" $IMAGE_NAME bash -c "$START_CMD"
}