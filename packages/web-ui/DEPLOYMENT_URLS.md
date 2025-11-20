# 🔍 دليل إيجاد روابط Deployment

## معلومات عن Cloudflare Worker

**اسم Worker:** `axiom-agent-factory`

### كيفية إيجاد رابط Cloudflare Worker

#### الطريقة 1: من لوحة تحكم Cloudflare

1. اذهب إلى [Cloudflare Dashboard](https://dash.cloudflare.com)
2. اضغط على **Workers & Pages**
3. ابحث عن **axiom-agent-factory**
4. انسخ الرابط الذي يظهر بهذا الشكل:

   ```
   https://axiom-agent-factory.YOUR-SUBDOMAIN.workers.dev
   ```

#### الطريقة 2: من Terminal

```bash
cd packages/workers/agent-factory
npx wrangler deployments list
# أو
npx wrangler tail --format pretty
```

---

## معلومات عن Render

### كيفية إيجاد رابط Render Service

1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. افتح الخدمة (Service) الخاصة بك
3. انسخ الرابط من **Settings** أو من أعلى الصفحة
4. الرابط يكون بهذا الشكل:

   ```
   https://your-service-name.onrender.com
   ```

---

## ⚙️ تحديث .env.local

بعد إيجاد الروابط، قم بتحديث الملف:

```bash
cd packages/web-ui

# افتح .env.local وأضف:
NEXT_PUBLIC_AGENT_FACTORY_URL=https://axiom-agent-factory.YOUR-SUBDOMAIN.workers.dev
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# إذا كان لديك Render service للـ backend:
NEXT_PUBLIC_BACKEND_URL=https://your-service.onrender.com
```

---

## 🧪 اختبار الروابط

### اختبار Cloudflare Worker

```bash
curl https://axiom-agent-factory.YOUR-SUBDOMAIN.workers.dev/health
```

### اختبار endpoint /spawn

```bash
curl -X POST https://axiom-agent-factory.YOUR-SUBDOMAIN.workers.dev/spawn \
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

## 📝 ملاحظات

- اسم Cloudflare Worker: **axiom-agent-factory**
- Services المرتبطة:
  - axiom-agent-do
  - axiom-gemini-router
  - axiom-tool-executor
  - axiom-auth-worker

جميع هذه الخدمات يجب أن تكون deployed على Cloudflare.
