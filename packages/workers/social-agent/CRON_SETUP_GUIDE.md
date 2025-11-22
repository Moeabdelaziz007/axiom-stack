# 📅 Cron-Job.org Setup Guide

## Step 1: Create Account

1. Go to: **<https://cron-job.org>**
2. Click "Sign up for free"
3. Enter your email
4. Verify email
5. Login

---

## Step 2: Create First Job (The Wins - 9 AM)

Click **"Create cronjob"** button, then fill:

### Basic Settings

- **Title:** `Axiom Social - Wins Pillar`
- **Address (URL):**

  ```
  https://social-agent.amrikyy.workers.dev/trigger?pillar=wins&key=axiom_social_agent_2025_secure_key_1732263130
  ```

  ⚠️ **IMPORTANT:** Copy this URL exactly!

### Schedule

- **Pattern:** Select "Every day"
- **At (time):** `09:00`
- **Timezone:** Select `(GMT+00:00) UTC`

### Advanced (keep defaults)

- **Request method:** GET
- **Request timeout:** 30 seconds
- **Enabled:** ✅ YES (checked)

Click **"Create cronjob"** button at bottom.

---

## Step 3: Create Second Job (The Build - 2 PM)

Click **"Create cronjob"** again:

### Basic Settings

- **Title:** `Axiom Social - Tech Pillar`
- **Address (URL):**

  ```
  https://social-agent.amrikyy.workers.dev/trigger?pillar=tech&key=axiom_social_agent_2025_secure_key_1732263130
  ```

### Schedule

- **Pattern:** Every day
- **At (time):** `14:00`
- **Timezone:** UTC

Click **"Create cronjob"**.

---

## Step 4: Create Third Job (The Vision - 8 PM)

Click **"Create cronjob"** one more time:

### Basic Settings

- **Title:** `Axiom Social - Vision Pillar`
- **Address (URL):**

  ```
  https://social-agent.amrikyy.workers.dev/trigger?pillar=vision&key=axiom_social_agent_2025_secure_key_1732263130
  ```

### Schedule

- **Pattern:** Every day
- **At (time):** `20:00`
- **Timezone:** UTC

Click **"Create cronjob"**.

---

## ✅ Verification

You should now see 3 jobs in your dashboard:

| Job Title | Schedule | Next Run |
|-----------|----------|----------|
| Axiom Social - Wins Pillar | Daily at 09:00 UTC | (shows next trigger time) |
| Axiom Social - Tech Pillar | Daily at 14:00 UTC | (shows next trigger time) |
| Axiom Social - Vision Pillar | Daily at 20:00 UTC | (shows next trigger time) |

---

## 🧪 Test Now (Optional)

Don't want to wait? Test manually:

1. In cron-job.org dashboard
2. Click the **"▶️ Execute now"** button next to any job
3. Check "Execution history" tab
4. Should show: ✅ Success (200 OK)
5. Check your Telegram - you should receive a message!

---

## 📊 What Happens Daily

### 9:00 AM UTC (11:00 AM Egypt Time)

- Cron triggers `/trigger?pillar=wins`
- Social Agent queries BigQuery (or mock data)
- Gemini generates caption
- Posts to Telegram: "🚀 Market Victory! Closed $SOL..."

### 2:00 PM UTC (4:00 PM Egypt Time)

- Cron triggers `/trigger?pillar=tech`
- Social Agent checks GitHub commits
- Posts: "🛠️ The Build: New feature deployed..."

### 8:00 PM UTC (10:00 PM Egypt Time)

- Cron triggers `/trigger?pillar=vision`
- Social Agent reads Whitepaper snippet
- Posts: "🔮 Vision: The future of autonomous agents..."

---

## 🚨 Troubleshooting

### "Failed (403 Forbidden)"

- Check that you copied the URL exactly
- The `key=` parameter must match CRON_SECRET

### "Failed (404 Not Found)"

- Worker URL might be wrong
- Verify: <https://social-agent.amrikyy.workers.dev/>

### "Success but no Telegram message"

- Check worker logs in Cloudflare dashboard
- Verify TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set

---

## 📱 How to Check Logs

1. Go to: <https://dash.cloudflare.com>
2. Workers & Pages → social-agent
3. Logs tab
4. See real-time execution logs

---

**Status:** Ready to automate! 🚀  
**Cost:** $0.00 forever  
**Next Post:** Tomorrow at 9:00 AM UTC
