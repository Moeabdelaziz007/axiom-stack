# ⚙️ Environment Configuration Guide

## ✅ Configuration Complete

Your `.env.local` file has been configured with production URLs from `render.yaml`.

### Current Configuration

```bash
# Cloudflare Worker URLs
NEXT_PUBLIC_AGENT_FACTORY_URL=https://axiom-brain.amrikyy.workers.dev
NEXT_PUBLIC_BRAIN_URL=https://axiom-brain.amrikyy.workers.dev

# Render API Services
NEXT_PUBLIC_API_URL=https://api.axiomid.app
NEXT_PUBLIC_SOCKET_URL=https://socket.axiomid.app
NEXT_PUBLIC_SITE_URL=https://app.axiomid.app

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_AXIOM_PROGRAM_ID=CcrbGS99N45XPZBLRxeN6q76P93iog6qGdLAiK839d6g

# Google Cloud Services
NEXT_PUBLIC_AGENT_SERVICE_URL=https://axiom-superpower-host-abc123.a.run.app
```

## Verification

After setting up, verify the environment variables are loaded:

```bash
cd packages/web-ui
npm run dev
```

The "Create Agent" wizard will use `NEXT_PUBLIC_AGENT_FACTORY_URL` when you click "INITIALIZE AGENT".

## Testing Endpoints

### Test Agent Factory (Cloudflare Worker)

```bash
curl https://axiom-brain.amrikyy.workers.dev/health
```

### Test Spawn Endpoint

```bash
curl -X POST https://axiom-brain.amrikyy.workers.dev/spawn \
  -H "Content-Type: application/json" \
  -d '{
    "identity": {
      "name": "Test Agent",
      "ticker": "TEST",
      "description": "Test"
    },
    "genesis_rules": {
      "constitution": {
        "stop_loss_pct": 10,
        "max_slippage": 1
      },
      "risk_tolerance": 50
    },
    "knowledge_sources": []
  }'
```

---

**Note:** `.env.local` is gitignored for security. Never commit this file to version control.
