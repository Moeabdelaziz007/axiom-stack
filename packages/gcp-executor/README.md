# AxiomID GCP Executor

Cloud Run service for executing complex mathematical analysis and computational tasks.

## 🎯 Purpose

This service handles resource-intensive computational tasks that are better suited for a dedicated execution environment rather than running directly in Cloudflare Workers.

## 🏗️ Architecture

- **Runtime**: Python 3.11 on Cloud Run
- **Framework**: Flask
- **Trigger**: Google Cloud Pub/Sub Push Subscription
- **FinOps**: Optimized for 512MiB memory limit

## 🚀 Deployment

### Prerequisites
1. Google Cloud SDK installed and configured
2. Docker installed
3. Appropriate IAM permissions for Cloud Run and Pub/Sub

### Build and Deploy

```bash
# Navigate to the service directory
cd packages/gcp-executor

# Build the container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/axiom-gcp-executor

# Deploy to Cloud Run with FinOps constraints
gcloud run deploy axiom-gcp-executor \
  --image gcr.io/YOUR_PROJECT_ID/axiom-gcp-executor \
  --platform managed \
  --region us-central1 \
  --cpu 0.08 \
  --memory 512Mi \
  --max-instances 10 \
  --allow-unauthenticated
```

## 🧪 Testing

```bash
# Run the test script
python test_executor.py
```

## 📦 Dependencies

- Flask: Web framework
- Requests: HTTP client
- Google Cloud Pub/Sub: Message queuing

## 🔐 Security

- Runs as non-root user
- Minimal base image (python:3.11-slim-buster)
- No unnecessary system packages