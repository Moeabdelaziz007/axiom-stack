# 🔐 Secret Agent - Complete Setup Guide

## 🎯 Overview

This guide provides step-by-step instructions to set up the complete Secret Agent system for automated secret lifecycle management.

## 📋 Prerequisites

Before beginning the setup, ensure you have:

1. Google Cloud Project with billing enabled
2. `gcloud` CLI installed and authenticated
3. `solana-cli` installed (for Solana key generation)
4. Render account with API key
5. Discord developer account (for bot token)

## 🚀 Setup Process

### Phase 1: Pre-Setup (Manual)

1. **Enable Required APIs** in your Google Cloud Project:
   ```bash
   gcloud services enable secretmanager.googleapis.com
   gcloud services enable pubsub.googleapis.com
   gcloud services enable eventarc.googleapis.com
   gcloud services enable run.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

2. **Create RENDER_API_KEY** from Render Dashboard (Account Settings)

3. **Create DISCORD_BOT_TOKEN** from Discord Developer Portal

### Phase 2: Infrastructure Setup

1. **Run the infrastructure setup script**:
   ```bash
   chmod +x setup-infrastructure.sh
   ./setup-infrastructure.sh
   ```

   This script will:
   - Create service accounts for the Secret Agent and Eventarc trigger
   - Create the Pub/Sub topic for secret updates
   - Apply IAM policies with zero-trust security model

### Phase 3: Secret Injection

1. **Run the secret setup script**:
   ```bash
   chmod +x setup-secrets.sh
   ./setup-secrets.sh
   ```

2. **Inject Discord token**:
   ```bash
   chmod +x inject-manual-secret.sh
   ./inject-manual-secret.sh render-sync-DISCORD srv-YOUR_BOT_SERVICE_ID DISCORD_BOT_TOKEN
   ```

3. **Create and inject Solana key**:
   ```bash
   chmod +x create-solana-key.sh
   ./create-solana-key.sh render-sync-PAYER srv-YOUR_ORCHESTRATOR_ID SOLANA_PAYER_KEY
   ```

### Phase 4: Agent Deployment

1. **Deploy the Secret Agent**:
   ```bash
   chmod +x deploy-agent.sh
   ./deploy-agent.sh
   ```

## 🧪 Testing the System

To test the complete system:

1. Update a secret:
   ```bash
   echo "new_test_value" > new_token.txt
   gcloud secrets versions add render-sync-DISCORD --data-from-file="new_token.txt"
   ```

2. Monitor the Cloud Function logs:
   ```bash
   gcloud functions logs read secret-agent --limit 50
   ```

## 🔧 Maintenance Commands

### Add a new secret for Render sync:
```bash
./inject-manual-secret.sh render-sync-NEW_SECRET srv-YOUR_SERVICE_ID ENV_VAR_NAME
```

### Update an existing secret:
```bash
echo "new_value" | gcloud secrets versions add render-sync-SECRET_NAME --data-file=-
```

### Check secret labels:
```bash
gcloud secrets describe SECRET_NAME --format="value(labels)"
```

## 🛡️ Security Features

The Secret Agent implements a zero-trust security model:

1. **No .env files** in production
2. **Least privilege IAM policies** with conditional access
3. **Master key isolation** for Render API access
4. **Per-resource IAM bindings** instead of broad project-level roles

## 📈 Monitoring

Monitor the Secret Agent through:

1. **Cloud Function logs**:
   ```bash
   gcloud functions logs read secret-agent
   ```

2. **Pub/Sub message delivery**:
   ```bash
   gcloud pubsub subscriptions pull projects/PROJECT_ID/subscriptions/SECRET_UPDATES_SUB --auto-ack
   ```

3. **Render deployment status** through the Render dashboard

## 🔄 Automation Flow

1. **Initiation**: Developer runs `gcloud secrets versions add`
2. **Event**: GCSM publishes `SECRET_VERSION_ADD` to Pub/Sub
3. **Trigger**: Eventarc invokes Secret Agent Cloud Function
4. **Processing**: Agent parses event payload and extracts metadata
5. **Routing**: Agent reads labels to determine target service
6. **Fetch**: Agent securely retrieves both RENDER_API_KEY and new secret value
7. **Execution**: Agent calls Render API to update env var and trigger deploy

## 🆘 Troubleshooting

### Common Issues

1. **Permission denied errors**:
   - Verify IAM policies are correctly applied
   - Check that service accounts exist
   - Ensure conditional access is properly configured

2. **Secret not syncing**:
   - Verify secret has correct labels (`sync-target=render`, etc.)
   - Check that the secret name starts with `render-sync-`
   - Confirm Pub/Sub topic is correctly attached to the secret

3. **Render API errors**:
   - Verify RENDER_API_KEY is correctly injected
   - Check that the service account has access to the RENDER_API_KEY secret
   - Confirm Render service ID is correct

### Debugging Commands

1. **Check service accounts**:
   ```bash
   gcloud iam service-accounts list
   ```

2. **Check IAM policies**:
   ```bash
   gcloud projects get-iam-policy PROJECT_ID
   ```

3. **Check secret details**:
   ```bash
   gcloud secrets describe SECRET_NAME
   ```

## 🎉 Success!

Once the setup is complete, you'll have a fully automated secret lifecycle management system that:

- Automatically syncs secrets to Render services
- Triggers deployments when secrets are updated
- Implements zero-trust security principles
- Requires no manual intervention after initial setup