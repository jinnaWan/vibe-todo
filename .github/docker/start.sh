#!/bin/bash
set -e

# Ensure required environment variables are set
if [[ -z "$REPO_URL" ]]; then
    echo "Error: REPO_URL environment variable is required"
    exit 1
fi

if [[ -z "$PAT_TOKEN" ]]; then
    echo "Error: PAT_TOKEN environment variable is required"
    exit 1
fi

# Set default values for optional variables
LABELS=${LABELS:-"self-hosted,aws-ecs"}
RUNNER_NAME=${RUNNER_NAME:-"runner-$(hostname)-$(date +%s)"}
RUNNER_WORKDIR=${RUNNER_WORKDIR:-"/home/runner/_work"}

echo "Starting GitHub Actions runner configuration..."
echo "Repository: $REPO_URL"
echo "Runner Name: $RUNNER_NAME"
echo "Labels: $LABELS"

# Create work directory
mkdir -p "$RUNNER_WORKDIR"

# Function to cleanup on exit
cleanup() {
    echo "Cleaning up runner..."
    if [[ -f ".runner" ]]; then
        echo "Removing runner from GitHub..."
        ./config.sh remove --token "$PAT_TOKEN" || true
    fi
    exit 0
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGTERM SIGINT

# Get registration token
echo "Getting registration token..."
REGISTRATION_TOKEN=$(curl -s -X POST \
    -H "Authorization: token $PAT_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "$REPO_URL/actions/runners/registration-token" | \
    jq -r .token)

if [[ -z "$REGISTRATION_TOKEN" || "$REGISTRATION_TOKEN" == "null" ]]; then
    echo "Error: Failed to get registration token"
    exit 1
fi

echo "Configuring runner..."
./config.sh \
    --url "$REPO_URL" \
    --token "$REGISTRATION_TOKEN" \
    --name "$RUNNER_NAME" \
    --labels "$LABELS" \
    --work "$RUNNER_WORKDIR" \
    --unattended \
    --replace

echo "Starting runner..."
./run.sh &

# Wait for the runner process
wait $! 