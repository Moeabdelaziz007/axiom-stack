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
import { createQuotaGuard, QuotaGuard } from './middleware/quota';

// Export the Durable Object class
export { ChatRoom } from './objects';

// Define types for our environment
interface Env {
  VECTORIZE: VectorizeIndex;
  AI: Ai;
  CHAT_ROOM: DurableObjectNamespace;
  AGENT_DO: DurableObjectNamespace;
  BROWSER: Fetcher;
  GLOBAL_CACHE: KVNamespace;
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

// CORS middleware - allow frontend domains
app.use('*', async (c, next) => {
  const origin = c.req.header('Origin');
  const allowedOrigins = [
    'https://axiom-mission-control.pages.dev',
    'https://axiomid.app',
    'http://localhost:3000'
  ];

  if (origin && allowedOrigins.some(allowed => origin === allowed || origin.endsWith('.axiom-mission-control.pages.dev'))) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    c.header('Access-Control-Max-Age', '86400');
  }

  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }

  await next();
});

// Create quota guard middleware for browser rendering
const createBrowserQuotaGuard = (env: Env) => {
  return createQuotaGuard({
    kv: env.GLOBAL_CACHE,
    limit: 600, // 600 seconds = 10 minutes
    resourceType: 'browser'
  });
};

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

// API endpoint to fetch decision/reasoning logs
app.get('/api/logs', async (c) => {
  try {
    // List all decision log keys from KV
    const list = await c.env.GLOBAL_CACHE.list({ prefix: 'decision_log:' });

    // Fetch all logs
    const logsPromises = list.keys.map(async (key) => {
      const value = await c.env.GLOBAL_CACHE.get(key.name);
      if (!value) return null;

      try {
        const logData = JSON.parse(value);
        return {
          id: key.name,
          timestamp: new Date(logData.timestamp).toISOString(),
          level: logData.reasoning ? 'THOUGHT' : 'INFO',
          message: logData.userMessage || logData.decision,
          agentId: logData.chatId,
          reasoning: logData.reasoning,
          metadata: {
            decision: logData.decision,
            type: logData.type
          }
        };
      } catch (err) {
        console.error('Failed to parse log:', err);
        return null;
      }
    });

    const logs = (await Promise.all(logsPromises))
      .filter(log => log !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 200); // Return last 200 logs

    return c.json({ logs });
  } catch (error: any) {
    console.error('Error fetching logs:', error);
    return c.json({ error: 'Failed to fetch logs', logs: [] }, 500);
  }
});

// System metrics endpoint
app.get('/api/metrics/system', async (c) => {
  try {
    // Calculate uptime (store start time in KV on first request)
    let startTime = await c.env.GLOBAL_CACHE.get('system_start_time');
    if (!startTime) {
      startTime = Date.now().toString();
      await c.env.GLOBAL_CACHE.put('system_start_time', startTime);
    }
    const uptime = Date.now() - parseInt(startTime);

    // Query active agents from KV (count keys with prefix 'agent:')
    let activeAgents = 0;
    try {
      const agentList = await c.env.GLOBAL_CACHE.list({ prefix: 'agent:' });
      activeAgents = agentList.keys.length;
    } catch (err) {
      console.error('Failed to count agents:', err);
    }

    // Mock CPU and memory (Cloudflare Workers don't expose real metrics)
    const cpu = Math.floor(Math.random() * 20) + 10; // 10-30%
    const memory = Math.floor(Math.random() * 20) + 20; // 20-40%

    return c.json({
      cpu,
      memory,
      activeAgents,
      uptime,
      status: 'operational'
    });
  } catch (error: any) {
    console.error('Metrics error:', error);
    return c.json({ error: error.message, status: 'degraded' }, 500);
  }
});


