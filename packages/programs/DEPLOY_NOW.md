# 🚀 Deploy to Cloudflare Pages - Quick Guide

## ⚠️ CRITICAL: Use the Correct Repository!

**Connect this repository to Cloudflare:**
```
https://github.com/Moeabdelaziz007/axiom-id.git
```

**NOT this one:**
```
https://github.com/Moeabdelaziz007/AuraOS-Monorepo.git ❌
```

---

## 📋 Deployment Steps (5 minutes)

### 1️⃣ Go to Cloudflare Pages
Visit: https://dash.cloudflare.com/

### 2️⃣ Create New Project
- Click: **Workers & Pages** → **Create application** → **Pages**
- Click: **Connect to Git**

### 3️⃣ Select Repository
- Find and select: **`axiom-id`** repository
- Click: **Begin setup**

### 4️⃣ Build Settings
Copy these exact settings:

| Setting | Value |
|---------|-------|
| **Project name** | `axiom-id` (or your choice) |
| **Production branch** | `main` |
| **Framework preset** | `Next.js` |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Root directory** | *(leave empty or ".")* |

**IMPORTANT:** Cloudflare will automatically detect the `cloudflare.json` file in your repo, so you don't need to configure anything else!

### 5️⃣ Environment Variables
Click **Add variable**:
- Variable name: `NODE_VERSION`
- Value: `18`

### 6️⃣ Deploy!
- Click **Save and Deploy**
- Wait 2-3 minutes
- ✅ Your site will be live at: `your-project.pages.dev`

---

## ✅ What You Get (Free Forever)

- ✅ **Unlimited bandwidth** for images, CSS, JS
- ✅ **100,000 requests/day** for server-side rendering
- ✅ **Full Next.js features** (SSR, API routes, etc.)
- ✅ **No surprise bills** - pauses at limits
- ✅ **Custom domains** (free SSL)
- ✅ **Global CDN** (fast worldwide)

---

## 🔧 If You Already Created a Project

1. **Delete the old project:**
   - Dashboard → Workers & Pages → Your project
   - Settings → Delete project

2. **Start fresh** with the steps above

---

## 📞 Need Help?

Check these files:
- `CLOUDFLARE_FIX.md` - Detailed troubleshooting
- `CLOUDFLARE_DEPLOYMENT.md` - Complete guide

---

**Ready? Let's deploy!** 🚀