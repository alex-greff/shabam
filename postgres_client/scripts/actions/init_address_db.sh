#!/bin/bash

# Initializes an address database schema

# Parameters:
# $1: current address database number
# $2: skip warning prompt

INIT_CMD='/app/scripts/db/address/initialize_schema.sh'
HOST="db-address-$1"
DATABASE='postgres'
USER='postgres'
PASSWORD='development'
PORT=5432

bash ./scripts/exec_init_schema.sh "$2" "$INIT_CMD" "$HOST" $DATABASE $USER $PASSWORD $PORT