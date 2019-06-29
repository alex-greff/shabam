#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Include the common env script
source "$SCRIPT_DIR/functions/run_container.sh"

# Start up the container with the bash running interactively
run_container "bash /app/scripts/initialize_schema.sh"
