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
import { GeminiClient } from './gemini';
import { AIResponse } from './gemini-types';
import { FirestoreAuth, FirestoreClient } from './services/firestore';

// Export the Durable Object class
export { ChatRoom } from './objects';

// Define types for our environment
interface Env {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  CHAT_ROOM: DurableObjectNamespace;
  BROWSER: Fetcher;
  GOOGLE_API_KEY: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_SERVICE_ACCOUNT_JSON: string;
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
    
    // Initialize Gemini client
    const geminiClient = new GeminiClient(c.env.GOOGLE_API_KEY);
    
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
    let context = '';
    try {
      const queryVector: any = await c.env.AI.run('@cf/baai/bge-large-en-v1.5', { text: message });
      console.log('Query vector result:', JSON.stringify(queryVector));
      
      // Check if queryVector has the expected structure
      if (!queryVector || !queryVector.data || !Array.isArray(queryVector.data) || queryVector.data.length === 0) {
        console.error('Invalid query vector response:', queryVector);
        context = 'No relevant context found.';
      } else {
        const matches = await c.env.VECTORIZE.query(queryVector.data[0], { topK: 5 });
        console.log('Vectorize matches:', JSON.stringify(matches));
        context = matches.matches.map(match => match.metadata?.text || '').join('\n\n');
      }
    } catch (vectorizeError) {
      console.error('Vectorize error:', vectorizeError);
      context = 'Error retrieving context.';
    }
    
    // Prepare context for LLM
    const conversationHistory = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    // Create prompt with context and history
    const prompt = `You are an expert on the Axiom ID project. Use the following context and conversation history to answer the user's question.
    
Context:
${context}

Conversation History:
${conversationHistory}

User Question: ${message}

Please provide a helpful and accurate response based on the context and conversation history:`;
    
    console.log('Sending prompt to Gemini:', prompt.substring(0, 200) + '...');
    
    // Decide whether to use grounding based on message content
    let aiResponse: AIResponse;
    const lowerMessage = message.toLowerCase();
    const useGrounding = lowerMessage.includes('news') || lowerMessage.includes('price') || lowerMessage.includes('current') || lowerMessage.includes('latest');
    
    if (useGrounding) {
      // Use grounding for news/price related queries
      const payload = geminiClient.createGroundedPayload(prompt, 'You are an expert on the Axiom ID project. Provide accurate and helpful responses.');
      aiResponse = await geminiClient.generateContent(payload);
    } else {
      // Use standard generation
      const payload = {
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }]
      };
      aiResponse = await geminiClient.generateContent(payload);
    }
    
    console.log('Gemini response:', JSON.stringify(aiResponse));
    
    // Save AI response to history via DO fetch method
    await stub.fetch('http://chat-room/add-message', {
      method: 'POST',
      body: JSON.stringify({ role: 'assistant', content: aiResponse.text })
    });
    
    return c.json({ 
      response: aiResponse.text,
      chatId,
      citations: aiResponse.citations,
      searchQueries: aiResponse.searchQueries
    });
  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Internal server error: ' + (error as Error).message }, 500);
  }
});

// Vision endpoint - analyze trading charts
app.post('/analyze-chart', async (c) => {
  try {
    const { image } = await c.req.json();
    
    if (!image) {
      return c.json({ error: 'image (base64) is required' }, 400);
    }
    
    // Initialize Gemini client
    const geminiClient = new GeminiClient(c.env.GOOGLE_API_KEY);
    
    // Create vision payload
    const payload = geminiClient.createVisionPayload(
      image,
      'Analyze this trading chart. Identify patterns (RSI, MACD) and output JSON.',
      'You are a professional trading chart analyst. Provide detailed technical analysis.'
    );
    
    // Generate content
    const aiResponse = await geminiClient.generateContent(payload);
    
    return c.json({
      analysis: aiResponse.text,
      citations: aiResponse.citations,
      searchQueries: aiResponse.searchQueries
    });
  } catch (error) {
    console.error('Chart analysis error:', error);
    return c.json({ error: 'Internal server error: ' + (error as Error).message }, 500);
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

// Firestore query endpoint - allows agents to query Firestore
app.post('/db/query', async (c) => {
  try {
    // Check if required environment variables are set
    if (!c.env.FIREBASE_SERVICE_ACCOUNT_JSON || !c.env.FIREBASE_PROJECT_ID) {
      return c.json({ error: 'Firebase configuration missing' }, 500);
    }

    // Parse request body
    const { operation, collection, id, data, filters } = await c.req.json();
    
    // Initialize Firestore client
    const auth = new FirestoreAuth(c.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    const firestore = new FirestoreClient(c.env.FIREBASE_PROJECT_ID, auth);
    
    let result: any;
    
    switch (operation) {
      case 'get':
        if (!collection || !id) {
          return c.json({ error: 'Collection and ID are required for get operation' }, 400);
        }
        result = await firestore.getDocument(collection, id);
        break;
        
      case 'set':
        if (!collection || !id || !data) {
          return c.json({ error: 'Collection, ID, and data are required for set operation' }, 400);
        }
        result = await firestore.setDocument(collection, id, data);
        break;
        
      case 'query':
        if (!collection || !filters) {
          return c.json({ error: 'Collection and filters are required for query operation' }, 400);
        }
        result = await firestore.runQuery(collection, filters);
        break;
        
      default:
        return c.json({ error: 'Invalid operation. Supported operations: get, set, query' }, 400);
    }
    
    return c.json({ result });
  } catch (error) {
    console.error('Firestore query error:', error);
    return c.json({ error: 'Internal server error: ' + (error as Error).message }, 500);
  }
});

// Default route
app.get('/', async (c) => {
  return c.json({
    message: 'Axiom ID - Quantum Edge Architecture',
    version: '2.0.0',
    endpoints: [
      'POST /chat { chatId, message }',
      'POST /analyze-chart { image }',
      'GET /snap',
      'GET /health',
      'POST /db/query { operation, collection, id, data, filters }'
    ]
  });
});

export default app;