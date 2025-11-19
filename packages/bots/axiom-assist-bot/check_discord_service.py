#!/usr/bin/env python3
import os
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

# Get the Render API key from environment variables
api_key = os.getenv('RENDER_API_KEY')

# Set up the headers for the API request
headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json"
}

# Get all services
response = requests.get('https://api.render.com/v1/services', headers=headers)
if response.status_code == 200:
    services = response.json()
    discord_services = [
        s for s in services 
        if 'discord' in s['service']['name'].lower()
    ]
    print('Discord services:')
    for s in discord_services:
        print(f"  {s['service']['name']} ({s['service']['id']})")
    
    # If no discord services found, list all services
    if not discord_services:
        print('No Discord services found. All services:')
        for s in services:
            print(f"  {s['service']['name']} ({s['service']['id']})")
else:
    print(f"Failed to get services: {response.status_code}")