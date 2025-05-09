#!/bin/bash

# Start Ollama if not running
if ! pgrep -x "ollama" > /dev/null; then
    echo "Starting Ollama..."
    ollama serve &
    sleep 5
    ollama run llama2:7b &
fi

# Start Docker services
echo "Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Start mobile app
echo "Starting mobile app..."
cd packages/mobile
yarn start

# Keep script running
wait 