# 🎤 Axiom ID - Social Agent (Spokesperson)

**Version:** 2.0.0 - Holistic Edition  
**Role:** Chief Spokesperson (Automated Social Media Manager)

The Social Agent is Axiom ID's autonomous voice across social media. It monitors 3 data pillars, generates engaging content using AI, and publishes to multiple channels—all at **$0 cost** using external free cron triggers.

---

## 🏗️ Architecture: The 3-Pillar Content Strategy

### **Pillar A: The Wins** (Trading Stats) 🚀

- **Data Source:** BigQuery (via Tool Executor)
- **Schedule:** 9:00 AM UTC
- **Content:** "Market Victory! Closed $SOL position with +12.4% profit."
- **Audience:** Traders, investors

### **Pillar B: The Build** (Tech Progress) 🛠️

- **Data Source:** GitHub API
- **Schedule:** 2:00 PM UTC  
- **Content:** "Core upgrade deployed. Quantum-resistant hashing now active."
- **Audience:** Developers, tech enthusiasts

### **Pillar C: The Vision** (Philosophy) 🔮

- **Data Source:** Whitepaper (KV Storage)
- **Schedule:** 8:00 PM UTC
- **Content:** "Imagine a world where your AI agents work for you..."
- **Audience:** Visionaries, community builders

---

## 🎯 Main Endpoint: `/trigger`

**URL:**  

```
GET https://social-agent.axiomid.workers.dev/trigger?pillar=wins&key=YOUR_SECRET
```

**Parameters:**

- `pillar` (required): `wins` | `tech` | `vision`
- `key` (required): Security token (matches `CRON_SECRET` env var)

**Response:**

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
    { "channel": "telegram", "success": true, "id": "123" },
    { "channel": "discord", "success": true },
    { "channel": "facebook", "success": true, "id": "456" }
  ],
  "summary": {
    "total": 3,
    "success": 3,
    "failed": 0
  }
}
```

---

## 🔐 Setup Instructions

### 1️⃣ **Deploy Worker**

```bash
cd packages/workers/social-agent
npm install
wrangler deploy
```

### 2️⃣ **Set Secrets**

```bash
# Security
wrangler secret put CRON_SECRET
# Enter: [generate random 32-char string]

# Telegram (https://t.me/BotFather)
wrangler secret put TELEGRAM_BOT_TOKEN
wrangler secret put TELEGRAM_CHANNEL_ID

# Discord (Webhook URL from Server Settings)
wrangler secret put DISCORD_WEBHOOK_URL

# Facebook (https://developers.facebook.com)
wrangler secret put PAGE_ACCESS_TOKEN

# GitHub (https://github.com/settings/tokens)
wrangler secret put GITHUB_TOKEN
```

### 3️⃣ **Create KV Namespace (for Whitepaper)**

```bash
wrangler kv:namespace create KV_WHITEPAPER
# Copy the ID and update wrangler.json
```

### 4️⃣ **Seed Whitepaper Snippets** (Optional)

```bash
wrangler kv:key put --namespace-id=YOUR_KV_ID "future_of_work" "Imagine a world where you don't work for money..."
wrangler kv:key put --namespace-id=YOUR_KV_ID "agent_economy" "The transition from human labor to agent labor is inevitable..."
```

### 5️⃣ **Setup Free Cron** (Zero Cost!)

Go to **<https://cron-job.org>** (Free plan: 50 jobs)

**Create 3 Jobs:**

| Time (UTC) | URL | Pillar |
|------------|-----|--------|
| 9:00 AM | `https://social-agent.axiomid.workers.dev/trigger?pillar=wins&key=YOUR_SECRET` | Wins |
| 2:00 PM | `https://social-agent.axiomid.workers.dev/trigger?pillar=tech&key=YOUR_SECRET` | Tech |
| 8:00 PM | `https://social-agent.axiomid.workers.dev/trigger?pillar=vision&key=YOUR_SECRET` | Vision |

---

## 🧪 Testing

### **Manual Test (Without Cron)**

```bash
curl -X POST https://social-agent.axiomid.workers.dev/manual-publish \
  -H "Content-Type: application/json" \
  -d '{
    "pillar": "wins",
    "content": {
      "title": "Test Post",
      "data": {}
    }
  }'
```

### **Check Status**

```bash
curl https://social-agent.axiomid.workers.dev/status
```

---

## 📊 Monitoring Dashboard (Future)

Add to `packages/web-ui/app/dashboard/social-agent/page.tsx`:

- Live status of each pillar
- Recent posts with engagement metrics
- Publish success/failure rates
- Next scheduled post countdown

---

## 🚀 Roadmap

- [x] Pillar A: Trading Wins (BigQuery)
- [x] Pillar B: Tech Updates (GitHub)
- [x] Pillar C: Vision (Whitepaper KV)
- [x] Telegram Publishing
- [x] Discord Publishing
- [x] Facebook Publishing
- [ ] Twitter/X Publishing (OAuth 1.0a)
- [ ] Instagram Stories (Graph API)
- [ ] YouTube Community Posts
- [ ] Bilingual Content (English Hook + Arabic Body)

---

## 🎨 Content Format Examples

### Wins (Trading)

```
🚀 Market Victory!

Closed $SOL position with +12.4% profit.
Volume: $50,000 | Timestamp: 9:00 AM UTC

#crypto #trading #solana
```

### Tech (GitHub)

```
🛠️ The Build: Quantum-resistant hashing

Core upgrade deployed. Our agents are now secured with post-quantum cryptography. The future is being written in code.

Commit: a1b2c3d | Author: Axiom Core Team

#blockchain #tech #security
```

### Vision (Whitepaper)

```
🔮 Vision: The Future of Work

Imagine a world where you don't work for money, but your AI agents do. This isn't science fiction—it's the inevitable evolution of labor.

Read more: axiomid.app/whitepaper

#AI #future #agents
```

---

**Cost Breakdown:**

| Service | Monthly Cost |
|---------|--------------|
| Cloudflare Worker | $0 (100k req/day free) |
| External Cron (cron-job.org) | $0 (50 jobs free) |
| Telegram API | $0 (unlimited) |
| Discord Webhooks | $0 (unlimited) |
| **TOTAL** | **$0.00** ✅ |

---

**Maintained by:** Axiom ID Core Team  
**License:** Internal Use Only
