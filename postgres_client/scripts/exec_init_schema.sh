#!/bin/bash

SCRIPTS_DIR="$(pwd)/scripts"

# Incoming parameters:
# $1: skip warning prompt
# $2: the container path to the execution script
# $3: The database host
# $4: The database database
# $5: The database user
# $6: The database password
# $7: The database port

# Include the run_container function
source "$SCRIPTS_DIR/functions/run_container.sh"

# Include the confirmation_prompt function
source "$SCRIPTS_DIR/functions/confirmation_prompt.sh"

SKIP_PROMPT="$1"

WARNING_PROMPT="\e[31mDANGER ZONE:\e[0m running this will reset all tables and data. Run this command?"
ACCEPTANCE_COMMAND="run_container 'bash $2' $3 $4 $5 $6 $7"
REJECTION_COMMAND='echo Cancelled schema initialization'

if [ "$SKIP_PROMPT" = true ]; then
  eval "$ACCEPTANCE_COMMAND"
else
  # Start up the container with the bash running interactively
  confirmation_prompt "$WARNING_PROMPT" "$ACCEPTANCE_COMMAND" "$REJECTION_COMMAND"
fi