// Chat endpoint - handles conversation with memory and RAG
app.post('/chat', async (c) => {
  try {
    const { chatId, message, image, audio } = await c.req.json();

    if (!chatId || (!message && !image && !audio)) {
      return c.json({ error: 'chatId and at least one of (message, image, audio) are required' }, 400);
    }

    // Initialize Gemini client
    const geminiClient = new GeminiClient(c.env.GOOGLE_API_KEY);

    // Get the ChatRoom Durable Object for this chat
    const id = c.env.CHAT_ROOM.idFromName(chatId);
    const stub = c.env.CHAT_ROOM.get(id);

    // Prepare user content based on input type
    let userContent = message || '';

    // Handle image input
    if (image) {
      userContent = userContent || 'Analyze this image';
      // Image will be processed by Gemini Vision API
    }

    // Handle audio input
    if (audio) {
      // Use Cloudflare AI for audio transcription
      // Add user message via DO fetch method
      await stub.fetch('http://chat-room/add-message', {
        method: 'POST',
        body: JSON.stringify({ role: 'user', content: message })
      });

      // Fetch conversation history
      const historyResponse = await stub.fetch('http://chat-room/history');
      const history: Message[] = await historyResponse.json();

      // Initialize Gemini client
      const geminiClient = new GeminiClient(c.env.GOOGLE_API_KEY);

      // Retrieve relevant context from Vectorize
      let context = '';
      try {
        const queryVector = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
          text: [message]
        });

        if (queryVector && queryVector.data && queryVector.data[0]) {
          const matches = await c.env.VECTORIZE.query(queryVector.data[0], { topK: 5 });
          console.log('Vectorize matches:', JSON.stringify(matches));
          context = matches.matches.map(match => match.metadata?.text || '').join('\n\n');
        } else {
          // Fallback or error handling if queryVector is not as expected
          console.warn('Invalid query vector response, attempting to query with first element if available.');
          if (queryVector && queryVector.data && queryVector.data.length > 0) {
            const matches = await c.env.VECTORIZE.query(queryVector.data[0], { topK: 5 });
            console.log('Vectorize matches:', JSON.stringify(matches));
            context = matches.matches.map(match => match.metadata?.text || '').join('\n\n');
          } else {
            console.error('Query vector data is empty or invalid.');
            context = 'No relevant context found.';
          }
        }
      } catch (vectorizeError) {
        console.error('Vectorize error:', vectorizeError);
        context = 'Error retrieving context.';
      }

      // Get Agent Configuration from AGENT_DO (The Source of Truth)
      let allowedTools: string[] = [];
      let systemPrompt = 'You are an expert on the Axiom ID project. Use the following context and conversation history to answer the user\'s question.';

      try {
        // Assume chatId is the agentId for now
        const agentId = c.env.AGENT_DO.idFromString(chatId);
        const agentStub = c.env.AGENT_DO.get(agentId);

        // Fetch agent state to get allowedTools and systemPrompt
        const stateResponse = await agentStub.fetch('http://agent-do/state');
        if (stateResponse.ok) {
          const agentState: any = await stateResponse.json();
          if (agentState && agentState.config && agentState.config.manifest) {
            allowedTools = agentState.config.manifest.allowedTools || [];
            if (agentState.config.manifest.persona && agentState.config.manifest.persona.systemPrompt) {
              systemPrompt = agentState.config.manifest.persona.systemPrompt;
            }
            console.log(`🔒 Enforcing tool gating for agent ${chatId}. Allowed tools: ${allowedTools.join(', ')}`);
          }
        }
      } catch (agentError) {
        console.warn('Failed to fetch agent config from AGENT_DO, falling back to defaults:', agentError);
      }

      // Prepare context for LLM
      const conversationHistory = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');

      // Create prompt with context and history
      const prompt = `
Context:
${context}

Conversation History:
${conversationHistory}

User Question: ${message}

Please provide a helpful and accurate response based on the context and conversation history:`;

      console.log('Sending prompt to Gemini:', prompt.substring(0, 200) + '...');

      // **STRATEGY ENGINE: Execute tool chain with recursive calls**
      const { finalResponse, reasoning, iterations } = await executeToolChain(
        geminiClient,
        prompt,
        systemPrompt,
        allowedTools,
        5 // Max 5 iterations for safety
      );

      console.log(`✅ Tool chain completed in ${iterations} iteration(s)`);

      // **BLACK BOX LOGGING: Store reasoning traces**
      if (reasoning) {
        c.executionCtx.waitUntil(
          (async () => {
            try {
              const decisionLog = {
                timestamp: Date.now(),
                chatId,
                userMessage: message,
                reasoning,
                decision: finalResponse.substring(0, 500),
                iterations,
                type: 'chat_response'
              };

              await c.env.GLOBAL_CACHE.put(
                `decision_log:${chatId}:${Date.now()}`,
                JSON.stringify(decisionLog),
                { expirationTtl: 86400 * 30 } // 30 days retention
              );

              console.log('✅ Decision log stored in KV');
            } catch (logError) {
              console.error('Failed to log decision:', logError);
            }
          })()
        );
      }

      // Save AI response to history via DO fetch method
      await stub.fetch('http://chat-room/add-message', {
        method: 'POST',
        body: JSON.stringify({ role: 'assistant', content: finalResponse })
      });

      return c.json({
        response: finalResponse,
        reasoning: reasoning || undefined,
        iterations,
        chatId
      });
    } // Close if (audio) block

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

// Advanced browser rendering endpoint - for anti-bot protection and complex web scraping
app.post('/render', async (c) => {
  // Apply quota guard to limit browser usage (10 minutes per day)
  const quotaGuard = new QuotaGuard({
    kv: c.env.GLOBAL_CACHE,
    limit: 600, // 600 seconds = 10 minutes
    resourceType: 'browser'
  });

  const withinLimits = await quotaGuard.checkQuota();
  if (!withinLimits) {
    return c.json(
      {
        error: 'Quota exceeded',
        message: 'Daily quota for browser rendering has been exceeded. Limit: 10 minutes per day'
      },
      429
    );
  }

  // Increment usage counter
  await quotaGuard.incrementUsage();

  try {
    const { url, waitUntil, waitForSelector, actions }: {
      url: string;
      waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
      waitForSelector?: string;
      actions?: Array<{ type: 'click' | 'type' | 'wait'; selector?: string; value?: string; duration?: number }>;
    } = await c.req.json();

    if (!url) {
      return c.json({ error: 'URL is required' }, 400);
    }

    // Use Puppeteer with timeout to respect Cloudflare Free Tier limits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout for browser operations

    try {
      const browser: any = await c.env.BROWSER;
      const page = await browser.newPage();

      // Set realistic browser headers to avoid bot detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      });

      // Navigate to the URL
      await page.goto(url, {
        waitUntil: waitUntil || 'networkidle',
        timeout: 20000
      });

      // Wait for specific selector if provided
      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { timeout: 10000 });
      }

      // Perform additional actions if provided
      if (actions && Array.isArray(actions)) {
        for (const action of actions) {
          switch (action.type) {
            case 'click':
              if (action.selector) {
                await page.click(action.selector);
              }
              break;
            case 'type':
              if (action.selector && action.value) {
                await page.type(action.selector, action.value);
              }
              break;
            case 'wait':
              await page.waitForTimeout(action.duration || 1000);
              break;
          }
        }
      }

      // Get page content
      const content = await page.content();
      const title = await page.title();

      // Take screenshot if requested
      let screenshot: string | undefined;
      if (url.includes('chart') || url.includes('graph') || url.includes('dashboard')) {
        const screenshotBuffer = await page.screenshot({ type: 'png' });
        screenshot = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;
      }

      await browser.close();
      clearTimeout(timeoutId);

      return c.json({
        title,
        content,
        screenshot,
        url,
        timestamp: Date.now()
      });
    } catch (browserError: any) {
      clearTimeout(timeoutId);
      throw browserError;
    }
  } catch (error: any) {
    console.error('Browser rendering error:', error);
    if (error.name === 'AbortError') {
      return c.json({ error: 'Browser rendering timeout - operation took too long' }, 408);
    }
    return c.json({ error: 'Failed to render page: ' + error.message }, 500);
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

    // Initialize Firestore client with KV caching
    const auth = new FirestoreAuth(c.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    const firestore = new FirestoreClient(c.env.FIREBASE_PROJECT_ID, auth, c.env.GLOBAL_CACHE);

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
      'POST /render { url, waitUntil, waitForSelector, actions }',
      'GET /health',
      'POST /db/query { operation, collection, id, data, filters }'
    ]
  });
});

export default app;