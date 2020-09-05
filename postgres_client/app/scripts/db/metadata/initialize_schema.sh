#!/bin/bash

SCRIPTS_DIR="/app/scripts"
DB_DIR="$SCRIPTS_DIR/db/metadata"

# Include the run_query function
source "$SCRIPTS_DIR/functions/run_query.sh"

# Store initialize schema sql script
SCHEMA_INIT_QUERY=`cat "$DB_DIR/initialize_schema.pgsql"`

run_query "$SCHEMA_INIT_QUERY"