# Axiom ID - Quantum Edge Architecture

This Cloudflare Worker implements a hybrid architecture for the Axiom ID project, leveraging Cloudflare's advanced suite of tools to create a "Zero-Cost, Edge-First" AI ecosystem.

## 🧠 Strategic Blueprint: "The Quantum Edge"

We are building a hybrid architecture. Render holds the database/backend, but Cloudflare handles Intelligence, Caching, and Static Delivery.

### Phase 1: The Brain (AutoRAG & Vectorize)
**Goal:** Give the AI Agents "Long-term Memory" and "Project Knowledge" without paying for Pinecone.

- Setup Vectorize: Initialize a new Vectorize Index named `axiom-knowledge-base`
- Setup Workers AI (Embeddings): Configure a Worker to use `@cf/baai/bge-base-en-v1.5` for converting text to vectors for free
- **Outcome:** When users ask about "AIX Protocol", the bot searches this Vector DB first (0 latency, 0 cost)

### Phase 2: The Gatekeeper (AI Gateway)
**Goal:** Reduce OpenAI costs and speed up responses.

- Deploy AI Gateway: Create a gateway named `axiom-nexus`
- Configuration: Enable "Caching"
  - *Logic:* If User A asks "What is Axiom?", and User B asks the same, User B gets the cached answer instantly. 0 cost
- Rate Limiting: Protect our backend from spam attacks

### Phase 3: The Workforce (Workers AI)
**Goal:** Offload simple tasks from GPT-4 to Free Edge Models.

- Inference Worker: Create a worker named `axiom-brain`
- Model Selection:
  - Use `@cf/meta/llama-3-8b-instruct` for general chat (Free Beta)
  - Use `@cf/stabilityai/stable-diffusion-xl-base-1.0` for generating agent avatars (Free Beta)
- Routing: Connect this worker to `api.axiomid.app/v1/edge-ai`

### Phase 4: The Automation (Workflows)
**Goal:** Handle background tasks (Blockchain Monitoring).

- Setup Workflow: Create a workflow `axiom-monitor` to check Solana transactions every 15 minutes
- Zero-Trust: Ensure only our internal agents can trigger these workflows

## 🛡️ Why This Plan Is Genius

**Goodbye Memory Costs:** Instead of paying $70 for Pinecone, we use Cloudflare Vectorize (free for millions of vectors in Beta).

**Goodbye Massive OpenAI Bills:** Simple questions and image generation are handled via Workers AI (running Llama 3 and Flux models for free on Cloudflare servers).

**Insane Speed:** The AI Gateway caches responses. If 1000 people ask the same question, we pay for it once, and the rest get instant answers.

## 🚀 Deployment

To deploy this worker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Deploy to Cloudflare:
   ```bash
   npm run deploy
   ```

## 📚 API Endpoints

- `GET /health` - Health check
- `POST /chat` - Chat with memory (requires chatId and message)
- `GET /snap` - Take a screenshot of the dashboard

## 🧠 Conversation Memory (Durable Objects)

The worker now implements conversation memory using Cloudflare Durable Objects:

- Each chat session is associated with a unique `chatId`
- The `ChatRoom` Durable Object maintains the last 20 messages for each chat
- Messages are automatically pruned to manage token limits
- Memory persists across worker restarts

## 🏗️ Future Enhancements

1. Re-enable Vectorize integration for RAG functionality
2. Add authentication and rate limiting
3. Connect to Render backend services
4. Implement full AI Gateway functionality
5. Set up actual Cloudflare Workflows
6. Add browser rendering for dynamic content capture