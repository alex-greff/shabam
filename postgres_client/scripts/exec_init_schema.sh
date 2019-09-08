SCRIPTS_DIR="$(pwd)/scripts"

# Incoming parameters:
# $1: the container path to the execution script
# $2: the database name

# Include the run_container function
source "$SCRIPTS_DIR/functions/run_container.sh"

# Include the confirmation_prompt function
source "$SCRIPTS_DIR/functions/confirmation_prompt.sh"

WARNING_PROMPT="\e[31mDANGER ZONE:\e[0m running this will reset all tables and data. Run this command?"
ACCEPTANCE_COMMAND="run_container 'bash $1' $2"
REJECTION_COMMAND='echo Cancelled schema initialization'

# Start up the container with the bash running interactively
confirmation_prompt "$WARNING_PROMPT" "$ACCEPTANCE_COMMAND" "$REJECTION_COMMAND"