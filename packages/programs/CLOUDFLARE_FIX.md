# 🔧 FIX: Cloudflare "Root Directory Not Found" Error

## ❌ Error You're Seeing:
```
Failed: root directory not found
```

## 🎯 Root Cause:
**You connected the WRONG GitHub repository to Cloudflare!**

Your project has TWO separate Git repositories:
```
/Axiom ID/                           ← AuraOS-Monorepo (Parent repo)
  └── axiom_id/                      ← axiom-id (Separate repo) ✅ THIS IS THE ONE!
      ├── .git/                      ← Has its own .git directory
      ├── package.json
      ├── next.config.js
      └── ...
```

You connected: `https://github.com/Moeabdelaziz007/AuraOS-Monorepo.git` ❌
You need: `https://github.com/Moeabdelaziz007/axiom-id.git` ✅

## ✅ Solution: Connect the Correct Repository

### Step-by-Step Fix:

1. **Delete the current Cloudflare Pages project**
   - Go to Cloudflare Dashboard → Workers & Pages
   - Find your current project
   - Settings → Scroll down → "Delete project"

2. **Create a NEW Cloudflare Pages project**
   - Click "Create application" → "Pages" → "Connect to Git"

3. **Select the CORRECT repository:**
   - Look for: **`axiom-id`** (NOT `AuraOS-Monorepo`)
   - Click "Begin setup"

4. **Configure build settings:**
   ```
   Framework preset: Next.js
   
   Build command: npm run build
   
   Build output directory: .next
   
   Root directory (path): [LEAVE EMPTY or put "."]
   
   Environment variables:
   - NODE_VERSION = 18
   ```

5. **Deploy!**
   - Click "Save and Deploy"
   - ✅ It should work now!

## 📊 Why This Happened:

The `axiom_id` folder is a **Git submodule** or separate repository inside the parent `AuraOS-Monorepo`. When Cloudflare cloned `AuraOS-Monorepo`, it didn't get the contents of `axiom_id` because that's a separate repository.

## 🚀 Quick Checklist:

- [ ] Delete old Cloudflare Pages project (connected to AuraOS-Monorepo)
- [ ] Create new Cloudflare Pages project
- [ ] Connect to `axiom-id` repository (NOT AuraOS-Monorepo)
- [ ] Leave root directory EMPTY or set to "."
- [ ] Set NODE_VERSION = 18
- [ ] Deploy

## 🎯 Correct Repository URLs:

| Repository | URL | Use for Cloudflare? |
|------------|-----|---------------------|
| AuraOS-Monorepo | `https://github.com/Moeabdelaziz007/AuraOS-Monorepo.git` | ❌ NO |
| **axiom-id** | `https://github.com/Moeabdelaziz007/axiom-id.git` | ✅ **YES!** |

## 💡 Alternative: If You Want to Keep the Monorepo Structure

If you want to deploy from `AuraOS-Monorepo`, you need to:
1. Remove the `.git` folder from `axiom_id/`
2. Commit `axiom_id/` contents to the parent repo
3. Then set root directory to `axiom_id` in Cloudflare

But the **easier solution** is to just connect the `axiom-id` repository directly!

---

**TL;DR**: Delete your current Cloudflare project and create a new one connected to the `axiom-id` repository (not AuraOS-Monorepo).