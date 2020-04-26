#!/bin/bash

# Common script environment variables

# Name of the postgres client image
IMAGE_NAME="alexgreff/postgres_client"

# Generates the $SET_CONTAINER_ENV environment variable that can be used to set PG env variables in containers
# Parameters:
# $1: The database host
# $2: The database database
# $3: The database user
# $4: The database password
# $5: The database port
generate_set_container_env() {
    HOST_ENV_NAME="$1";
    DATABASE_ENV_NAME="$2";
    USER_ENV_NAME="$3";
    PASSWORD_ENV_NAME="$4";
    PORT_ENV_NAME="$5";

    SET_CONTAINER_ENV="export PG_HOST=${HOST_ENV_NAME} PG_DATABASE=${DATABASE_ENV_NAME} PG_USER=${USER_ENV_NAME} PG_PASSWORD=${PASSWORD_ENV_NAME} PG_PORT=${PORT_ENV_NAME}";
}