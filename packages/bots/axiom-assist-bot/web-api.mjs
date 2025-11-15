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

// --- Configuration ---
const PINECONE_INDEX_NAME = 'axiom-id-brain';
const PORT = process.env.PORT || 3001;
// ---------------------

// التحقق من المفاتيح
if (!process.env.GEMINI_API_KEY || !process.env.PINECONE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or PINECONE_API_KEY in environment');
}

const app = express();
app.use(express.json());

// 1. Load Website Persona Prompt
let websitePromptTemplate = '';
try {
  websitePromptTemplate = await fs.readFile('website-prompt.txt', 'utf-8');
} catch (e) {
  console.error('Failed to load website-prompt.txt', e);
  process.exit(1);
}

// 2. Initialize Pinecone & Embeddings
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
  taskType: "RETRIEVAL_DOCUMENT"
});

// 3. Initialize Pinecone as Retriever
const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
});
const retriever = vectorStore.asRetriever();

// 4. Initialize Gemini Chat Model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-2.5-flash-preview-05-20",
  temperature: 0.7,
});

// 5. Create the RAG Chain (Retrieval-Augmented Generation)
const prompt = PromptTemplate.fromTemplate(websitePromptTemplate);

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

// 6. Create the API Endpoint
app.post('/api/chat', async (req, res) => {
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

// 7. Start the server
app.listen(PORT, () => {
  console.log(`Web API server listening on port ${PORT}`);
});