#!/bin/bash

# Axiom ID - Manual Topology Deployment Script
# Use this script to deploy the backend workers when automated deployment is not possible (e.g. missing CI tokens).
# Prerequisites: You must be logged in to Cloudflare (`npx wrangler login`)

set -e # Exit on error

echo "🚀 Starting Manual Topology Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Deploy Tool Executor
echo "📦 [1/2] Deploying Tool Executor..."
cd packages/workers/tool-executor
echo "   📍 Directory: $(pwd)"
echo "   🔧 Installing dependencies..."
npm install --silent
echo "   ☁️  Deploying to Cloudflare..."
npx wrangler deploy
cd ../../..
echo "   ✅ Tool Executor Deployed."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 2. Deploy Agent Factory
echo "📦 [2/2] Deploying Agent Factory (The Quantum Brain)..."
cd packages/workers/agent-factory
echo "   📍 Directory: $(pwd)"
echo "   🔧 Installing dependencies..."
npm install --silent
echo "   ☁️  Deploying to Cloudflare..."
npx wrangler deploy
cd ../../..
echo "   ✅ Agent Factory Deployed."
echo "   ✅ Agent Factory Deployed."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 3. Deploy Web UI (Frontend)
echo "📦 [3/3] Deploying Web UI (Frontend)..."
cd packages/web-ui
echo "   📍 Directory: $(pwd)"
echo "   🔧 Building Next.js App..."
npm run build
echo "   ☁️  Deploying to Cloudflare Pages..."
# Assuming project name 'axiom-web-ui', change if necessary or let it create one
npx wrangler pages deploy out --project-name axiom-web-ui --commit-dirty=true
cd ../..
echo "   ✅ Web UI Deployed."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "🎉 Deployment Complete!"
echo "⚠️  REMINDER: Please purge your Cloudflare Cache for 'axiomid.app' to ensure the new topology is active."
