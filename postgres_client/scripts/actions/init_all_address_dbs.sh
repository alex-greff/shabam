#!/bin/bash

# Initializes all the address databases
# Note: will say yes to all the confirmation dialogs

# Parameters:
# $1: total number of address databases
# $2: skip warning prompt

SCRIPTS_DIR="$(pwd)/scripts"

# Include the run_container function
source "$SCRIPTS_DIR/functions/run_container.sh"

# Include the confirmation_prompt function
source "$SCRIPTS_DIR/functions/confirmation_prompt.sh"

NUM_ADDRESS_DBS="$1"
SKIP_PROMPT="$2"

WARNING_PROMPT="\e[31mDANGER ZONE:\e[0m running this will reset all tables and data of all address databases. Run this command?"
ACCEPTANCE_COMMAND="for i in \$(seq 0 `expr "$NUM_ADDRESS_DBS" - 1`); do bash ./scripts/actions/init_address_db.sh "\""\$i"\"" 'true'; done"
REJECTION_COMMAND='echo Cancelled schema initialization'

if [ "$SKIP_PROMPT" = true ]; then
  eval "$ACCEPTANCE_COMMAND"
else
  # Start up the container with the bash running interactively
  confirmation_prompt "$WARNING_PROMPT" "$ACCEPTANCE_COMMAND" "$REJECTION_COMMAND"
fi