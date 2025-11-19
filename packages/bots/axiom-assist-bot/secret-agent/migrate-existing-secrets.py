# secret-agent/migrate-existing-secrets.py - Migration script for existing secrets
import os
import json
from google.cloud import secretmanager

def migrate_existing_secrets():
    """Migrate existing secrets to the new Secret Agent system with proper labels."""
    project_id = os.environ.get('GOOGLE_CLOUD_PROJECT_ID', 'axiom-id-project')
    render_service_id = os.environ.get('RENDER_SERVICE_ID', '')
    
    print(f"🔄 Migrating existing secrets for project: {project_id}")
    
    # Initialize the Secret Manager client
    client = secretmanager.SecretManagerServiceClient()
    parent = f"projects/{project_id}"
    
    # List of existing secrets that need to be migrated
    existing_secrets = [
        {
            "name": "DISCORD_BOT_TOKEN",
            "new_name": "render-sync-DISCORD_BOT_TOKEN",
            "env_var_key": "DISCORD_BOT_TOKEN"
        },
        {
            "name": "GEMINI_API_KEY",
            "new_name": "render-sync-GEMINI_API_KEY",
            "env_var_key": "GEMINI_API_KEY"
        },
        {
            "name": "PINECONE_API_KEY",
            "new_name": "render-sync-PINECONE_API_KEY",
            "env_var_key": "PINECONE_API_KEY"
        },
        {
            "name": "SOLANA_DEPLOY_SEED",
            "new_name": "render-sync-SOLANA_DEPLOY_SEED",
            "env_var_key": "SOLANA_DEPLOY_SEED"
        }
    ]
    
    for secret_info in existing_secrets:
        old_name = secret_info["name"]
        new_name = secret_info["new_name"]
        env_var_key = secret_info["env_var_key"]
        
        try:
            print(f"\n🔄 Migrating {old_name} to {new_name}...")
            
            # Get the current secret value
            old_secret_path = f"{parent}/secrets/{old_name}"
            try:
                # Access the latest version of the old secret
                response = client.access_secret_version(
                    request={"name": f"{old_secret_path}/versions/latest"}
                )
                secret_value = response.payload.data
                print(f"✅ Retrieved value for {old_name}")
            except Exception as e:
                print(f"⚠️  Could not access {old_name}: {e}")
                continue
            
            # Create the new secret with proper labels
            try:
                new_secret = client.create_secret(
                    request={
                        "parent": parent,
                        "secret_id": new_name,
                        "secret": {
                            "replication": {"automatic": {}},
                            "labels": {
                                "sync-target": "render",
                                "render-service-id": render_service_id,
                                "render-env-var-key": env_var_key,
                                "system": "secret-agent",
                                "migrated": "true"
                            }
                        },
                    }
                )
                print(f"✅ Created new secret: {new_secret.name}")
            except Exception as e:
                print(f"⚠️  Could not create {new_name} (may already exist): {e}")
                # Try to get the existing secret
                try:
                    new_secret = client.get_secret(request={"name": f"{parent}/secrets/{new_name}"})
                except Exception as e2:
                    print(f"❌ Could not get existing secret: {e2}")
                    continue
            
            # Add the secret version with the existing value
            try:
                version = client.add_secret_version(
                    request={
                        "parent": f"{parent}/secrets/{new_name}",
                        "payload": {"data": secret_value},
                    }
                )
                print(f"✅ Added secret version: {version.name}")
            except Exception as e:
                print(f"⚠️  Could not add version to {new_name}: {e}")
                
        except Exception as e:
            print(f"❌ Error migrating {old_name}: {e}")
    
    print("\n🎉 Migration process complete!")
    print("\n📝 Next steps:")
    print("1. Verify that all secrets were migrated successfully")
    print("2. Test the Secret Agent by updating one of the migrated secrets")
    print("3. Update your Render service to use the new secret synchronization")

if __name__ == "__main__":
    migrate_existing_secrets()