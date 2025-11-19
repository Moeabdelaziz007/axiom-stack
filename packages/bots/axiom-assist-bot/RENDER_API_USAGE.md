# How to Use the Render API to Add Environment Variables

## Overview

This document explains how to use the Render Admin Power to add environment variables to your Render services.

## Prerequisites

1. A Render account
2. A Render API key
3. A Render service ID

## Getting Your Render API Key

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Navigate to **Account Settings** > **API Keys**
3. Create a new API key with appropriate permissions
4. Copy the API key

## Getting Your Service ID

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Navigate to your service
3. The service ID is in the URL: `https://dashboard.render.com/web/srv-XXXXXXXXXXXXXXXXXXX`
4. Copy the service ID (the `srv-XXXXXXXXXXXXXXXXXXX` part)

## Using the Render Admin Power

### Method 1: Using the Python Script

```bash
# Set your Render API key as an environment variable
export RENDER_API_KEY=your_render_api_key_here

# Run the script to add an environment variable
python add_render_env_var.py
```

### Method 2: Direct Code Usage

```python
import asyncio
import sys
import os

# Add the superpowers directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'adk-agents', 'superpowers'))

from render_admin_power import RenderAdminPower

async def add_env_var():
    # Initialize the Render Admin Power
    render_power = RenderAdminPower()
    
    # Prepare the payload
    payload = {
        "action": "ADD_ENV_VAR",
        "render_api_key": "your_render_api_key",
        "service_id": "your_service_id",
        "env_key": "YOUR_ENV_KEY",
        "env_value": "your_env_value"
    }
    
    # Execute the Render Admin Power
    result = await render_power.execute(payload)
    return result

# Run the function
result = asyncio.run(add_env_var())
print(result)
```

## Available Actions

1. `ADD_ENV_VAR` - Add or update environment variables
2. `TRIGGER_DEPLOY` - Trigger a new deployment
3. `GET_LOGS` - Retrieve service logs

## Example Payloads

### Add Environment Variable
```python
{
    "action": "ADD_ENV_VAR",
    "render_api_key": "your_render_api_key",
    "service_id": "srv-your-service-id",
    "env_key": "YOUR_KEY",
    "env_value": "your_value"
}
```

### Trigger Deployment
```python
{
    "action": "TRIGGER_DEPLOY",
    "render_api_key": "your_render_api_key",
    "service_id": "srv-your-service-id"
}
```

### Get Logs
```python
{
    "action": "GET_LOGS",
    "render_api_key": "your_render_api_key",
    "service_id": "srv-your-service-id"
}
```

## Error Handling

The Render Admin Power returns structured responses:

### Success Response
```python
{
    "status": "success",
    "action": "ADD_ENV_VAR",
    "service_id": "srv-your-service-id",
    "key": "YOUR_KEY"
}
```

### Error Response
```python
{
    "status": "error",
    "message": "Error description"
}
```