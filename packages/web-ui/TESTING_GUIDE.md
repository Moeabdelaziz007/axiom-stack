# 🧪 دليل اختبار Create Agent Wizard

## ✅ الكود جاهز بالفعل

تم تطبيق جميع المتطلبات في `CreateAgentWizard.tsx`:

- ✅ SpawnRequest payload صحيح
- ✅ API call إلى `POST /spawn`
- ✅ Toast notifications
- ✅ Router navigation
- ✅ Error handling في Terminal UI

---

## 🚀 كيفية الاختبار

### 1. تشغيل Web UI

```bash
cd packages/web-ui
npm run dev
```

### 2. فتح المتصفح

افتح: `http://localhost:3000`

### 3. الخطوات في الـ UI

#### **الخطوة 1: الاتصال بالمحفظة**

- اضغط على **"Connect Wallet"** في الـ Header
- اختر Phantom أو Solflare
- تأكد من أنك على **Devnet**

#### **الخطوة 2: فتح Wizard**

- اذهب إلى **Dashboard** أو **Agents**
- اضغط على **"Create Agent"** أو **"+ New Agent"**

#### **الخطوة 3: ملء البيانات**

**Step 1 - Identity:**

```text
Name: Alpha Trader
Ticker: ALPHA
Description: High-frequency trading agent
Risk Tolerance: 70%
```

**Step 2 - Constitution:**

```text
Stop Loss: 10%
Max Slippage: 1%
```

**Step 3 - Knowledge:**

- ✅ On-Chain Data (Solana)
- ✅ Market Sentiment Analysis

**Step 4 - Review:**

- راجع الـ JSON
- اضغط **"INITIALIZE AGENT"**

### 4. مراقبة الـ Console

افتح **Browser DevTools** (F12):

```text
Console Output:
🚀 Spawning Agent with Request: {...}
✅ Agent spawned successfully: {...}
```

### 5. النتيجة المتوقعة

**إذا نجح:**

- 🎉 Toast: "Agent 'Alpha Trader' deployed on Solana Devnet!"
- ↪️ Redirect إلى: `/agents/{agentId}`

**إذا فشل:**

- ❌ Toast: "Spawn failed: {error message}"
- 🖥️ Terminal UI يظهر الخطأ
- 🔄 زر "Return to Configuration"

---

## 🔍 اختبار API مباشرة

### Test 1: Health Check

```bash
curl https://axiom-agent-factory.amrikyy.workers.dev/health
```

### Test 2: Spawn Endpoint

```bash
curl -X POST https://axiom-agent-factory.amrikyy.workers.dev/spawn \
  -H "Content-Type: application/json" \
  -d '{
    "type": "TradingAgent",
    "config": {
      "manifest": {
        "persona": {
          "name": "Test Agent CLI",
          "description": "Automated test",
          "tone": "neutral",
          "risk_tolerance": "medium"
        },
        "genesis_rules": {
          "stop_loss_pct": 0.05,
          "max_slippage": 0.01
        },
        "knowledge_base": {
          "sources": ["On-Chain Data"],
          "grounding_required": true
        }
      }
    }
  }'
```

**الاستجابة المتوقعة:**

```json
{
  "success": true,
  "agentId": "...",
  "publicKey": "...",
  "transactionSignature": "...",
  "message": "Agent 'TradingAgent' created successfully"
}
```

---

## 🐛 استكشاف الأخطاء

### Error: "NEXT_PUBLIC_AGENT_FACTORY_URL is not configured"

**الحل:**

```bash
cd packages/web-ui
cat .env.local  # تحقق من الملف
# يجب أن يحتوي على:
# NEXT_PUBLIC_AGENT_FACTORY_URL=https://axiom-agent-factory.amrikyy.workers.dev
```

### Error: "Network Error" أو "Failed to fetch"

**الحل:**

1. تأكد أن Cloudflare Worker مُنشر
2. تحقق من CORS settings في Worker
3. جرب endpoint من Postman أولاً

### Error: "Validation failed"

**الحل:**

- تأكد من stop_loss_pct > 0
- تأكد من max_slippage > 0
- راجع AIX Schema في `packages/core/src/types/aix.ts`

---

## 📝 ملاحظات مهمة

### 1. Environment Variables

- يجب إعادة تشغيل dev server بعد تغيير `.env.local`
- استخدم `process.env.NEXT_PUBLIC_*` فقط للمتغيرات العامة

### 2. Devnet vs Mainnet

- حالياً نختبر على **Devnet**
- لا تستخدم أموال حقيقية!

### 3. Agent ID

- يتم توليده من Worker
- يُستخدم في الـ URL: `/agents/{agentId}`

---

## حظاً موفقاً في الاختبار! 🚀
