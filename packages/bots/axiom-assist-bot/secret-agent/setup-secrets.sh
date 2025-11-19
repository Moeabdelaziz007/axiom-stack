#!/bin/bash

# setup-secrets.sh - Setup script for injecting initial secrets
set -e

PROJECT_ID=$(gcloud config get-value project)
AGENT_SA_EMAIL="sa-secret-agent@$PROJECT_ID.iam.gserviceaccount.com"

# 1. حقن "المفتاح الرئيسي" (RENDER_API_KEY)
echo "Injecting Master Key (RENDER_API_KEY)..."
echo -n "Enter RENDER_API_KEY (hidden): " && read -s RENDER_KEY && echo
echo -n "$RENDER_KEY" | gcloud secrets create RENDER_API_KEY \
  --replication-policy="automatic" \
  --data-file=-

# 2. منح "الوكيل" حق الوصول *فقط* إلى هذا المفتاح [16, 25]
echo "Securing Master Key..."
gcloud secrets add-iam-policy-binding RENDER_API_KEY \
  --member="serviceAccount:$AGENT_SA_EMAIL" \
  --role="roles/secretmanager.secretAccessor"

# 3. حقن الأسرار القابلة للمزامنة (استخدام البرامج النصية من المرحلة 4)
# (افترض أن 'inject_manual_secret.sh' و 'create_solana_key.sh' موجودان)
echo "Secret injection setup complete."
echo ""
echo "Next steps:"
echo "1. Run ./inject_manual_secret.sh to inject Discord token:"
echo "   ./inject_manual_secret.sh render-sync-DISCORD srv-YOUR_BOT_SERVICE_ID DISCORD_BOT_TOKEN"
echo ""
echo "2. Run ./create_solana_key.sh to create Solana key:"
echo "   ./create_solana_key.sh render-sync-PAYER srv-YOUR_ORCHESTRATOR_ID SOLANA_PAYER_KEY"