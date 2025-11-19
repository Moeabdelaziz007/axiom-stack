# Axiom ID Beta Launch Guide

This guide provides step-by-step instructions for launching the Axiom ID MVP in beta.

## Pre-Launch Checklist

### 1. Security Configuration
- [ ] Replace placeholder values in `.env`:
  - `DISCORD_BOT_TOKEN` - Your actual Discord bot token
  - `GOOGLE_CLOUD_ACCESS_TOKEN` - Your Google Cloud access token
- [ ] Verify all other environment variables are correctly configured
- [ ] Ensure Google Cloud service account has minimal required permissions

### 2. Monitoring System
- [ ] Deploy monitoring function: `cd functions && ./deploy.sh`
- [ ] Verify Cloud Scheduler job is active
- [ ] Test monitoring function manually: `node functions/test-monitoring.mjs`

### 3. Documentation
- [ ] Review and update README.md files
- [ ] Ensure architecture diagrams are current
- [ ] Verify installation and usage instructions

## Beta Launch Steps

### 1. Register Your First Agent
```bash
npm run agent:register
```

This command will:
- Register the Superpower Host with Firestore
- Create an on-chain identity on Solana with initial reputation of 100

### 2. Start the Orchestrator
```bash
npm run orchestrator:start
```

This will start the central coordination system that:
- Handles user requests
- Routes tasks to appropriate agents
- Manages reputation updates via ADK callbacks
- Provides API endpoints for agent communication

### 3. Deploy Superpower Host to Cloud Run
Follow your organization's Cloud Run deployment process for the ADK agents.

### 4. Begin Testing
- Test agent registration and on-chain identity creation
- Execute sample tasks and verify reputation updates
- Monitor for discrepancies between Firestore and blockchain
- Verify security alerting system

## Post-Launch Monitoring

### Automated Monitoring
The system includes automated monitoring that runs every 6 hours to:
- Check for discrepancies between Firestore and Solana blockchain
- Flag suspicious agents
- Send security alerts for inconsistencies

### Manual Verification
Regular manual checks should include:
- Reviewing security logs
- Verifying agent reputations
- Checking system performance metrics
- Monitoring Cloud Function execution logs

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are in `.env`
   - Verify no placeholder values remain

2. **Solana Wallet Issues**
   - Confirm the wallet path in `SOLANA_WALLET_PATH` is correct
   - Ensure the wallet has sufficient SOL for transactions

3. **Google Cloud Authentication**
   - Verify service account credentials
   - Check that required APIs are enabled

4. **Agent Registration Failures**
   - Check that the agent service URL is accessible
   - Verify agent capabilities match available superpowers

### Support
For issues during beta launch, contact the development team or check the system logs for detailed error messages.