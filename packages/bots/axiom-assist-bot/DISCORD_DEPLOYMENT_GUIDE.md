# Discord Bot Deployment Guide

This guide will help you deploy the Discord bot service to Render.

## Prerequisites

1. A Render account (https://render.com)
2. A GitHub account with the repository connected to Render
3. A valid Discord bot token (already configured in your .env file)

## Deployment Steps

### 1. Access Render Dashboard

1. Go to https://dashboard.render.com/
2. Sign in to your Render account

### 2. Create New Service

1. Click on "New" → "Blueprint"
2. Select your GitHub repository (https://github.com/Moeabdelaziz007/axiom-stack)
3. Make sure you're on the `main` branch
4. For the blueprint path, specify: `axiom-stack/packages/bots/axiom-assist-bot/render.yaml`
5. Click "Create Blueprint"

### 3. Verify Environment Variables

After the blueprint is created, you should see three services:
1. axiom-id-web-api
2. axiom-id-socket-server
3. axiom-id-discord-bot

For the `axiom-id-discord-bot` service, verify that the following environment variables are set:
- `NODE_VERSION` = 20
- `GEMINI_API_KEY` (should be synced from your Render account)
- `PINECONE_API_KEY` (should be synced from your Render account)
- `DISCORD_BOT_TOKEN` (should be synced from your Render account)
- `WEB_API_INTERNAL_URL` = http://axiom-id-web-api:3000
- `SOCKET_SERVER_INTERNAL_URL` = http://axiom-id-socket-server:3001

### 4. Deploy Services

1. Click "Auto Deploy" to deploy all services
2. Wait for the deployment to complete (this may take a few minutes)
3. Check the logs for any errors

### 5. Test the Discord Bot

1. Invite the bot to your Discord server using the OAuth2 URL
2. Test basic commands like `!axiom ping` or mentioning the bot
3. Check the Render logs for any errors

## Troubleshooting

### Common Issues

1. **Discord Bot Not Responding**
   - Check that the `DISCORD_BOT_TOKEN` is correctly set
   - Verify the bot has the correct permissions in your Discord server
   - Check the Render logs for connection errors

2. **Environment Variables Not Set**
   - Make sure all required environment variables are configured in the Render dashboard
   - Restart the service after updating environment variables

3. **Service Not Starting**
   - Check the build logs for any errors
   - Verify the start command in the render.yaml file
   - Ensure all dependencies are correctly installed

## Useful Commands

To manually trigger a deployment:
```bash
# In your local repository
git add .
git commit -m "Deploy Discord bot"
git push origin main
```

To check service status:
```bash
# This will be available after deployment
# Check the Render dashboard for service URLs and logs
```

## Next Steps

1. Monitor the service logs for any errors
2. Test all Discord bot functionality
3. Set up any additional integrations (webhooks, etc.)
4. Configure custom domains if needed