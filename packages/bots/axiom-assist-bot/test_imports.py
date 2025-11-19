#!/usr/bin/env python3
"""
Test script to verify that the admin powers can be imported and instantiated.
"""

import sys
import os

# Add the superpowers directory to the path
superpowers_path = os.path.join(os.path.dirname(__file__), 'adk-agents', 'superpowers')
sys.path.append(superpowers_path)

def test_imports():
    """Test importing the admin powers."""
    try:
        # Test importing render admin power
        from render_admin_power import RenderAdminPower
        print("✅ RenderAdminPower imported successfully")
        
        # Test instantiating render admin power
        render_power = RenderAdminPower()
        print("✅ RenderAdminPower instantiated successfully")
        print(f"   Power name: {render_power.get_name()}")
        
    except Exception as e:
        print(f"❌ Error with RenderAdminPower: {e}")
        return False
    
    try:
        # Test importing github admin power
        from github_admin_power import GitHubAdminPower
        print("✅ GitHubAdminPower imported successfully")
        
        # Test instantiating github admin power
        github_power = GitHubAdminPower()
        print("✅ GitHubAdminPower instantiated successfully")
        print(f"   Power name: {github_power.get_name()}")
        
    except Exception as e:
        print(f"❌ Error with GitHubAdminPower: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("Testing Admin Power Imports")
    print("=" * 30)
    
    success = test_imports()
    
    if success:
        print("\n🎉 All admin powers imported and instantiated successfully!")
    else:
        print("\n❌ Some admin powers failed to import or instantiate.")
        
    sys.exit(0 if success else 1)