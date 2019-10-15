#!/bin/bash

SCRIPTS_DIR="/app/scripts"
MAIN_DB_DIR="$SCRIPTS_DIR/db/main"

# Include the run_query function
source "$SCRIPTS_DIR/functions/run_query.sh"

# Store initialize schema sql script
SCHEMA_INIT_QUERY=`cat "$MAIN_DB_DIR/initialize_schema.pgsql"`

run_query "$SCHEMA_INIT_QUERY"