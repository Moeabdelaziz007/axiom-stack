#!/usr/bin/env python3
import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def check_environment_variables():
    """Check if all required environment variables are set"""
    print("🔍 Pre-deployment Environment Check")
    print("=" * 40)
    
    # Required environment variables
    required_vars = [
        'RENDER_API_KEY',
        'DISCORD_BOT_TOKEN',
        'GEMINI_API_KEY',
        'PINECONE_API_KEY'
    ]
    
    # Optional but recommended variables
    optional_vars = [
        'GOOGLE_CLOUD_PROJECT_ID',
        'GOOGLE_CLOUD_REGION',
        'SOLANA_RPC_URL',
        'AXIOM_PROGRAM_ID'
    ]
    
    all_checks_passed = True
    
    print("✅ Required Environment Variables:")
    for var in required_vars:
        value = os.environ.get(var)
        if value:
            # Mask sensitive values for display
            if 'KEY' in var or 'TOKEN' in var:
                if len(value) > 8:
                    masked_value = value[:4] + '...' + value[-4:]
                else:
                    masked_value = '****'
                print(f"  {var}: {masked_value} (✓)")
            else:
                print(f"  {var}: {value} (✓)")
        else:
            print(f"  {var}: NOT SET (❌)")
            all_checks_passed = False
    
    print("\nℹ️  Optional Environment Variables:")
    for var in optional_vars:
        value = os.environ.get(var)
        if value:
            # Mask sensitive values for display
            if 'KEY' in var or 'TOKEN' in var:
                if len(value) > 8:
                    masked_value = value[:4] + '...' + value[-4:]
                else:
                    masked_value = '****'
                print(f"  {var}: {masked_value} (✓)")
            else:
                print(f"  {var}: {value} (✓)")
        else:
            print(f"  {var}: NOT SET (⚠️)")
    
    print("\n" + "=" * 40)
    if all_checks_passed:
        print("🎉 All required environment variables are set!")
        print("You're ready to deploy the Discord bot service.")
        return True
    else:
        print("❌ Some required environment variables are missing.")
        print("Please set all required variables before deploying.")
        return False


def check_render_yaml():
    """Check if render.yaml file exists and has the correct structure"""
    print("\n📄 Checking render.yaml file...")
    
    render_yaml_path = os.path.join(os.path.dirname(__file__), 'render.yaml')
    
    if os.path.exists(render_yaml_path):
        print("  render.yaml: FOUND (✓)")
        
        # Read the file to check for Discord bot service
        with open(render_yaml_path, 'r') as f:
            content = f.read()
            
        if 'axiom-id-discord-bot' in content:
            print("  Discord bot service: DEFINED (✓)")
            return True
        else:
            print("  Discord bot service: NOT FOUND (❌)")
            print("  The render.yaml file doesn't contain the "
                  "Discord bot service definition.")
            return False
    else:
        print("  render.yaml: NOT FOUND (❌)")
        return False


def main():
    """Main function to run all checks"""
    print("🚀 Axiom ID Discord Bot Pre-Deployment Checker")
    print()
    
    # Check environment variables
    env_check_passed = check_environment_variables()
    
    # Check render.yaml file
    yaml_check_passed = check_render_yaml()
    
    print("\n" + "=" * 50)
    if env_check_passed and yaml_check_passed:
        print("✅ All checks passed! You're ready to deploy.")
        print("\nNext steps:")
        print("1. Go to https://dashboard.render.com/")
        print("2. Create a new Blueprint service")
        print("3. Select your repository and the render.yaml file")
        print("4. Deploy all services")
        return 0
    else:
        print("❌ Some checks failed. Please fix the issues before deploying.")
        return 1


if __name__ == "__main__":
    sys.exit(main())