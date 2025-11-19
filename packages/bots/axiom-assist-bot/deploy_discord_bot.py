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

async def deploy_discord_bot_service():
    """Deploy the Discord bot service using Render Admin Power"""
    
    # Initialize the Render Admin Power
    render_power = RenderAdminPower()
    
    # Configuration
    RENDER_API_KEY = os.environ.get('RENDER_API_KEY')
    
    if not RENDER_API_KEY:
        print("❌ RENDER_API_KEY environment variable is not set")
        return False
    
    # For deploying a new service, we would typically need to use the Render API directly
    # since our RenderAdminPower doesn't have a deploy service function yet
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    # First, let's check if the service already exists
    print("Checking if Discord bot service already exists...")
    services_response = requests.get("https://api.render.com/v1/services", headers=headers)
    
    if services_response.status_code == 200:
        services = services_response.json()
        discord_services = [
            s for s in services 
            if 'discord' in s['service']['name'].lower()
        ]
        
        if discord_services:
            print("✅ Discord bot service already exists:")
            for service in discord_services:
                service_info = service['service']
                print(f"  - {service_info['name']} ({service_info['id']})")
                print(f"    Status: {service_info['suspended']}")
                print(f"    URL: {service_info['serviceDetails'].get('url', 'N/A')}")
            return True
        else:
            print("ℹ️  Discord bot service not found. You'll need to deploy it manually:")
            print("   1. Go to https://dashboard.render.com/")
            print("   2. Connect your GitHub repository")
            print("   3. Select the render.yaml file")
            print("   4. Deploy the services")
            return False
    else:
        print(f"❌ Failed to fetch services: {services_response.status_code}")
        return False

def list_all_services():
    """List all Render services"""
    RENDER_API_KEY = os.environ.get('RENDER_API_KEY')
    
    if not RENDER_API_KEY:
        print("❌ RENDER_API_KEY environment variable is not set")
        return
    
    headers = {
        "Authorization": f"Bearer {RENDER_API_KEY}",
        "Accept": "application/json"
    }
    
    try:
        response = requests.get("https://api.render.com/v1/services", headers=headers)
        response.raise_for_status()
        services = response.json()
        
        print("All Render services:")
        for service in services:
            service_info = service.get('service', {})
            print(f"  - {service_info.get('name', 'Unknown')}: {service_info.get('id', 'Unknown ID')}")
            print(f"    Type: {service_info.get('type', 'Unknown')}")
            print(f"    Status: {service_info.get('suspended', 'Unknown')}")
            if 'serviceDetails' in service_info and 'url' in service_info['serviceDetails']:
                print(f"    URL: {service_info['serviceDetails']['url']}")
            print()
            
    except Exception as e:
        print(f"❌ Error fetching services: {e}")

if __name__ == "__main__":
    print("🔍 Checking Render services...")
    list_all_services()
    
    print("\n🤖 Deploying Discord bot service...")
    success = asyncio.run(deploy_discord_bot_service())
    
    if success:
        print("\n✅ Discord bot service deployment check completed!")
    else:
        print("\n❌ Discord bot service deployment check failed!")
        sys.exit(1)