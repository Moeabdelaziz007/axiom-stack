#!/bin/bash

# Deploy axiom-brain Worker via Cloudflare API
# Includes ChatRoom Durable Object to satisfy existing DO dependencies

set -e

ACCOUNT_ID="f4b5d0354439ce71e91063e477b4d60c"
WORKER_NAME="axiom-brain"

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ Error: CLOUDFLARE_API_TOKEN not set"
    exit 1
fi

echo "📦 Creating worker bundle with Durable Objects..."

# Create complete bundle including ChatRoom DO
cat > /tmp/worker-bundle.js << 'EOF'
// Axiom Brain Worker - Complete with Durable Objects

// ChatRoom Durable Object
class ChatRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    return new Response(JSON.stringify({ message: 'ChatRoom DO active' }), {
      headers: { 'content-type': 'application/json' }
    });
  }

  async addMessage(role, content) {
    const messages = (await this.state.storage.get('messages')) || [];
    messages.push({ role, content, timestamp: Date.now() });
    await this.state.storage.put('messages', messages);
    return messages;
  }

  async getContext(limit = 10) {
    const messages = (await this.state.storage.get('messages')) || [];
    return messages.slice(-limit);
  }

  async setConfig(config) {
    await this.state.storage.put('config', config);
  }

  async getConfig() {
    return await this.state.storage.get('config');
  }
}

// Main Worker Handler
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event));
});

async function handleRequest(request, event) {
  const url = new URL(request.url);
  
  // Health check
  if (url.pathname === '/health') {
    return new Response(JSON.stringify({
      status: 'ok',
      worker: 'axiom-brain',
      timestamp: new Date().toISOString(),
      deployment: 'cloudflare-api',
      durableObjects: ['ChatRoom']
    }), {
      headers: { 'content-type': 'application/json' }
    });
  }
  
  // Default response
  return new Response(JSON.stringify({
    message: 'Axiom Brain Worker - API Deployed',
    note: 'Minimal functionality. Full deployment requires wrangler.',
    endpoints: ['/health', '/chat']
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    }
  });
}

// Export for Cloudflare Workers
export { ChatRoom };
EOF

echo "📤 Uploading to Cloudflare..."

RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/javascript" \
  --data-binary "@/tmp/worker-bundle.js")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo ""
echo "📊 Response Code: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Worker URL: https://brain.axiomid.app"
    echo "🔍 Test: curl https://brain.axiomid.app/health"
else
    echo "❌ Deployment failed"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    exit 1
fi

rm -f /tmp/worker-bundle.js
