# Axiom Mission Control UI - Deployment Guide

## Cloudflare Pages Deployment

### Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository**: Code must be in a GitHub repository
3. **Cloudflare API Token**: Generate from Cloudflare Dashboard

### Setup Instructions

#### 1. Create Cloudflare Pages Project

1. Log in to Cloudflare Dashboard
2. Navigate to **Pages** → **Create a project**
3. Connect your GitHub repository
4. Configure build settings:
   - **Project name**: `axiom-mission-control`
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `packages/web-ui`
   - **Node version**: `20`

#### 2. Environment Variables

Add these environment variables in Cloudflare Pages settings:

```bash
NEXT_PUBLIC_API_URL=https://api.axiomid.app
NEXT_PUBLIC_WS_URL=wss://ws.axiomid.app
```

#### 3. GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

```
CLOUDFLARE_API_TOKEN=<your-cloudflare-api-token>
CLOUDFLARE_ACCOUNT_ID=<your-cloudflare-account-id>
NEXT_PUBLIC_API_URL=https://api.axiomid.app
NEXT_PUBLIC_WS_URL=wss://ws.axiomid.app
SLACK_WEBHOOK_URL=<optional-slack-webhook>
```

#### 4. Custom Domain (Optional)

1. In Cloudflare Pages, go to **Custom domains**
2. Add your domain: `app.axiomid.com`
3. Follow DNS configuration instructions

### Deployment Process

#### Automatic Deployment

Every push to `main` branch automatically triggers deployment via GitHub Actions.

#### Manual Deployment

```bash
# Trigger manual deployment
gh workflow run deploy-web-ui.yml
```

### Local Testing

Test the production build locally:

```bash
cd packages/web-ui
npm run build
npx serve out
```

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Total Bundle Size**: < 200KB (gzipped)
- **Lighthouse Score**: > 90

### Monitoring

- **Cloudflare Analytics**: Real-time metrics in Cloudflare Dashboard
- **GitHub Actions**: Build and deployment logs
- **Slack Notifications**: Deployment status updates (if configured)

### Rollback

If a deployment fails or has issues:

1. Go to Cloudflare Pages → **Deployments**
2. Find the last working deployment
3. Click **Rollback to this deployment**

### Troubleshooting

#### Build Fails

- Check Node version (should be 20)
- Verify all dependencies are installed
- Check environment variables are set

#### Deployment Fails

- Verify Cloudflare API token is valid
- Check account ID is correct
- Ensure repository permissions are correct

#### Performance Issues

- Run `npm run analyze` to check bundle size
- Use Lighthouse CI to identify bottlenecks
- Check Cloudflare cache settings

### Support

For issues or questions:
- GitHub Issues: [axiom-stack/issues](https://github.com/axiom-stack/issues)
- Documentation: [docs.axiomid.app](https://docs.axiomid.app)