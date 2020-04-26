SCRIPTS_DIR="$(pwd)/scripts"

# Incoming parameters:
# $1: the container path to the execution script
# $2: The database host
# $3: The database database
# $4: The database user
# $5: The database password
# $6: The database port

# Include the run_container function
source "$SCRIPTS_DIR/functions/run_container.sh"

# Include the confirmation_prompt function
source "$SCRIPTS_DIR/functions/confirmation_prompt.sh"

WARNING_PROMPT="\e[31mDANGER ZONE:\e[0m running this will reset all tables and data. Run this command?"
ACCEPTANCE_COMMAND="run_container 'bash $1' $2 $3 $4 $5 $6"
REJECTION_COMMAND='echo Cancelled schema initialization'

# Start up the container with the bash running interactively
confirmation_prompt "$WARNING_PROMPT" "$ACCEPTANCE_COMMAND" "$REJECTION_COMMAND"