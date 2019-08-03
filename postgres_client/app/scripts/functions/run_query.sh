#!/bin/bash

# Runs a query on the postgres database

# Parameters:
# $1: query to run on database
run_query() {
    # Set password env variable that psql recognizes
    export PG_PASSWORD="$PG_PASSWORD"

    # Login and pipe the query on the postgres database
    echo "$1" | psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" "$PG_DATABASE"
}