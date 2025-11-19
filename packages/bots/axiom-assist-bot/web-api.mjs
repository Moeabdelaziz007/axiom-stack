// Launch Checklist (Axiom $0 Stack)
// 1. Gather the Keys (Gather the Keys)
// You now need to collect 4 basic API keys (Gemini keys are already with you):
//
// PINECONE_API_KEY: Go to Pinecone.io, create a free account (Starter Plan), and create one "Index". (Name it axiom-id-brain as we agreed).
//
// DISCORD_BOT_TOKEN: Go to Discord Developer Portal, create a "New Application", create a "Bot", and get the Token.
//
// DISCORD_CLIENT_ID: (You'll find it on the same bot page)
//
// STRATEGIST_WEBHOOK_URL: In your Discord server, create a private channel #ai-strategy-log, go to Settings (Integrations -> Webhooks) and create a new Webhook.
//
// 2. Set up "Secrets" (Configure Secrets)
// Now you need to put these keys in the right places:
//
// In GitHub repository (for Actions):
//
// Go to Settings > Secrets and variables > Actions.
//
// Add these "Secrets":
//
// GEMINI_API_KEY
//
// PINECONE_API_KEY
//
// STRATEGIST_WEBHOOK_URL
//
// In Render service (for live bots):
//
// Go to Render.com.
//
// When you create the services in step 4, go to Environment.
//
// Add these "Environment Variables":
//
// GEMINI_API_KEY
//
// PINECONE_API_KEY
//
// DISCORD_BOT_TOKEN
//
// 3. "First Brain Feeding" (The First Brain Ingest)
// Before the bots work, the "brain" (Pinecone) must be filled.
//
// Go to the bot repository (axiom-assist-bot) on GitHub.
//
// Go to the "Actions" tab.
//
// On the left, look for Update Axiom Brain (file update-brain.yml).
//
// Click "Run workflow" manually.
//
// Wait 5-10 minutes until it completes. Now the "brain" is ready.
//
// 4. Deploy Live Services
// Now go to Render to deploy the bots (there will be two free services):
//
// Service 1: Website Bot (Web API):
//
// Create "New Web Service" and link it to the axiom-assist-bot repository.
//
// Start Command: npm install && npm run start:web
//
// (Make sure to add environment variables from step 2).
//
// Copy the link that Render will give you (e.g.: https://axiom-web-api.onrender.com).
//
// Service 2: Discord Bot:
//
// Create "New Web Service" (yes, another free service) and link it to the same repository.
//
// Start Command: npm install && npm run start:discord
//
// (Make sure to add environment variables from step 2).
//
// 5. Connect the Frontend
// The final step:
//
// Take the link you copied from Render (e.g. https://axiom-web-api.onrender.com).
//
// Go to your website's frontend code (axiom_id project).
//
// Open the ChatWidget.tsx file.
//
// Look for const API_URL = 'http://localhost:3001/api/chat' (or similar).
//
// Change it to the real link: const API_URL = 'https://axiom-web-api.onrender.com/api/chat'.
//
// Redeploy your site.
//
// Once you've completed these five steps, the "automated ecosystem" becomes fully alive and ready to welcome visitors and developers.
//
// Are you ready to start collecting these keys?
// This script is the "web interface"
// It will run on Render (free plan)
// Its mission: receive questions from axiomid.app, search in Pinecone, answer with Gemini

import express from 'express';
import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { PromptTemplate } from '@langchain/core/prompts';
import { promises as fs } from 'fs';
import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";

// --- Configuration ---
const PINECONE_INDEX_NAME = 'axiom-id-brain';
// Use the PORT environment variable provided by Render, default to 3000
const PORT = process.env.PORT || 3000;
// ---------------------

// التحقق من المفاتيح
if (!process.env.GEMINI_API_KEY || !process.env.PINECONE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or PINECONE_API_KEY in environment');
}

// Initialize GitHub Webhook Verifier
const githubWebhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || 'temp_secret'
});

const app = express();
app.use(express.json());

