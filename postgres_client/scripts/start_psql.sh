#!/bin/bash

SCRIPT_DIR="$(dirname "$0")"

# Include the run_container function
source "$SCRIPT_DIR/functions/run_container.sh"

# Commands to connect to the postgres database
CONNECT_PSQL_COMMAND='export PG_PASSWORD="$PG_PASSWORD"; psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" "$PG_DATABASE"'

# Start up the container with the bash running interactively
run_container "$CONNECT_PSQL_COMMAND"
