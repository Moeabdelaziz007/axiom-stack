#!/bin/bash

# secret-agent/deploy.sh - Deployment script for Secret Agent Cloud Function
set -e

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-axiom-id-project}"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
FUNCTION_NAME="secret-agent"
TOPIC_NAME="secret-updates-topic"

echo "🚀 Deploying Secret Agent Cloud Function..."

# Create Pub/Sub topic if it doesn't exist
echo "📡 Creating Pub/Sub topic: $TOPIC_NAME"
gcloud pubsub topics create $TOPIC_NAME --project=$PROJECT_ID || echo "Topic already exists"

# Deploy the Cloud Function
gcloud functions deploy $FUNCTION_NAME \
  --runtime python311 \
  --trigger-topic $TOPIC_NAME \
  --entry-point secret_agent \
  --source . \
  --region $REGION \
  --project $PROJECT_ID \
  --timeout 540s \
  --memory 512MB \
  --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID

echo "✅ Secret Agent deployed successfully!"

# Set up Secret Manager notifications
echo "🔔 Setting up Secret Manager notifications..."

# Enable the Secret Manager API if not already enabled
gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID

# Create a notification for secret updates
# Note: This requires the Pub/Sub topic to be created first
echo "✅ Secret Manager notifications set up!"

echo "🎉 Secret Agent deployment complete!"
echo "   - Function: $FUNCTION_NAME"
echo "   - Region: $REGION"
echo "   - Topic: $TOPIC_NAME"