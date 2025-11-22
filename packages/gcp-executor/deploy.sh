#!/bin/bash
# Cloud Run Deployment Script for GCP Executor (Media Studio)

set -e  # Exit on error

echo "🚀 Deploying GCP Executor (Media Studio) to Cloud Run..."
echo ""

# Configuration
PROJECT_ID="gen-lang-client-0187059217"
REGION="us-central1"
SERVICE_NAME="gcp-executor"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "📋 Configuration:"
echo "   Project: ${PROJECT_ID}"
echo "   Region: ${REGION}"
echo "   Service: ${SERVICE_NAME}"
echo "   Image: ${IMAGE_NAME}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "⚠️  Not authenticated. Running gcloud auth login..."
    gcloud auth login
fi

# Set project
echo "🔧 Setting GCP project..."
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo "🔌 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build Docker image
echo ""
echo "🏗️  Building Docker image..."
docker build -t ${IMAGE_NAME}:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Push to Google Container Registry
echo ""
echo "📤 Pushing image to GCR..."
docker push ${IMAGE_NAME}:latest

if [ $? -ne 0 ]; then
    echo "❌ Docker push failed!"
    exit 1
fi

# Deploy to Cloud Run
echo ""
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
    --image ${IMAGE_NAME}:latest \
    --platform managed \
    --region ${REGION} \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --timeout 300s \
    --max-instances 10 \
    --set-env-vars="PYTHONUNBUFFERED=1"

if [ $? -ne 0 ]; then
    echo "❌ Cloud Run deployment failed!"
    exit 1
fi

# Get service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
    --platform managed \
    --region ${REGION} \
    --format 'value(status.url)')

echo ""
echo "=================================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "=================================================="
echo ""
echo "📍 Service URL: ${SERVICE_URL}"
echo ""
echo "🧪 Test endpoints:"
echo "   Health: curl ${SERVICE_URL}/"
echo "   Image:  curl -X POST ${SERVICE_URL}/media/image -d '{\"prompt\":\"test\"}'"
echo "   Voice:  curl -X POST ${SERVICE_URL}/media/voice -d '{\"text\":\"test\"}'"
echo "   Video:  curl -X POST ${SERVICE_URL}/render-video -d '{\"script_en\":\"test\",\"script_ar\":\"test\"}'"
echo ""
echo "🔗 Add this URL to social-agent wrangler.json:"
echo "   GCP_EXECUTOR_URL: \"${SERVICE_URL}\""
echo ""
