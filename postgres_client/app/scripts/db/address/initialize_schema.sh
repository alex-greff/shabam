#!/bin/bash

SCRIPTS_DIR="/app/scripts"

# Include the run_query function
source "$SCRIPTS_DIR/functions/run_query.sh"

# Start command
read -d '' SCHEMA_INIT_QUERY << EOF
    -- address table
    DROP TABLE IF EXISTS address CASCADE;
    CREATE TABLE address(
        address_id SERIAL PRIMARY KEY,
        address_enc INTEGER NOT NULL,
        couple_enc BIGINT NOT NULL
    );
EOF

# TODO: uncomment
# run_query "$SCHEMA_INIT_QUERY"

# TODO: complete
echo "TODO: complete address database schema initialization"