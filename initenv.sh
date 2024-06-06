#!/bin/bash

# Define the path to your .env file (modify if needed)
ENV_FILE=".env"

# Check if the .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found!"
  exit 1
fi

# Source the .env file (loads variables into current shell)
source "$ENV_FILE"

# Print a message to confirm loading
echo "Loaded environment variables from $ENV_FILE"