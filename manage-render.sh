#!/bin/bash

# Render API management script

# Check if API key is provided as argument
if [ -z "$1" ]; then
    echo "Usage: $0 <RENDER_API_KEY>"
    echo "Please create an API key in your Render dashboard and pass it as an argument"
    exit 1
fi

RENDER_API_KEY=$1

# List services
echo "Fetching services..."
curl -s -H "Authorization: Bearer $RENDER_API_KEY" https://api.render.com/v1/services | jq '.[] | {name, id, url}'

echo "\nTo delete a service, use:"
echo "curl -X DELETE -H \"Authorization: Bearer $RENDER_API_KEY\" https://api.render.com/v1/services/SERVICE_ID"

