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
          },
          {
            name: 'get_health_recommendations',
            description: 'Get personalized health recommendations based on user profile',
            parameters: {
              type: 'object',
              properties: {
                age: { type: 'number', description: 'User age' },
                sex: { type: 'string', enum: ['male', 'female'], description: 'User sex' },
                pregnant: { type: 'boolean', description: 'Whether the user is pregnant (if female)' },
                sexualActivity: { type: 'string', description: 'Sexual activity level' },
                tobaccoUse: { type: 'string', description: 'Tobacco use status' }
              },
              required: ['age', 'sex']
            }
          },
          {
            name: 'compute_route',
            description: 'Compute the optimal route between two locations',
            parameters: {
              type: 'object',
              properties: {
                origin: { 
                  type: 'object',
                  description: 'Starting location (lat/lng or address)',
                  properties: {
                    lat: { type: 'number' },
                    lng: { type: 'number' }
                  }
                },
                destination: { 
                  type: 'object',
                  description: 'Destination location (lat/lng or address)',
                  properties: {
                    lat: { type: 'number' },
                    lng: { type: 'number' }
                  }
                },
                mode: { type: 'string', enum: ['driving', 'walking', 'bicycling', 'transit'], description: 'Transportation mode' },
                alternatives: { type: 'boolean', description: 'Whether to compute alternative routes' }
              },
              required: ['origin', 'destination']
            }
          },
          {
            name: 'compute_route_matrix',
            description: 'Compute a matrix of routes between multiple origins and destinations',
            parameters: {
              type: 'object',
              properties: {
                origins: { 
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      lat: { type: 'number' },
                      lng: { type: 'number' }
                    }
                  },
                  description: 'Array of origin locations'
                },
                destinations: { 
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      lat: { type: 'number' },
                      lng: { type: 'number' }
                    }
                  },
                  description: 'Array of destination locations'
                },
                mode: { type: 'string', enum: ['driving', 'walking', 'bicycling', 'transit'], description: 'Transportation mode' }
              },
              required: ['origins', 'destinations']
            }
          },
          {
            name: 'analyze_sentiment',
            description: 'Analyze the sentiment of a given text',
            parameters: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'Text to analyze for sentiment' }
              },
              required: ['text']
            }
          },
          {
            name: 'extract_entities',
            description: 'Extract entities (people, places, organizations, etc.) from text',
            parameters: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'Text to extract entities from' }
              },
              required: ['text']
            }
          },
          {
            name: 'classify_text',
            description: 'Classify text into predefined categories',
            parameters: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'Text to classify' }
              },
              required: ['text']
            }
          },
          {
            name: 'query_market_history',
            description: 'Query historical market data using SQL',
            parameters: {
              type: 'object',
              properties: {
                sql_query: { type: 'string', description: 'SQL query to execute on market history data' }
              },
              required: ['sql_query']
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

// Add new routing cases for NLP functions
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
        
      case 'get_health_recommendations':
        // Route to health agent
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/get-health-recommendations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling health agent:', error);
            return c.json({ error: 'Failed to get health recommendations' }, 500);
          }
        } else {
          return c.json({ error: 'Health agent not available' }, 500);
        }
        
      case 'compute_route':
        // Route to travel agent
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/compute-route', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling travel agent:', error);
            return c.json({ error: 'Failed to compute route' }, 500);
          }
        } else {
          return c.json({ error: 'Travel agent not available' }, 500);
        }
        
      case 'compute_route_matrix':
        // Route to travel agent
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/compute-route-matrix', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling travel agent:', error);
            return c.json({ error: 'Failed to compute route matrix' }, 500);
          }
        } else {
          return c.json({ error: 'Travel agent not available' }, 500);
        }
        
      case 'analyze_sentiment':
        // Route to NLP agent
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/analyze-sentiment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling NLP agent:', error);
            return c.json({ error: 'Failed to analyze sentiment' }, 500);
          }
        } else {
          return c.json({ error: 'NLP agent not available' }, 500);
        }
        
      case 'extract_entities':
        // Route to NLP agent
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/extract-entities', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling NLP agent:', error);
            return c.json({ error: 'Failed to extract entities' }, 500);
          }
        } else {
          return c.json({ error: 'NLP agent not available' }, 500);
        }
        
      case 'classify_text':
        // Route to NLP agent
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/classify-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling NLP agent:', error);
            return c.json({ error: 'Failed to classify text' }, 500);
          }
        } else {
          return c.json({ error: 'NLP agent not available' }, 500);
        }
        
      case 'query_market_history':
        // Route to BigQuery agent via tool executor
        if (c.env.TOOL_EXECUTOR) {
          try {
            const response = await c.env.TOOL_EXECUTOR.fetch('http://tool-executor/run-analysis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parameters)
            });
            
            const result = await response.json();
            return c.json(result);
          } catch (error: any) {
            console.error('Error calling BigQuery agent:', error);
            return c.json({ error: 'Failed to query market history' }, 500);
          }
        } else {
          return c.json({ error: 'BigQuery agent not available' }, 500);
        }
        
      default:
        return c.json({ error: `Unknown function: ${functionName}` }, 400);
    }
  } catch (error: any) {
    console.error('Error routing function call:', error);
    return c.json({ error: 'Failed to route function call' }, 500);
  }
});

export default app;