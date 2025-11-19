# 🔐 Secret Agent - Automated Secret Lifecycle Management

A secure, automated system for managing the complete lifecycle of secrets in cloud environments, implementing a Zero-Trust architecture with Google Secret Manager and Render.

## 🎯 Overview

The Secret Agent system automates the process of secret rotation and synchronization between Google Secret Manager and Render services. When a secret is updated in GCSM, the Secret Agent automatically:

1. Detects the secret update via Pub/Sub events
2. Retrieves the new secret value
3. Updates the corresponding environment variable in Render
4. Triggers a new deployment to apply the changes

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│   Developer     │────│  Google Secret Mgr   │────│  Secret Agent    │
│ (gcloud update) │    │   (Central Vault)    │    │ (Cloud Function) │
└─────────────────┘    └──────────────────────┘    └─────────┬────────┘
                                    │                         │
                                    ▼                         ▼
                              Pub/Sub Topic          ┌─────────────┐
                              (secret-updates)       │  Render API │
                                                     └──────┬──────┘
                                                            │
                                                            ▼
                                                    ┌──────────────┐
                                                    │ Render Serv. │
                                                    │ (Auto-deploy)│
                                                    └──────────────┘
```

## 🚀 Quick Start

### 1. Prerequisites
- Google Cloud Project with Secret Manager API enabled
- Render account with API key
- gcloud CLI installed and configured

### 2. Setup
```bash
# Set environment variables
export GOOGLE_CLOUD_PROJECT_ID="your-project-id"
export RENDER_API_KEY="your-render-api-key"
export RENDER_SERVICE_ID="your-render-service-id"

# Run setup script
python setup-secrets.py
```

### 3. Deploy
```bash
# Deploy the Secret Agent Cloud Function
./deploy.sh
```

### 4. Test
```bash
# Update a secret to trigger automation
gcloud secrets versions add render-sync-DISCORD_BOT_TOKEN --data-file=- <<< "new_discord_token"
```

## 🔧 Configuration

### Secret Labels for Render Sync
Secrets intended for Render synchronization must have these labels:
- `sync-target`: "render"
- `render-service-id`: Your Render service ID
- `render-env-var-key`: The environment variable name in Render

Example:
```bash
gcloud secrets create render-sync-DISCORD_BOT_TOKEN \
  --replication-policy="automatic" \
  --labels=sync-target=render,render-service-id=srv-123abc,render-env-var-key=DISCORD_BOT_TOKEN
```

## 🛡️ Security Features

### Zero-Trust Architecture
- No .env files in production
- Least privilege IAM policies
- Conditional access based on secret names
- Master key isolation for Render API access

### IAM Permissions
The Secret Agent service account requires:
- `roles/secretmanager.secretAccessor` for RENDER_API_KEY
- Conditional `roles/secretmanager.secretAccessor` for render-sync-* secrets

## 📈 Monitoring

Monitor the Secret Agent through:
- Cloud Function logs
- Pub/Sub message delivery
- Render deployment status

## 🔄 Automation Flow

1. **Initiation**: Developer runs `gcloud secrets versions add`
2. **Event**: GCSM publishes `SECRET_VERSION_ADD` to Pub/Sub
3. **Trigger**: Eventarc invokes Secret Agent Cloud Function
4. **Processing**: Agent parses event payload and extracts metadata
5. **Routing**: Agent reads labels to determine target service
6. **Fetch**: Agent securely retrieves both RENDER_API_KEY and new secret value
7. **Execution**: Agent calls Render API to update env var and trigger deploy

## 📝 Usage Examples

### Add a new secret for Render sync:
```bash
gcloud secrets create render-sync-API_KEY \
  --replication-policy="automatic" \
  --labels=sync-target=render,render-service-id=srv-xyz123,render-env-var-key=API_KEY
```

### Update a secret value:
```bash
gcloud secrets versions add render-sync-API_KEY --data-file=- <<< "new_api_key_value"
```

The Secret Agent will automatically update the Render environment variable and trigger a new deployment.