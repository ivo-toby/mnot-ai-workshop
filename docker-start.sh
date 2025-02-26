#!/bin/bash

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY environment variable is not set!"
    echo "Please set it by running: export OPENAI_API_KEY=your_key_here"
    echo "Continuing without categorization feature..."
fi

# Build and start the containers
echo "🚀 Starting Docker containers..."
docker-compose up --build
