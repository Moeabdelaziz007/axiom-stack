# Axiom Agent Monitoring System

This directory contains the Google Cloud Function and related infrastructure for automated monitoring of agent discrepancies between Firestore and the Solana blockchain.

## Components

### 1. Monitoring Function (`monitoring-function.mjs`)
- Runs automated checks every 6 hours
- Compares agent capabilities between Firestore and Solana blockchain
- Sends alerts when discrepancies are detected
- Logs all monitoring activities

### 2. Alerting System (Integrated in `task-service.mjs`)
- Security alerts for individual agent discrepancies
- Summary alerts for overall monitoring results
- Console logging for audit trails
- Extensible for Slack, Email, and other notification systems

## Deployment

### Prerequisites
- Google Cloud SDK installed and configured
- Appropriate permissions for Cloud Functions and Cloud Scheduler
- Environment variables configured in `.env` file

### Deploy Command
```bash
./deploy.sh
```

This will:
1. Deploy the monitoring function to Google Cloud Functions
2. Create a Cloud Scheduler job to trigger the function every 6 hours

## Function Details

### Trigger
- **Schedule**: Every 6 hours (0 */6 * * *)
- **Method**: HTTP GET request

### Response Format
```json
{
  "success": true,
  "message": "Monitoring completed. Found X agents with discrepancies.",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
  "inconsistentAgents": X,
  "totalAgents": Y
}
```

## Alerting

When discrepancies are found, the system will:
1. Log security alerts to console with `🚨 SECURITY ALERT` prefix
2. Log monitoring summaries with `🚨 MONITORING SUMMARY` prefix
3. Create detailed logs in `SECURITY_LOG` and `MONITORING_LOG` formats

## Extending Alerting

To add actual alerting mechanisms (Slack, Email, etc.):
1. Implement the respective methods in `task-service.mjs`
2. Uncomment the TODO lines in the alerting methods
3. Add necessary dependencies to `package.json`

Example for Slack integration:
```javascript
// In task-service.mjs sendSecurityAlert method
await this.sendSlackAlert(alertData);
```