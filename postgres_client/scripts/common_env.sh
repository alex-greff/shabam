#!/bin/bash

# Common script environment variables

# Name of the postgres client image
IMAGE_NAME="alexgreff/postgres_client"

# Container environment variable setter command
SET_CONTAINER_ENV="export PG_HOST=$SHABAM_PG_HOST PG_DATABASE=$SHABAM_PG_DATABASE PG_PORT=$SHABAM_PG_PORT PG_USER=$SHABAM_PG_USER PG_PASSWORD=$SHABAM_PG_PASSWORD"