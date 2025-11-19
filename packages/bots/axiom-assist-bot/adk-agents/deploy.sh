#!/bin/bash

# Deployment script for Axiom ID Superpower Host to Google Cloud Run
# This script assumes you have gcloud CLI installed and configured

# Set variables
PROJECT_ID=${PROJECT_ID:-"your-gcp-project-id"}
SERVICE_NAME=${SERVICE_NAME:-"axiom-superpower-host"}
REGION=${REGION:-"us-central1"}

echo "Deploying Axiom ID Superpower Host to Cloud Run..."

# Submit the build to Google Cloud Build and deploy to Cloud Run
gcloud builds submit \
  --tag gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --project=$PROJECT_ID \
  .

echo "Build submitted. Deploying to Cloud Run..."

gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project=$PROJECT_ID \
  --port 8080

echo "Deployment complete!"
echo "Service URL: https://$SERVICE_NAME-$REGION-uc.a.run.app"