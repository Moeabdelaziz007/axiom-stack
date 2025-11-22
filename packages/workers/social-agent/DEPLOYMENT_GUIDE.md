# 🎤 Social Agent - Deployment Success Guide

## ✅ DEPLOYMENT COMPLETE

**Worker URL:** `https://social-agent.amrikyy.workers.dev`  
**Status:** ✅ ONLINE  
**Version:** 2.0.0 - Holistic Edition

---

## 🔐 STEP 1: Set CRON_SECRET

Run this command to create a secure trigger key:

```bash
cd /Users/cryptojoker710/Desktop/Axiom\ ID/axiom-stack/packages/workers/social-agent
npx wrangler secret put CRON_SECRET
```

When prompted, enter a strong random password (minimum 32 characters).  
**Example:** `axiom_2025_spokesperson_ultra_secure_key_v1`

**Save this password** - you'll need it for cron-job.org setup!

---

## 📅 STEP 2: Setup Free Cron Jobs

Go to **<https://cron-job.org>** and create a free account.

### Job 1: The Wins (Trading Stats)

- **Title:** `Axiom Social - Wins Pillar`
- **URL:** `https://social-agent.amrikyy.workers.dev/trigger?pillar=wins&key=YOUR_SECRET_HERE`
- **Schedule:** Every day at **09:00 UTC**
- **Timezone:** UTC
- **Request Method:** GET

### Job 2: The Build (Tech Progress)

- **Title:** `Axiom Social - Tech Pillar`
- **URL:** `https://social-agent.amrikyy.workers.dev/trigger?pillar=tech&key=YOUR_SECRET_HERE`
- **Schedule:** Every day at **14:00 UTC** (2 PM)
- **Timezone:** UTC
- **Request Method:** GET

### Job 3: The Vision (Philosophy)

- **Title:** `Axiom Social - Vision Pillar`
- **URL:** `https://social-agent.amrikyy.workers.dev/trigger?pillar=vision&key=YOUR_SECRET_HERE`
- **Schedule:** Every day at **20:00 UTC** (8 PM)
- **Timezone:** UTC
- **Request Method:** GET

**Replace `YOUR_SECRET_HERE` with the password you set in Step 1!**

---

## 🧪 STEP 3: Manual Test (Optional)

Before setting up cron, test manually:

```bash
# Replace YOUR_SECRET with your actual CRON_SECRET
curl "https://social-agent.amrikyy.workers.dev/trigger?pillar=wins&key=YOUR_SECRET"
```

**Expected Response:**

```json
{
  "success": true,
  "pillar": "wins",
  "miningResult": {
    "type": "wins",
    "title": "$SOL Trade Victory",
    "timestamp": "2025-01-22T09:00:00Z"
  },
  "publishResults": [
    { "channel": "telegram", "success": false, "error": "Missing credentials" },
    { "channel": "discord", "success": false, "error": "Missing webhook URL" },
    { "channel": "facebook", "success": false, "error": "Missing access token" }
  ]
}
```

**Note:** Publish will fail initially because we haven't set up channel credentials yet. That's OK! The miner is working.

---

## 📱 STEP 4: Enable Publishing Channels

### Telegram Setup

```bash
# 1. Create bot via @BotFather on Telegram
# 2. Get your bot token
# 3. Create a channel and add the bot as admin
# 4. Get channel ID (use @username_to_id_bot)

npx wrangler secret put TELEGRAM_BOT_TOKEN
# Enter: bot123456:ABC-DEF...

npx wrangler secret put TELEGRAM_CHANNEL_ID
# Enter: @your_channel or -100123456789
```

### Discord Setup

```bash
# 1. Create webhook: Server Settings > Integrations > Webhooks
# 2. Copy webhook URL

npx wrangler secret put DISCORD_WEBHOOK_URL
# Enter: https://discord.com/api/webhooks/...
```

### Facebook Setup

```bash
# 1. Create Facebook Page
# 2. Create Facebook App: developers.facebook.com
# 3. Get Page Access Token

npx wrangler secret put PAGE_ACCESS_TOKEN
# Enter: EAAxxxxxxx...
```

### GitHub (For Tech Pillar)

```bash
# 1. Generate PAT: github.com/settings/tokens
# 2. Permissions: read:repo

npx wrangler secret put GITHUB_TOKEN
# Enter: github_pat_...
```

---

## 🎯 Next Steps

### Today

1. ✅ Set CRON_SECRET
2. ✅ Setup 3 cron jobs on cron-job.org
3. ✅ Test manual trigger
4. ⏳ Setup at least one channel (Telegram recommended)

### Tomorrow

1. Monitor first automated post
2. Check engagement
3. Add more channels (Discord, Facebook)

### This Week

1. Create KV namespace for Whitepaper snippets
2. Deploy Video Engine to Cloud Run
3. Integrate video generation with Social Agent

---

## 📊 How It Works

```
09:00 UTC Daily
    ↓
cron-job.org hits /trigger?pillar=wins
    ↓
Social Agent Worker wakes up
    ↓
Miner fetches BigQuery data (or mock)
    ↓
Axiom Brain generates caption
    ↓
Publisher posts to Telegram/Discord/Facebook
    ↓
Success! 🎉
```

**Cost:** $0.00 (Cloudflare 100k req/day + cron-job.org free tier)

---

## 🚨 Troubleshooting

### "Unauthorized" error

- Check that `key=` parameter matches your CRON_SECRET exactly

### "Invalid pillar" error

- Ensure `pillar=` is one of: `wins`, `tech`, or `vision`

### Publish fails with "Missing credentials"

- This is normal until you run `wrangler secret put` for each channel
- Start with just Telegram for testing

### Cron not triggering

- Verify URL in cron-job.org has no typos
- Check "Execution History" in cron-job.org dashboard

---

**Status:** 🟢 LIVE & READY  
**Deployed:** 2025-11-22 09:14 UTC  
**Next Scheduled Post:** Set by your cron jobs!
