// packages/workers/gemini-router/src/index.ts - Gemini Function Calling Router for Nano Banana Architecture
import { Hono } from 'hono';

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID Gemini Router (Nano Banana Architecture)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /function-call endpoint - Handle Gemini Function Calling requests
app.post('/function-call', async (c: any) => {
  try {
    const { functionName, parameters }: { functionName: string; parameters: any } = await c.req.json();
    
    // Validate required fields
    if (!functionName) {
      return c.json({ error: 'Missing required field: functionName' }, 400);
    }
    
    console.log(`Routing function call: ${functionName}`, parameters);
    
    // Route function calls to appropriate tool executors via Service Bindings
    switch (functionName) {
      case 'execute_trade':
        // Route to trade executor
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/execute-trade', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling trade executor:', error);
            return c.json({ error: 'Failed to execute trade' }, 500);
          }
        } else {
          return c.json({ error: 'Trade executor not available' }, 500);
        }
        
      case 'analyze_market':
        // Route to market analyzer
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/analyze-market', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling market analyzer:', error);
            return c.json({ error: 'Failed to analyze market' }, 500);
          }
        } else {
          return c.json({ error: 'Market analyzer not available' }, 500);
        }
        
      case 'get_portfolio':
        // Route to portfolio manager
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/get-portfolio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling portfolio manager:', error);
            return c.json({ error: 'Failed to get portfolio' }, 500);
          }
        } else {
          return c.json({ error: 'Portfolio manager not available' }, 500);
        }
        
      default:
        return c.json({ error: `Unknown function: ${functionName}` }, 400);
    }
  } catch (error: any) {
    console.error('Error routing function call:', error);
    return c.json({ error: 'Failed to route function call' }, 500);
  }
});

// POST /chat endpoint - Handle chat requests with Gemini
app.post('/chat', async (c: any) => {
  try {
    const { message, context }: { message: string; context?: any } = await c.req.json();
    
    // Validate required fields
    if (!message) {
      return c.json({ error: 'Missing required field: message' }, 400);
    }
    
    // Get Google API key from environment variables
    const apiKey = c.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return c.json({ error: 'Google API key not configured' }, 500);
    }
    
    // Prepare Gemini API request
    const geminiPayload = {
      contents: [{
        role: 'user',
        parts: [{ text: message }]
      }],
      tools: [{
        function_declarations: [
          {
            name: 'execute_trade',
            description: 'Execute a trade based on the provided signal',
            parameters: {
              type: 'object',
              properties: {
                token: { type: 'string', description: 'Token symbol to trade' },
                amount: { type: 'number', description: 'Amount to trade' },
                action: { type: 'string', enum: ['buy', 'sell'], description: 'Trade action' }
              },
              required: ['token', 'amount', 'action']
            }
          },
          {
            name: 'analyze_market',
            description: 'Analyze market conditions for a specific token',
            parameters: {
              type: 'object',
              properties: {
                token: { type: 'string', description: 'Token symbol to analyze' },
                timeframe: { type: 'string', description: 'Timeframe for analysis' }
              },
              required: ['token']
            }
          },
          {
            name: 'get_portfolio',
            description: 'Get the current portfolio holdings',
            parameters: {
              type: 'object',
              properties: {
                userId: { type: 'string', description: 'User ID to get portfolio for' }
              },
              required: ['userId']
            }
          }
        ]
      }]
    };
    
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return c.json({ error: 'Failed to call Gemini API' }, 500);
    }
    
    const geminiResponse = await response.json();
    return c.json(geminiResponse);
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return c.json({ error: 'Failed to process chat request' }, 500);
  }
});

export default app;