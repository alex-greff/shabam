#!/bin/bash

# Initializes the metadata database schema

# Parameters:
# $1: skip warning prompt

INIT_CMD='/app/scripts/db/metadata/initialize_schema.sh'
HOST='db-metadata'
DATABASE='postgres'
USER='postgres'
PASSWORD='development'
PORT=5432

bash ./scripts/exec_init_schema.sh "$1" "$INIT_CMD" "$HOST" $DATABASE $USER $PASSWORD $PORT