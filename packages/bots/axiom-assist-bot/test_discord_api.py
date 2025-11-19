#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()


def test_discord_api():
    """Test the Discord bot token by making a simple API call"""
    print("🔍 Testing Discord API connectivity...")
    
    # Get the Discord bot token
    discord_token = os.environ.get('DISCORD_BOT_TOKEN')
    
    if not discord_token:
        print("❌ DISCORD_BOT_TOKEN is not set in environment variables")
        return False
    
    if discord_token == 'your_discord_bot_token_here':
        print("❌ DISCORD_BOT_TOKEN is still set to the placeholder value")
        return False
    
    # Set up headers for Discord API request
    headers = {
        "Authorization": f"Bot {discord_token}",
        "Content-Type": "application/json"
    }
    
    try:
        # Make a simple API request to get the bot's user information
        url = "https://discord.com/api/v10/users/@me"
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            bot_info = response.json()
            print("✅ Discord API connection successful!")
            print(f"   Bot Name: {bot_info.get('username', 'Unknown')}")
            print(f"   Bot ID: {bot_info.get('id', 'Unknown')}")
            print(f"   Bot Tag: {bot_info.get('discriminator', 'Unknown')}")
            return True
        elif response.status_code == 401:
            print("❌ Invalid Discord bot token")
            print("   Please check your token and try again")
            return False
        else:
            print(f"❌ Discord API request failed with "
                  f"status code: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Discord API request timed out")
        print("   Please check your network connection")
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def main():
    """Main function to run the Discord API test"""
    print("🤖 Axiom ID Discord Bot API Test")
    print("=" * 35)
    
    success = test_discord_api()
    
    print("\n" + "=" * 35)
    if success:
        print("🎉 Discord bot is ready for deployment!")
        print("\nNext steps:")
        print("1. Deploy the bot to Render using the "
              "instructions in DISCORD_DEPLOYMENT_GUIDE.md")
        print("2. Invite the bot to your Discord server")
        print("3. Test the bot functionality")
        return 0
    else:
        print("❌ Discord bot test failed!")
        print("\nTroubleshooting steps:")
        print("1. Verify your Discord bot token is correct")
        print("2. Check that the token has the necessary permissions")
        print("3. Ensure your bot is properly configured "
              "in the Discord Developer Portal")
        return 1


if __name__ == "__main__":
    sys.exit(main())