#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Include the run_container function
source "$SCRIPT_DIR/functions/run_container.sh"

# Start up the container with the bash running interactively
run_container "bash"
