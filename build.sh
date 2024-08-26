#!/bin/bash

# Variables
TEMP_DB_CONTAINER_NAME="temp_pg_db"
TEMP_DB_NAME="temp_db"
TEMP_DB_USER="temp_user"
TEMP_DB_PASSWORD="temp_pass"
DOCKER_IMAGE_NAME="ozoneteam/loop-in:latest"

# Function to check if a port is available
is_port_available() {
  local port=$1
  if ! lsof -i:$port >/dev/null; then
    return 0
  else
    return 1
  fi
}

# Step 1: Find an available random port
while : ; do
  TEMP_DB_PORT=($RANDOM + 1024)
  if is_port_available $TEMP_DB_PORT; then
    echo "Selected port $TEMP_DB_PORT is available."
    break
  else
    echo "Port $TEMP_DB_PORT is in use, trying another port..."
  fi
done

# Step 2: Start a temporary PostgreSQL database container with the available port
# make sure to use the --rm flag so it removes when stopped
echo "Starting temporary PostgreSQL container on port $TEMP_DB_PORT..."
docker run --name $TEMP_DB_CONTAINER_NAME --rm -e POSTGRES_DB=$TEMP_DB_NAME -e POSTGRES_USER=$TEMP_DB_USER -e POSTGRES_PASSWORD=$TEMP_DB_PASSWORD -p $TEMP_DB_PORT:5432 -d postgres

# Step 3: Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec $TEMP_DB_CONTAINER_NAME pg_isready -U $TEMP_DB_USER -d $TEMP_DB_NAME; do
  sleep 1
done

# Step 4: Build the Next.js app with Docker, passing the PostgreSQL connection details
echo "Building Next.js app Docker image..."
docker build --platform linux/amd64 --build-arg DATABASE_URL="postgresql://$TEMP_DB_USER:$TEMP_DB_PASSWORD@host.docker.internal:$TEMP_DB_PORT/$TEMP_DB_NAME" -t $DOCKER_IMAGE_NAME .

# Step 5: Stop and remove the temporary PostgreSQL container
echo "Cleaning up temporary PostgreSQL container..."
docker stop $TEMP_DB_CONTAINER_NAME

echo "Build complete. Docker image $DOCKER_IMAGE_NAME is ready."