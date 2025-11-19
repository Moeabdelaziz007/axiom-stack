/**
 * Axiom ID - Quantum Edge Architecture
 * 
 * This worker implements a hybrid architecture where Cloudflare handles Intelligence, 
 * Caching, and Static Delivery while Render holds the database/backend.
 * 
 * PHASE 1: THE BRAIN (AutoRAG & Vectorize)
 * PHASE 2: THE GATEKEEPER (AI Gateway)
 * PHASE 3: THE WORKFORCE (Workers AI)
 * PHASE 4: THE AUTOMATION (Workflows)
 */

import { Hono } from 'hono';
import { ChatRoom } from './objects';

// Export the Durable Object class
export { ChatRoom } from './objects';

// Define types for our environment
interface Env {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  CHAT_ROOM: DurableObjectNamespace;
  BROWSER: Fetcher;
}

// Define message interface
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const app = new Hono<{ Bindings: Env }>();

// Health check endpoint
app.get('/health', async (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      vectorize: !!c.env.VECTORIZE,
      ai: !!c.env.AI,
      chatRoom: !!c.env.CHAT_ROOM,
      browser: !!c.env.BROWSER,
    }
  });
});

// Chat endpoint - handles conversation with memory and RAG
app.post('/chat', async (c) => {
  try {
    const { chatId, message } = await c.req.json();
    
    if (!chatId || !message) {
      return c.json({ error: 'chatId and message are required' }, 400);
    }
    
    // Get the ChatRoom Durable Object for this chat
    const id = c.env.CHAT_ROOM.idFromName(chatId);
    const stub = c.env.CHAT_ROOM.get(id);
    
    // Add user message to history via DO fetch method
    await stub.fetch('http://chat-room/add-message', {
      method: 'POST',
      body: JSON.stringify({ role: 'user', content: message })
    });
    
    // Get conversation history via DO fetch method
    const historyResponse = await stub.fetch('http://chat-room/get-context', {
      method: 'POST'
    });
    const { history } = await historyResponse.json<{ history: Message[] }>();
    
    // Search Vectorize for relevant project info (RAG)
    const queryVector: any = await c.env.AI.run('@cf/baai/bge-large-en-v1.5', { text: message });
    const matches = await c.env.VECTORIZE.query(queryVector.data[0], { topK: 5 });
    
    // Prepare context for LLM
    const context = matches.matches.map(match => match.metadata?.text || '').join('\n\n');
    const conversationHistory = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    // Create prompt with context and history
    const prompt = `You are an expert on the Axiom ID project. Use the following context and conversation history to answer the user's question.
    
Context:
${context}

Conversation History:
${conversationHistory}

User Question: ${message}

Please provide a helpful and accurate response based on the context and conversation history:`;
    
    // Send to Workers AI (via AI Gateway)
    const response = await c.env.AI.run('@cf/meta/llama-3-8b-instruct', { 
      prompt,
      stream: false
    });
    
    const aiResponse = response.response || 'Sorry, I could not generate a response.';
    
    // Save AI response to history via DO fetch method
    await stub.fetch('http://chat-room/add-message', {
      method: 'POST',
      body: JSON.stringify({ role: 'assistant', content: aiResponse })
    });
    
    return c.json({ 
      response: aiResponse,
      chatId 
    });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Screenshot endpoint - uses Puppeteer to capture dashboard
app.get('/snap', async (c) => {
  try {
    // Use Puppeteer to screenshot the dashboard
    const browser: any = await c.env.BROWSER;
    const page = await browser.newPage();
    
    // Navigate to the dashboard
    await page.goto('https://app.axiomid.app', { waitUntil: 'networkidle' });
    
    // Take screenshot
    const screenshot = await page.screenshot({ type: 'png' });
    
    await browser.close();
    
    // Return image
    return new Response(screenshot, {
      headers: { 'Content-Type': 'image/png' }
    });
  } catch (error) {
    console.error('Screenshot error:', error);
    return c.json({ error: 'Failed to capture screenshot' }, 500);
  }
});

// Default route
app.get('/', async (c) => {
  return c.json({
    message: 'Axiom ID - Quantum Edge Architecture',
    version: '2.0.0',
    endpoints: [
      'POST /chat { chatId, message }',
      'GET /snap',
      'GET /health'
    ]
  });
});

export default app;