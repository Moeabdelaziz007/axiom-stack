#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv
import requests
import asyncio

# Add the superpowers directory to the path
superpowers_path = os.path.join(
    os.path.dirname(__file__), 'adk-agents', 'superpowers'
)
sys.path.append(superpowers_path)

from render_admin_power import RenderAdminPower

# Load environment variables from .env file
load_dotenv()


async def update_discord_env_var():
    """Update the Discord bot token environment variable"""

    # Initialize the Render Admin Power
    render_power = RenderAdminPower()
    
    # Configuration
    RENDER_API_KEY = os.environ.get('RENDER_API_KEY')
    SERVICE_ID = "srv-d4c69rfdiees738udhhg"  # Socket server service ID
    ENV_KEY = "DISCORD_BOT_TOKEN"
    ENV_VALUE = os.environ.get('DISCORD_BOT_TOKEN')
    
    if not RENDER_API_KEY:
        print("❌ RENDER_API_KEY environment variable is not set")
        return False
        
    if not ENV_VALUE or ENV_VALUE == "your_discord_bot_token_here":
        print("❌ DISCORD_BOT_TOKEN is not set or is "
              "still the placeholder value")
        print("Please update your .env file with your "
              "actual Discord bot token")
        return False
    
    # Prepare the payload
    payload = {
        "action": "ADD_ENV_VAR",
        "render_api_key": RENDER_API_KEY,
        "service_id": SERVICE_ID,
        "env_key": ENV_KEY,
        "env_value": ENV_VALUE
    }
    
    print(f"Updating environment variable '{ENV_KEY}' "
          f"for service '{SERVICE_ID}'...")
    
    # Execute the Render Admin Power
    result = await render_power.execute(payload)
    
    if result.get("status") == "success":
        print("✅ Environment variable updated successfully!")
        print(f"   Service ID: {result.get('service_id')}")
        print(f"   Key: {result.get('key')}")
        print(f"   Action: {result.get('action')}")
        return True
    else:
        print("❌ Failed to update environment variable")
        print(f"   Error: {result.get('message')}")
        return False


def get_current_env_vars(service_id):
    """Get current environment variables for a service"""

    RENDER_API_KEY = os.environ.get('RENDER_API_KEY')
    if not RENDER_API_KEY:
        print("❌ RENDER_API_KEY environment variable is not set")
        return None
    
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    try:
        url = (f"https://api.render.com/v1/services/"
               f"{service_id}/env-vars")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Error fetching environment variables: {e}")
        return None


def check_discord_var(service_id):
    """Check if the Discord bot token is properly set"""

    env_vars = get_current_env_vars(service_id)
    if not env_vars:
        return False
    
    for env_var in env_vars:
        var_info = env_var.get('envVar', {})
        key = var_info.get('key', '')
        value = var_info.get('value', '')
        
        if key == "DISCORD_BOT_TOKEN":
            if value and value != "your_discord_bot_token_here":
                print("✅ DISCORD_BOT_TOKEN is properly set")
                return True
            else:
                print("❌ DISCORD_BOT_TOKEN is not properly set")
                return False
    
    print("❌ DISCORD_BOT_TOKEN is not found in environment variables")
    return False


if __name__ == "__main__":
    SERVICE_ID = "srv-d4c69rfdiees738udhhg"  # Socket server service ID

    # First check current status
    print("Checking current environment variables...")
    env_vars = get_current_env_vars(SERVICE_ID)
    if env_vars:
        print("Current environment variables:")
        for env_var in env_vars:
            var_info = env_var.get('envVar', {})
            key = var_info.get('key', 'Unknown')
            value = var_info.get('value', 'N/A')
            # Mask sensitive values
            if 'KEY' in key or 'TOKEN' in key:
                if len(value) > 8:
                    masked_value = value[:4] + '...' + value[-4:]
                else:
                    masked_value = '****'
                print(f"  {key}: {masked_value}")
            else:
                print(f"  {key}: {value}")
    
    # Check if Discord bot token is properly set
    if check_discord_var(SERVICE_ID):
        print("\n✅ Discord bot token is already properly configured")
    else:
        print("\n🔧 Updating Discord bot token...")
        success = asyncio.run(update_discord_env_var())
        if success:
            print("\n✅ Discord bot token updated successfully!")
        else:
            print("\n❌ Failed to update Discord bot token")
            sys.exit(1)