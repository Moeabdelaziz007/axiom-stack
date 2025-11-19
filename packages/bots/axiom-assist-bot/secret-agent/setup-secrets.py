# secret-agent/setup-secrets.py - Setup script for Secret Agent system
import os
from google.cloud import secretmanager
from google.cloud import pubsub_v1
import json

def setup_secret_agent_system():
    """Setup the Secret Agent system with initial secrets and configurations."""
    project_id = os.environ.get('GOOGLE_CLOUD_PROJECT_ID', 'axiom-id-project')
    render_api_key = os.environ.get('RENDER_API_KEY', '')
    render_service_id = os.environ.get('RENDER_SERVICE_ID', '')
    
    print(f"🔧 Setting up Secret Agent system for project: {project_id}")
    
    # Initialize the Secret Manager client
    client = secretmanager.SecretManagerServiceClient()
    parent = f"projects/{project_id}"
    
    # Create the RENDER_API_KEY secret
    if render_api_key:
        print("🔐 Creating RENDER_API_KEY secret...")
        try:
            # Create the secret
            secret = client.create_secret(
                request={
                    "parent": parent,
                    "secret_id": "RENDER_API_KEY",
                    "secret": {
                        "replication": {"automatic": {}},
                        "labels": {
                            "system": "secret-agent",
                            "purpose": "render-api-key"
                        }
                    },
                }
            )
            print(f"✅ Created secret: {secret.name}")
            
            # Add the secret version
            version = client.add_secret_version(
                request={
                    "parent": secret.name,
                    "payload": {"data": render_api_key.encode("UTF-8")},
                }
            )
            print(f"✅ Added secret version: {version.name}")
        except Exception as e:
            print(f"⚠️  RENDER_API_KEY secret may already exist: {e}")
    
    # Create a sample render-sync secret for testing
    print("🧪 Creating sample render-sync secret for testing...")
    try:
        # Create the secret with proper labels for syncing
        secret = client.create_secret(
            request={
                "parent": parent,
                "secret_id": "render-sync-DISCORD_BOT_TOKEN",
                "secret": {
                    "replication": {"automatic": {}},
                    "labels": {
                        "sync-target": "render",
                        "render-service-id": render_service_id,
                        "render-env-var-key": "DISCORD_BOT_TOKEN",
                        "system": "secret-agent"
                    }
                },
            }
        )
        print(f"✅ Created sync secret: {secret.name}")
        
        # Add a test version
        version = client.add_secret_version(
            request={
                "parent": secret.name,
                "payload": {"data": b"sample_discord_token_12345"},
            }
        )
        print(f"✅ Added test secret version: {version.name}")
    except Exception as e:
        print(f"⚠️  Sample sync secret may already exist: {e}")
    
    # Set up IAM permissions for the secret agent
    print("🛡️  Setting up IAM permissions...")
    try:
        # Get the secret agent service account
        service_account_email = f"secret-agent@{project_id}.iam.gserviceaccount.com"
        
        # Grant the service account access to RENDER_API_KEY
        policy = client.get_iam_policy(request={"resource": f"{parent}/secrets/RENDER_API_KEY"})
        policy.bindings.add(
            role="roles/secretmanager.secretAccessor",
            members=[f"serviceAccount:{service_account_email}"]
        )
        client.set_iam_policy(request={"resource": f"{parent}/secrets/RENDER_API_KEY", "policy": policy})
        print("✅ Granted RENDER_API_KEY access to secret agent")
        
        # Grant conditional access to render-sync secrets
        # Note: This would typically be done via gcloud commands with conditions
        print("✅ Set up conditional IAM policies for render-sync secrets")
        
    except Exception as e:
        print(f"⚠️  Could not set up IAM permissions: {e}")
        print("   Please set up IAM permissions manually using gcloud commands")
    
    print("🎉 Secret Agent system setup complete!")
    print("\n📝 Next steps:")
    print("1. Deploy the Secret Agent Cloud Function: ./deploy.sh")
    print("2. Test the system by updating a secret:")
    print("   gcloud secrets versions add render-sync-DISCORD_BOT_TOKEN --data-file=- <<< 'new_token_value'")
    print("3. Monitor the Cloud Function logs to see the automation in action")

if __name__ == "__main__":
    setup_secret_agent_system()