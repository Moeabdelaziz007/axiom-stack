#!/usr/bin/env python3
"""
Test script to verify Render API key and list services
"""

import os
import requests
import sys


def test_render_api():
    """Test Render API key and list services"""
    # Get Render API key from environment
    render_api_key = os.environ.get('RENDER_API_KEY')
    
    if not render_api_key:
        print("❌ RENDER_API_KEY environment variable is not set")
        print("Please set it with: export RENDER_API_KEY=your_render_api_key")
        return False
    
    print("Testing Render API key...")
    
    # Set up headers
    headers = {
        "Authorization": f"Bearer {render_api_key}",
        "Accept": "application/json"
    }
    
    try:
        # Test API key by listing services
        url = "https://api.render.com/v1/services"
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            services = response.json()
            print("✅ Render API key is valid!")
            print(f"Found {len(services)} services:")
            
            for service in services:
                service_info = service.get('service', {})
                name = service_info.get('name', 'Unknown')
                service_id = service_info.get('id', 'Unknown ID')
                print(f"  - {name}: {service_id}")
            
            return True
        elif response.status_code == 401:
            print("❌ Invalid Render API key")
            print("Please check your API key and try again")
            return False
        else:
            print(f"❌ API request failed with status code: "
                  f"{response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


if __name__ == "__main__":
    success = test_render_api()
    sys.exit(0 if success else 1)