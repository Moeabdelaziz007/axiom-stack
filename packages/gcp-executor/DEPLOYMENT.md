# 🚀 GCP Executor Deployment Guide

## Quick Start

```bash
cd /Users/cryptojoker710/Desktop/Axiom\ ID/axiom-stack/packages/gcp-executor

# 1. Update PROJECT_ID in deploy.sh
#    Edit line 10: PROJECT_ID="your-project-id"

# 2. Run deployment
./deploy.sh
```

That's it! The script handles everything automatically.

---

## What Gets Deployed

**Service:** gcp-executor (Media Studio)

**Endpoints:**

- `/` - Health check
- `/media/image` - AI image generation
- `/media/voice` - Voice synthesis
- `/media/thumbnail` - Thumbnail creation
- `/render-video` - Bilingual video generation

**Resources:**

- Memory: 2GB
- CPU: 2 cores
- Timeout: 5 minutes
- Max instances: 10

---

## Prerequisites

### 1. Install Google Cloud SDK

**macOS:**

```bash
brew install google-cloud-sdk
```

**Or download:** <https://cloud.google.com/sdk/docs/install>

### 2. Create GCP Project

1. Go to: <https://console.cloud.google.com>
2. Create new project (or use existing)
3. Note your PROJECT_ID
4. Enable billing (required for Cloud Run)

### 3. Update deploy.sh

Edit `deploy.sh` line 10:

```bash
PROJECT_ID="your-actual-project-id"  # Change this!
```

---

## Deployment Process

The `deploy.sh` script will:

1. ✅ Authenticate with GCP
2. ✅ Enable required APIs (Cloud Run, Container Registry)
3. ✅ Build Docker image with FFmpeg + fonts
4. ✅ Push to Google Container Registry
5. ✅ Deploy to Cloud Run
6. ✅ Output service URL

**Estimated time:** 5-10 minutes (first deployment)

---

## Testing After Deployment

The script will output your SERVICE_URL. Test it:

```bash
# Health check
curl https://YOUR-SERVICE-URL/

# Test image generation
curl -X POST https://YOUR-SERVICE-URL/media/image \
  -H "Content-Type: application/json" \
  -d '{"prompt":"bitcoin chart","style":"digital-art"}'

# Test voice
curl -X POST https://YOUR-SERVICE-URL/media/voice \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voice":"en_male"}'

# Test video
curl -X POST https://YOUR-SERVICE-URL/render-video \
  -H "Content-Type: application/json" \
  -d '{"script_en":"Test","script_ar":"اختبار","pillar":"wins"}'
```

---

## Integration with Social Agent

After deployment, add the URL to social-agent:

```bash
cd ../workers/social-agent

# Set environment variable
npx wrangler secret put GCP_EXECUTOR_URL
# Enter: https://gcp-executor-xxxxx-uc.a.run.app
```

Then update `wrangler.json`:

```json
{
  "vars": {
    "GCP_EXECUTOR_URL": "https://gcp-executor-xxxxx-uc.a.run.app"
  }
}
```

Redeploy social-agent:

```bash
npx wrangler deploy
```

---

## Cost Estimate

Cloud Run Free Tier:

- 2M requests/month
- 360,000 GB-seconds
- 180,000 vCPU-seconds

**Media Studio Usage:**

- Video generation: ~10s CPU time
- Can handle ~18,000 videos/month FREE
- After that: ~$0.000024 per request

**Monthly cost (within free tier):** $0.00 ✅

---

## Monitoring

View logs:

```bash
gcloud run logs read gcp-executor \
  --platform managed \
  --region us-central1 \
  --limit 50
```

View service details:

```bash
gcloud run services describe gcp-executor \
  --platform managed \
  --region us-central1
```

---

## Troubleshooting

### "Permission denied" during build

```bash
# Authenticate Docker with GCR
gcloud auth configure-docker
```

### "Billing not enabled"

- Go to GCP Console
- Enable billing for the project
- Cloud Run requires active billing

### "Service deployment failed"

```bash
# Check service logs
gcloud run logs read gcp-executor --limit 100
```

### Update existing deployment

```bash
# Just run deploy.sh again!
./deploy.sh
```

---

## Security Notes

- Service is set to `--allow-unauthenticated` (public access)
- For production, consider:
  - Adding authentication
  - Rate limiting
  - Input validation
  - CORS configuration

---

## Next Steps After Deployment

1. ✅ Test all endpoints
2. ✅ Integrate with social-agent
3. ✅ Test automated video posting
4. ✅ Monitor usage and costs
5. ✅ Setup Meta APIs for cross-platform publishing

---

**Status:** Ready to deploy!  
**Time required:** 10 minutes  
**Difficulty:** Easy (automated script)
