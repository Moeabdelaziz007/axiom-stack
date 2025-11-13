# 🚨 CRITICAL FIX - Cloudflare Build Errors

## ⚠️ Current Status
Your build is failing with TWO errors that need to be fixed in the Cloudflare Pages dashboard.

---

## 🔧 THE FIX (Do This Now - Takes 2 Minutes)

### Go to Cloudflare Pages Dashboard
1. Visit: https://dash.cloudflare.com/
2. Click: **Workers & Pages** → Your project name
3. Click: **Settings** (top navigation)
4. Scroll to: **Build & deployments**

---

### ✅ Fix #1: Set Root Directory (CRITICAL)

**Click "Edit configuration"** and set:

```
Root directory (path): .
```

OR leave it **completely empty** (blank field)

**Why?** Your `package.json` is at the repository root, not in a subdirectory. Cloudflare needs to know this.

---

### ✅ Fix #2: Set Node Version to 20 (CRITICAL)

In the **Environment variables** section:

1. Click **"Add variable"**
2. **Variable name:** `NODE_VERSION`
3. **Value:** `20`
4. Click **"Save"**

**Why?** Your project (especially Firebase/Solana dependencies) requires Node.js 20+. Cloudflare defaults to Node 18, which will cause build failures.

---

## 📋 Complete Settings Checklist

After making changes, your settings should look like this:

| Setting | Value |
|---------|-------|
| **Framework preset** | Next.js |
| **Build command** | `npm run build` |
| **Build output directory** | `.next` |
| **Root directory** | *(empty or ".")* |
| **Environment Variables** | `NODE_VERSION` = `20` |

---

## 🚀 After Fixing

1. Click **"Save"** at the bottom
2. Go to **"Deployments"** tab
3. Click **"Retry deployment"** on the failed build
4. ✅ Build should succeed!

---

## 🔍 How to Verify Success

In the build logs, you should see:

```
✅ Success: Finished cloning repository files
✅ Installing project dependencies: npm clean-install
✅ Using Node.js version 20.x.x
✅ Building Next.js application...
✅ Build completed successfully
```

Instead of:

```
❌ Error: Cannot find cwd: /opt/buildhome/repo/axiom_id
❌ npm error... Could not read package.json
❌ npm warn EBADENGINE... required: { node: '>=20.0.0' }
```

---

## 💡 What Changed

I've also updated `cloudflare.json` to include `NODE_VERSION: 20` in the environment, but **you still need to set it in the Cloudflare dashboard** for it to take effect.

---

## 📞 Still Having Issues?

Double-check:
1. ✅ Root directory is empty or set to "."
2. ✅ `NODE_VERSION` environment variable is set to `20`
3. ✅ You clicked "Save" after making changes
4. ✅ You retried the deployment

---

**TL;DR:** 
1. Set root directory to "." or leave empty
2. Add environment variable: `NODE_VERSION` = `20`
3. Save and retry deployment