#!/bin/bash

# deploy-agent.sh - Deployment script for Secret Agent Cloud Function
set -e

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
AGENT_SA_EMAIL="sa-secret-agent@$PROJECT_ID.iam.gserviceaccount.com"
TRIGGER_SA_EMAIL="sa-eventarc-trigger@$PROJECT_ID.iam.gserviceaccount.com"

# 1. نشر "الوكيل" (Cloud Function V2)
echo "Deploying Secret Agent..."
gcloud run deploy secret-agent \
  --source . \
  --region $REGION \
  --platform "managed" \
  --entry-point "secret_agent_handler" \
  --runtime "python311" \
  --timeout "300s" \
  --no-allow-unauthenticated \
  --service-account $AGENT_SA_EMAIL \
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID" \
  --set-secrets="RENDER_API_KEY=RENDER_API_KEY:latest" # [41, 42]

# 2. ربط المُشغّل (Trigger)
echo "Creating Eventarc trigger..."
gcloud eventarc triggers create secret-agent-trigger \
  --destination-run-service="secret-agent" \
  --destination-run-region=$REGION \
  --location=$REGION \
  --event-filters="type=google.cloud.pubsub.topic.v1.messagePublished" \
  --transport-topic="projects/$PROJECT_ID/topics/secret-updates-topic" \
  --service-account=$TRIGGER_SA_EMAIL

echo "DEPLOYMENT COMPLETE. The 'Secret Agent' is now live."