#!/usr/bin/env python3
"""
Script to add environment variables to Render services using the Render Admin Power
"""

import sys
import os
import asyncio

# Add the superpowers directory to the path
superpowers_path = os.path.join(os.path.dirname(__file__), 'adk-agents', 'superpowers')
sys.path.append(superpowers_path)

from render_admin_power import RenderAdminPower

async def add_environment_variable():
    """Add an environment variable to a Render service"""
    
    # Initialize the Render Admin Power
    render_power = RenderAdminPower()
    
    # Configuration - Update these values with your actual values
    RENDER_API_KEY = os.environ.get('RENDER_API_KEY')
    SERVICE_ID = "srv-d4c69rfdiees738udhhg"  # Replace with your actual service ID
    ENV_KEY = "TEST_VARIABLE"
    ENV_VALUE = "test_value"
    
    if not RENDER_API_KEY:
        print("❌ RENDER_API_KEY environment variable is not set")
        print("Please set it with: export RENDER_API_KEY=your_render_api_key")
        return False
    
    # Prepare the payload
    payload = {
        "action": "ADD_ENV_VAR",
        "render_api_key": RENDER_API_KEY,
        "service_id": SERVICE_ID,
        "env_key": ENV_KEY,
        "env_value": ENV_VALUE
    }
    
    print(f"Adding environment variable '{ENV_KEY}' to service '{SERVICE_ID}'...")
    
    # Execute the Render Admin Power
    result = await render_power.execute(payload)
    
    if result.get("status") == "success":
        print("✅ Environment variable added successfully!")
        print(f"   Service ID: {result.get('service_id')}")
        print(f"   Key: {result.get('key')}")
        print(f"   Action: {result.get('action')}")
        return True
    else:
        print("❌ Failed to add environment variable")
        print(f"   Error: {result.get('message')}")
        return False

def get_service_id():
    """Get the service ID from Render API"""
    import requests
    
    RENDER_API_KEY = os.environ.get('RENDER_API_KEY')
    if not RENDER_API_KEY:
        print("❌ RENDER_API_KEY environment variable is not set")
        return None
    
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    try:
        response = requests.get("https://api.render.com/v1/services", headers=headers)
        response.raise_for_status()
        services = response.json()
        
        print("Available Render services:")
        for service in services:
            service_info = service.get('service', {})
            print(f"  - {service_info.get('name', 'Unknown')}: {service_info.get('id', 'Unknown ID')}")
        
        return services
    except Exception as e:
        print(f"❌ Error fetching services: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        # List available services
        get_service_id()
    else:
        # Add environment variable
        success = asyncio.run(add_environment_variable())
        sys.exit(0 if success else 1)