#!/bin/bash

# deploy.sh - Deployment script for the monitoring Cloud Function

# Exit on any error
set -e

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-axiom-id-project}"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
FUNCTION_NAME="axiom-agent-monitoring"
TRIGGER_TOPIC="agent-monitoring-trigger"

echo "🚀 Deploying Axiom Agent Monitoring Function..."

# Deploy the Cloud Function
gcloud functions deploy $FUNCTION_NAME \
  --runtime nodejs20 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point monitorAgents \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --timeout 540s \
  --memory 512MB \
  --set-env-vars GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID,SOLANA_RPC_URL=https://api.devnet.solana.com

echo "✅ Function deployed successfully!"

# Create Cloud Scheduler job to trigger the function every 6 hours
echo "🕒 Setting up Cloud Scheduler job..."

gcloud scheduler jobs create http $FUNCTION_NAME-scheduler \
  --schedule "0 */6 * * *" \
  --uri "https://$REGION-$PROJECT_ID.cloudfunctions.net/$FUNCTION_NAME" \
  --http-method GET \
  --project $PROJECT_ID \
  --region $REGION

echo "✅ Cloud Scheduler job created successfully!"

echo "🎉 Deployment complete!"
echo "   - Function: $FUNCTION_NAME"
echo "   - Region: $REGION"
echo "   - Schedule: Every 6 hours"
echo "   - Trigger: Cloud Scheduler"