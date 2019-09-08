#!/bin/bash

# Common script environment variables

# Name of the postgres client image
IMAGE_NAME="alexgreff/postgres_client"

# Generates the $SET_CONTAINER_ENV environment variable that can be used to set PG env variables in containers
# Parameters:
# $1: The database name
generate_set_container_env() {
    HOST_ENV_NAME=`echo "SHABAM_PG_$1_HOST"`;
    DATABASE_ENV_NAME=`echo "SHABAM_PG_$1_DATABASE"`;
    USER_ENV_NAME=`echo "SHABAM_PG_$1_USER"`;
    PASSWORD_ENV_NAME=`echo "SHABAM_PG_$1_PASSWORD"`;

    SET_CONTAINER_ENV="export PG_HOST=${!HOST_ENV_NAME} PG_DATABASE=${!DATABASE_ENV_NAME} PG_USER=${!USER_ENV_NAME} PG_PASSWORD=${!PASSWORD_ENV_NAME}";
}