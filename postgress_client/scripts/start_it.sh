IMAGE_NAME="alexgreff/postgres_client"
CURR_DIR=`pwd`

# The environment setter
SET_ENV="export PG_HOST=$SHABAM_PG_HOST PG_DATABASE=$SHABAM_PG_DATABASE PG_PORT=$SHABAM_PG_PORT PG_USER=$SHABAM_PG_USER PG_PASSWORD=$SHABAM_PG_PASSWORD"

# Start command
read -d '' START_CMD << EOF
    $SET_ENV;
    bash
EOF

# Run the container
docker run -it -v "/$CURR_DIR/app:/app" $IMAGE_NAME bash -c "$START_CMD"