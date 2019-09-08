#!/bin/bash

SCRIPTS_DIR="$(pwd)/scripts"

# Include the run_container function
source "$SCRIPTS_DIR/functions/run_container.sh"

# Start up the container with the bash running interactively
run_container "bash" $1
