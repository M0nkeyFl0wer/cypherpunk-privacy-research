#!/bin/bash
# Start SSH tunnel to seshat for Ollama API access
# Forwards local port 11434 to seshat's Ollama instance

REMOTE_HOST="seshat"
REMOTE_PORT="11434"
LOCAL_PORT="11434"

echo "Starting Ollama tunnel to seshat..."
echo "Local: localhost:$LOCAL_PORT -> Remote: $REMOTE_HOST:$REMOTE_PORT"
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo ""

# Check if tunnel is already running
if lsof -i :$LOCAL_PORT > /dev/null 2>&1; then
    echo "Warning: Port $LOCAL_PORT is already in use"
    echo "Existing process:"
    lsof -i :$LOCAL_PORT
    echo ""
    read -p "Kill existing process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill $(lsof -t -i:$LOCAL_PORT) 2>/dev/null
        sleep 1
    else
        exit 1
    fi
fi

# Start the tunnel
ssh -N -L $LOCAL_PORT:localhost:$REMOTE_PORT $REMOTE_HOST
