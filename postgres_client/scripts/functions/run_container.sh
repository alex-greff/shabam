#!/bin/bash

# Runs the container with the given command

# Parameters:
# $1: The command to run
# $2: The database host
# $3: The database database
# $4: The database user
# $5: The database password
# $6: The database port
run_container() {
    CURR_DIR=`pwd`
    SCRIPTS_DIR="$(pwd)/scripts"

    # Include the common env script
    source "$SCRIPTS_DIR/common_env.sh"

    generate_set_container_env "$2" "$3" "$4" "$5" "$6"

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
    docker run -it -v "/$CURR_DIR/app:/app" --network shabam_app-network $IMAGE_NAME bash -c "$START_CMD"
}