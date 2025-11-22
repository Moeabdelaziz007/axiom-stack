#!/usr/bin/env bash
# scripts/inject-meta-secrets.sh
# Purpose: Upload Meta (Facebook/Instagram/WhatsApp) secrets to Cloudflare Workers

set -euo pipefail

echo "🔐 Starting Meta secrets injection to Cloudflare Workers..."

# Load environment variables from .env
if [[ -f .env ]]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "❌ .env file not found"
  exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &>/dev/null; then
  echo "❌ wrangler not installed. Installing globally..."
  npm install -g wrangler
fi

# Worker name (adjust if different)
WORKER_NAME="social-agent"

# Required secrets
required_vars=(
  GEMINI_API_KEY
  META_ACCESS_TOKEN
  META_PAGE_ID
  FACEBOOK_APP_ID
  FACEBOOK_APP_SECRET
  WHATSAPP_PHONE_NUMBER_ID
)

# Verify all required variables exist
for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "❌ Missing required variable: $var"
    exit 1
  fi
done

echo "✅ All required variables found"
echo "📤 Uploading secrets to worker: $WORKER_NAME"

# Upload secrets to Cloudflare Workers
wrangler secret put GEMINI_API_KEY <<<"$GEMINI_API_KEY"
wrangler secret put META_ACCESS_TOKEN <<<"$META_ACCESS_TOKEN"
wrangler secret put META_PAGE_ID <<<"$META_PAGE_ID"
wrangler secret put FACEBOOK_APP_ID <<<"$FACEBOOK_APP_ID"
wrangler secret put FACEBOOK_APP_SECRET <<<"$FACEBOOK_APP_SECRET"
wrangler secret put WHATSAPP_PHONE_NUMBER_ID <<<"$WHATSAPP_PHONE_NUMBER_ID"

echo ""
echo "✅ All secrets uploaded successfully to worker: $WORKER_NAME"
echo "🚀 You can now deploy and test the social agent"
