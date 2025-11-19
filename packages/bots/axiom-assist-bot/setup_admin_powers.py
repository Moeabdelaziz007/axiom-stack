#!/usr/bin/env python3
"""
Setup script for the Render and GitHub Admin Powers
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def check_environment_variables():
    """Check if required environment variables are set"""
    print("Checking environment variables...")
    
    # Check GitHub tokens
    github_bot_token = os.getenv('GITHUB_BOT_TOKEN')
    github_pat = os.getenv('GITHUB_PAT')
    
    if github_bot_token and github_bot_token != 'github_pat_...':
        print("✅ GITHUB_BOT_TOKEN is set")
    else:
        print("⚠️  GITHUB_BOT_TOKEN is not set or is still the placeholder value")
    
    if github_pat:
        print("✅ GITHUB_PAT is set")
    else:
        print("⚠️  GITHUB_PAT is not set")
    
    # Check Render API key
    render_api_key = os.getenv('RENDER_API_KEY')
    if render_api_key:
        print("✅ RENDER_API_KEY is set")
    else:
        print("⚠️  RENDER_API_KEY is not set")
    
    # Check other required variables
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    if gemini_api_key:
        print("✅ GEMINI_API_KEY is set")
    
    pinecone_api_key = os.getenv('PINECONE_API_KEY')
    if pinecone_api_key:
        print("✅ PINECONE_API_KEY is set")

def setup_render_api_key():
    """Guide the user to set up the Render API key"""
    print("\n" + "="*50)
    print("Render API Key Setup")
    print("="*50)
    print("1. Go to https://dashboard.render.com/")
    print("2. Navigate to Account Settings > API Keys")
    print("3. Create a new API key with appropriate permissions")
    print("4. Copy the API key")
    print("5. Add it to your .env file:")
    print("   RENDER_API_KEY=your_render_api_key_here")
    print("\nOr set it as an environment variable:")
    print("   export RENDER_API_KEY=your_render_api_key_here")

def setup_github_pat():
    """Guide the user to set up the GitHub Personal Access Token"""
    print("\n" + "="*50)
    print("GitHub Personal Access Token Setup")
    print("="*50)
    print("1. Go to https://github.com/settings/tokens")
    print("2. Navigate to Developer settings > Personal access tokens > Fine-grained tokens")
    print("3. Click Generate new token")
    print("4. Select your repository (Moeabdelaziz007/axiom-stack)")
    print("5. Grant the following permissions:")
    print("   - repo (full control of private repositories)")
    print("   - admin:repo_hook (Read and write webhooks)")
    print("6. Generate and copy the token")
    print("7. Add it to your .env file:")
    print("   GITHUB_PAT=your_github_personal_access_token_here")
    print("\nOr set it as an environment variable:")
    print("   export GITHUB_PAT=your_github_personal_access_token_here")

def test_admin_powers():
    """Test the admin powers"""
    print("\n" + "="*50)
    print("Testing Admin Powers")
    print("="*50)
    
    # Check if we have the required environment variables
    render_api_key = os.getenv('RENDER_API_KEY')
    github_pat = os.getenv('GITHUB_PAT')
    
    if not render_api_key:
        print("❌ RENDER_API_KEY is not set. Please set it first.")
        return False
    
    if not github_pat:
        print("❌ GITHUB_PAT is not set. Please set it first.")
        return False
    
    print("✅ All required environment variables are set")
    
    # Test importing the admin powers
    try:
        sys.path.append(os.path.join(os.path.dirname(__file__), 'adk-agents', 'superpowers'))
        
        from render_admin_power import RenderAdminPower
        from github_admin_power import GitHubAdminPower
        
        print("✅ Admin power modules imported successfully")
        
        # Test instantiation
        render_power = RenderAdminPower()
        github_power = GitHubAdminPower()
        
        print("✅ Admin power classes instantiated successfully")
        
        print("\n🎉 Setup verification complete!")
        print("You can now use the admin powers in your DevOps workflow.")
        print("\nTo run the full test:")
        print("python test_admin_powers.py")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing admin powers: {e}")
        return False

def main():
    """Main setup function"""
    print("Axiom DevOps Agent - Admin Powers Setup")
    print("="*50)
    
    # Check current environment
    check_environment_variables()
    
    # If required variables are missing, guide the user to set them up
    render_api_key = os.getenv('RENDER_API_KEY')
    github_pat = os.getenv('GITHUB_PAT')
    
    if not render_api_key:
        setup_render_api_key()
    
    if not github_pat:
        setup_github_pat()
    
    # Test the admin powers if all variables are set
    if render_api_key and github_pat:
        test_admin_powers()
    
    print("\n" + "="*50)
    print("Setup Instructions Summary")
    print("="*50)
    print("1. Set up Render API Key (if not done)")
    print("2. Set up GitHub PAT (if not done)")
    print("3. Verify setup with this script")
    print("4. Run the full test with test_admin_powers.py")

if __name__ == "__main__":
    main()