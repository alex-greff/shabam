#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Include the run_container function
source "$SCRIPT_DIR/functions/run_container.sh"

# Include the confirmation_prompt function
source "$SCRIPT_DIR/functions/confirmation_prompt.sh"

WARNING_PROMPT="\e[31mDANGER ZONE:\e[0m running this will reset all tables and data. Run this command?"
ACCEPTANCE_COMMAND='run_container "bash /app/scripts/initialize_schema.sh"'
REJECTION_COMMAND='echo Cancelled schema initialization'

# Start up the container with the bash running interactively
confirmation_prompt "$WARNING_PROMPT" "$ACCEPTANCE_COMMAND" "$REJECTION_COMMAND"
