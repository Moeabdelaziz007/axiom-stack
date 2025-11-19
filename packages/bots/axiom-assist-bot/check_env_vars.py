#!/usr/bin/env python3
import os
from dotenv import load_dotenv
import requests
import json

# Load environment variables from .env file
load_dotenv()

# Get the Render API key from environment variables
api_key = os.getenv('RENDER_API_KEY')

# Set up the headers for the API request
headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json"
}

# Service IDs for our services
service_ids = ['srv-d4c69rfdiees738udhh0', 'srv-d4c69rfdiees738udhhg']

# Check environment variables for each service
for service_id in service_ids:
    try:
        response = requests.get(f'https://api.render.com/v1/services/{service_id}/env-vars', headers=headers)
        print(f'Service {service_id} env vars:')
        if response.status_code == 200:
            env_vars = response.json()
            for env_var in env_vars:
                var_info = env_var.get('envVar', {})
                key = var_info.get('key', 'Unknown')
                value = var_info.get('value', 'N/A')
                sync = var_info.get('sync', 'N/A')
                print(f"  {key}: {value} (sync: {sync})")
        else:
            print(f"  Failed to get env vars: {response.status_code}")
        print('---')
    except Exception as e:
        print(f"Error checking service {service_id}: {e}")