#!/bin/bash

# Parameters
# $1: The database host
# $2: The database database
# $3: The database user
# $4: The database password
# $5: The database port

SCRIPTS_DIR="$(pwd)/scripts"

# Include the run_container function
source "$SCRIPTS_DIR/functions/run_container.sh"

# Start up the container with the bash running interactively
run_container "bash" "$1" "$2" "$3" "$4" "$5"
