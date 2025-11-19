#!/usr/bin/env python3
"""
Simple script to test your Render API key
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def test_render_api_key():
    """Test if the Render API key is working"""
    # Get the Render API key from environment variables
    render_api_key = os.getenv('RENDER_API_KEY')
    
    if not render_api_key or render_api_key == 'your_render_api_key_here':
        print("❌ RENDER_API_KEY is not set or is still the placeholder value")
        print("Please update your .env file with your actual Render API key")
        print("Go to: https://dashboard.render.com/u/settings?add-api-key")
        return False
    
    print("Testing Render API key...")
    
    # Set up the headers for the API request
    headers = {
        "Authorization": f"Bearer {render_api_key}",
        "Accept": "application/json"
    }
    
    try:
        # Make a simple API request to list services
        response = requests.get("https://api.render.com/v1/services", headers=headers)
        
        if response.status_code == 200:
            services = response.json()
            print("✅ Render API key is valid!")
            print(f"Found {len(services)} services in your account")
            
            # Show the first few services
            for i, service in enumerate(services[:3]):
                service_info = service.get('service', {})
                print(f"  {i+1}. {service_info.get('name', 'Unknown')} ({service_info.get('id', 'Unknown ID')})")
            
            if len(services) > 3:
                print(f"  ... and {len(services) - 3} more services")
                
            return True
        elif response.status_code == 401:
            print("❌ Invalid Render API key")
            print("Please check your API key and try again")
            return False
        else:
            print(f"❌ API request failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("Render API Key Tester")
    print("=" * 20)
    success = test_render_api_key()
    
    if success:
        print("\n🎉 Your Render API key is ready to use!")
        print("You can now use the Render Admin Power to manage your services")
    else:
        print("\n🔧 Please follow these steps:")
        print("1. Go to: https://dashboard.render.com/u/settings?add-api-key")
        print("2. Create a new API key")
        print("3. Copy the API key")
        print("4. Update your .env file with the actual API key")
        print("5. Run this script again to test")