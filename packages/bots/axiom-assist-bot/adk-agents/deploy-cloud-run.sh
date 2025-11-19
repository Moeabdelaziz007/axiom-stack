#!/bin/bash

# Single-step build & deploy script for Axiom ADK Agent to Google Cloud Run
# This script assumes you have gcloud CLI installed and configured

# Set variables (modify these as needed)
PROJECT_ID=${PROJECT_ID:-"your-gcp-project-id"}
REGION=${REGION:-"us-central1"}
ORCHESTRATOR_CALLBACK_URL=${ORCHESTRATOR_CALLBACK_URL:-"https://YOUR-ORCHESTRATOR-SERVICE-URL/adk-callback"}

echo "Deploying Axiom ADK Agent to Cloud Run..."

# Single-step build & deploy command using --source
gcloud run deploy axiom-adk-agent \
  --source ./adk-agents \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars=ORCHESTRATOR_CALLBACK_URL="$ORCHESTRATOR_CALLBACK_URL" \
  --project=$PROJECT_ID

echo "Deployment complete!"