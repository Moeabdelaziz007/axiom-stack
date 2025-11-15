# Final Deployment Instructions for Axiom ID Subdomain Setup

## Overview
This document provides step-by-step instructions for setting up the subdomain configuration to run the backend on https://api.axiomid.app.

## Manual Steps Required

### 1. Configure Custom Domain on Render
1. Go to Render.com
2. Select the `axiom-id-socket-server` service
3. Navigate to "Settings" → "Custom Domains"
4. Add `api.axiomid.app` as a custom domain
5. Follow the DNS verification instructions provided by Render

### 2. Update DNS Records
1. Access your domain provider's DNS management (Namecheap, GoDaddy, etc.)
2. Add a new CNAME record:
   - Name/Host: `api`
   - Value/Points to: The target domain provided by Render (typically something like `your-service.onrender.com`)
   - TTL: 300 (or default)

### 3. Verify Configuration
1. Wait for DNS propagation (5-30 minutes)
2. Test the connection by visiting https://api.axiomid.app/health
3. Verify that the frontend can connect to the backend through the new subdomain

## Troubleshooting
- If the domain doesn't resolve, check that the CNAME record is correctly configured
- If CORS issues occur, ensure the origin is properly added in the socket server configuration
- If the health check fails, verify the service is running on Render

## Notes
- The frontend now connects to `https://api.axiomid.app` instead of `https://axiomid.app`
- The CORS configuration allows both the main domain and the API subdomain
- This separation allows for better scalability and security in the future