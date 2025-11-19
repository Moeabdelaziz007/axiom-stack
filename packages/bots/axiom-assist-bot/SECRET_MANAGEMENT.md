# 🔐 Axiom ID Secret Management System

This document describes the secure secret management system for Axiom ID, which uses Google Secret Manager to store and retrieve sensitive credentials at runtime.

## 🎯 Objective

Eliminate the need to store sensitive credentials in `.env` files by using Google Secret Manager as a central vault, with automated key generation and secure runtime access.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│   Developer     │────│  Google Secret Mgr   │────│  Axiom ID System │
│ (Initial Setup) │    │   (Central Vault)    │    │  (Runtime Only)  │
└─────────────────┘    └──────────────────────┘    └──────────────────┘
         │                         │                          │
         ▼                         ▼                          ▼
   Setup Secrets            Store Secrets              Load Secrets at
   Script (Once)        (Sensitive Values Only)       Runtime (No .env)
```

## 🚀 Implementation Steps

### 1. Vault Setup (Infrastructure)

Create secrets in Google Secret Manager:

```bash
# Run the setup script
npm run secrets:setup
```

This creates the following secrets:
- `discord-bot-token` - Discord bot authentication
- `gemini-api-key` - Google Gemini API key
- `pinecone-api-key` - Pinecone vector database key
- `solana-deploy-seed` - Solana wallet seed phrase
- `solana-wallet-keypair` - Solana wallet keypair JSON

### 2. Key Automation (Generation)

The setup script automatically:
1. Reads current values from `.env` file
2. Creates secrets in Google Secret Manager
3. Adds new versions if secrets already exist

### 3. Code Refactor (Runtime Loading)

The system now loads secrets at runtime:
1. Orchestrator loads all secrets during initialization
2. Secrets are cached in memory for performance
3. No sensitive values stored in code or `.env`

### 4. CI/CD Cleanup (Secure Deployment)

After migration:
1. Run `node clean-env.mjs` to remove sensitive values from `.env`
2. Update `.gitignore` to prevent accidental commits
3. Grant appropriate IAM permissions to service accounts

## 🔧 Usage

### Setting up secrets:
```bash
npm run secrets:setup
```

### Cleaning environment file:
```bash
node clean-env.mjs
```

## 🔑 Security Benefits

1. **Zero Secrets in Code**: No sensitive values in repositories
2. **Centralized Management**: Single source of truth for all secrets
3. **Version Control**: Secret versioning with audit trails
4. **Access Control**: Fine-grained IAM permissions
5. **Automatic Rotation**: Easy secret rotation without code changes

## 🛡️ IAM Permissions

Grant secret access to service accounts:
```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/secretmanager.secretAccessor"
```

## 📋 Migration Checklist

- [ ] Install `@google-cloud/secret-manager` dependency
- [ ] Run `npm run secrets:setup` to migrate secrets
- [ ] Update orchestrator to use `secret-loader.mjs`
- [ ] Run `node clean-env.mjs` to clean `.env` file
- [ ] Grant IAM permissions to service accounts
- [ ] Test system with new secret loading
- [ ] Remove sensitive values from version control

## 🆘 Troubleshooting

### Common Issues:
1. **Permission Denied**: Ensure service account has `roles/secretmanager.secretAccessor`
2. **Secret Not Found**: Verify secret names match exactly
3. **Network Issues**: Check Google Cloud credentials and connectivity

### Debug Commands:
```bash
# List all secrets
gcloud secrets list --project=PROJECT_ID

# Access a specific secret version
gcloud secrets versions access latest --secret=SECRET_NAME --project=PROJECT_ID
```