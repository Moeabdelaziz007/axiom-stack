# Cloudflare Pages Deployment Guide

## ✅ Why Cloudflare Pages?

- **UNLIMITED FREE BANDWIDTH** for static assets (images, CSS, JS)
- **100,000 free dynamic requests/day** for server-side rendering
- **Full Next.js support** (App Router, SSR, API routes, etc.)
- **No surprise bills** - service pauses if you hit limits, never charges
- **Better than Netlify/Vercel** - No 100GB bandwidth limitation

## 🚀 Deployment Steps

### Option 1: GitHub Integration (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Go to Cloudflare Pages**
   - Visit: https://dash.cloudflare.com/
   - Navigate to: Workers & Pages → Create application → Pages → Connect to Git

3. **Connect your repository**
   - Select your GitHub repository
   - Click "Begin setup"

4. **Configure build settings** ⚠️ CRITICAL - Set these exactly:
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `.next` (leave as default)
   - **Root directory (path)**: Leave empty (project is in root directory)
   - **Environment variables**: 
     - `NODE_VERSION` = `20` (or higher)

5. **Environment Variables** (if needed)
   - Add any environment variables your app needs
   - Example: `NODE_VERSION = 20`

6. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your app
   - You'll get a URL like: `your-project.pages.dev`

### Option 2: Wrangler CLI (Alternative)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy from project directory
npx @cloudflare/next-on-pages

# Deploy
wrangler pages deploy .vercel/output/static --project-name=axiom-id
```

## 📊 What You Get (Free Tier)

- ✅ Unlimited bandwidth for static assets
- ✅ 100,000 requests/day for dynamic content
- ✅ 500 builds/month
- ✅ Unlimited sites
- ✅ Custom domains
- ✅ Free SSL certificates
- ✅ DDoS protection
- ✅ Global CDN

## 🔧 Configuration Changes Made

1. **Project Structure**
   - The project is now in the root directory (not in a subdirectory)
   - No need to specify a root directory in Cloudflare settings

2. **Updated Deployment Process**
   - Using `npx @cloudflare/next-on-pages` for building
   - Deploying with `wrangler pages deploy .vercel/output/static --project-name=axiom-id`

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Go to your Pages project → Custom domains
   - Add your domain and update DNS records
   - Current custom domain: **axiomid.app**

2. **Environment Variables**
   - Set production environment variables in Cloudflare dashboard
   - Workers & Pages → Your project → Settings → Environment variables

3. **Monitor Usage**
   - Check analytics in Cloudflare dashboard
   - You'll see requests, bandwidth, and build usage

## ⚠️ Important Notes

- **No static export**: Your app is now a full-stack Next.js application
- **Server components work**: You can use React Server Components
- **API routes work**: `/pages/api/*` routes are fully supported
- **Image optimization**: Next.js Image component works with Cloudflare
- **No billing surprises**: Service pauses at limits, never charges

## 🆘 Troubleshooting

If deployment fails:
1. Check build logs in Cloudflare dashboard
2. Ensure `NODE_VERSION` environment variable is set to 20+
3. Verify `package.json` has all dependencies
4. Check that build command succeeds locally: `npm run build`

## 📚 Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Pricing Details](https://developers.cloudflare.com/pages/platform/limits/)

## 📞 Contact Information

For questions or support regarding this deployment:

- **Name**: Mohamed Hossameldin Abdelaziz
- **Email**: amrikyy@gmail.com
- **Student Email**: mabdela1@students.kennesaw.edu
- **Phone (Egypt)**: +201094228044 (WhatsApp)
- **Phone (US)**: +17706160211

## 🔗 Social Media Links

- **GitHub**: https://github.com/Moeabdelaziz007/axiom-id
- **Facebook**: https://www.facebook.com/profile.php?id=61583477974464&locale=ar_AR
- **Instagram**: https://www.instagram.com/axiom_id/

## 📧 Formspree Configuration

The waiting list form is configured to submit data to Formspree endpoint: https://formspree.io/f/xblqrblj
The form includes localStorage fallback functionality for offline/error scenarios.