// 1. Load Website Persona Prompt
let websitePromptTemplate = '';
try {
  websitePromptTemplate = await fs.readFile('website-prompt.txt', 'utf-8');
} catch (e) {
  console.error('Failed to load website-prompt.txt', e);
  // Continue without the prompt template
  websitePromptTemplate = "You are a helpful assistant for the Axiom ID platform.";
}

// 2. Initialize Pinecone & Embeddings (with error handling)
let pinecone, pineconeIndex, embeddings, vectorStore, retriever, model, chain;
try {
  if (process.env.GEMINI_API_KEY && process.env.PINECONE_API_KEY) {
    // Initialize Pinecone & Embeddings
    pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
    embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "embedding-001",
      taskType: "RETRIEVAL_DOCUMENT"
    });

    // Initialize Pinecone as Retriever
    vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });
    retriever = vectorStore.asRetriever();

    // Initialize Gemini Chat Model
    model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-2.5-flash-preview-05-20",
      temperature: 0.7,
    });

    // Create the RAG Chain (Retrieval-Augmented Generation)
    const prompt = PromptTemplate.fromTemplate(websitePromptTemplate);
    chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);
  } else {
    console.log('Missing API keys, chat functionality will be disabled');
  }
} catch (error) {
  console.error('Failed to initialize AI services:', error);
  // Continue without AI services
}

// 6. Create the API Endpoint
app.post('/api/chat', async (req, res) => {
  // Check if services are initialized
  if (!chain) {
    return res.status(503).json({ error: 'Chat service unavailable' });
  }
  
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    console.log(`Received question: ${question}`);
    
    // استخدام السلسلة (Chain) للبحث والرد
    const result = await chain.invoke(question);
    
    console.log(`Sending response: ${result}`);
    res.json({ answer: result });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// 7. GitHub Webhook Endpoint
app.post('/api/v1/github-webhook', createNodeMiddleware(githubWebhooks));
console.log('✅ GitHub Webhook Endpoint listening at /api/v1/github-webhook');

// 8. GitHub Webhook Listeners
// Listen for new Pull Requests or when new commits are pushed
githubWebhooks.on(["pull_request.opened", "pull_request.synchronize"], async ({ id, name, payload }) => {
  console.log(`[GitHub Webhook] Received: ${name} (ID: ${id})`);
  
  // In a production implementation, we would forward these events to the orchestrator
  // For now, we'll just log them
  console.log(`[GitHub Webhook] PR event received for ${payload.repository.full_name} #${payload.pull_request.number}`);
});

// Add Agents API Endpoint
app.get('/api/agents', async (req, res) => {
  try {
    // Return mock AIX agent data similar to what's used in the frontend
    const mockAgents = [
      {
        id: "aix_agent_001",
        name: "Data Analyzer Pro",
        description: "Advanced AI agent for data analysis and pattern recognition",
        status: "active",
        createdAt: "2023-06-15T10:30:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["data-analysis", "pattern-recognition", "reporting"],
        reputation: 92,
        loadFactor: 46
      },
      {
        id: "aix_agent_002",
        name: "Content Creator AI",
        description: "Generates marketing content and social media posts",
        status: "active",
        createdAt: "2023-06-18T09:15:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["content-generation", "seo", "social-media"],
        reputation: 87,
        loadFactor: 42
      },
      {
        id: "aix_agent_003",
        name: "Security Monitor",
        description: "Monitors system security and detects threats",
        status: "busy",
        createdAt: "2023-06-12T16:30:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["threat-detection", "intrusion-prevention", "compliance"],
        reputation: 95,
        loadFactor: 65
      },
      {
        id: "aix_agent_004",
        name: "Research Assistant",
        description: "Conducts research and gathers information on various topics",
        status: "active",
        createdAt: "2023-06-20T14:20:00Z",
        lastActive: new Date().toISOString(),
        capabilities: ["research", "information-gathering", "summarization"],
        reputation: 78,
        loadFactor: 32
      }
    ];
    
    res.status(200).json(mockAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Failed to fetch agents', error: error.message });
  }
});

// 9. Start the server
app.listen(PORT, () => {
  console.log(`Web API server listening on port ${PORT}`);
});