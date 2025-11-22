// packages/workers/nlp-agent/src/index.ts - Natural Language Processing Agent for Axiom ID
import { Hono } from 'hono';

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID NLP Agent (Cloud Natural Language API Integration)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /analyze-sentiment endpoint - Analyze sentiment of text
app.post('/analyze-sentiment', async (c: any) => {
  try {
    const { text }: { text: string } = await c.req.json();
    
    // Validate required fields
    if (!text) {
      return c.json({ error: 'Missing required field: text' }, 400);
    }
    
    // Validate text length (1-10000 characters for optimal performance)
    if (text.length < 1 || text.length > 10000) {
      return c.json({ error: 'Text must be between 1 and 10000 characters' }, 400);
    }
    
    // Get Google Cloud API key from environment variables
    const apiKey = c.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return c.json({ error: 'Google Cloud API key not configured' }, 500);
    }
    
    // Call Google Cloud Natural Language API for sentiment analysis
    const response = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document: {
            content: text,
            type: 'PLAIN_TEXT'
          },
          encodingType: 'UTF8'
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Cloud Natural Language API error:', errorText);
      return c.json({ error: 'Failed to analyze sentiment: ' + errorText }, response.status);
    }
    
    const result = await response.json();
    
    // Extract sentiment information
    const sentiment = result.documentSentiment;
    const sentences = result.sentences || [];
    
    return c.json({
      sentiment: {
        score: sentiment.score,
        magnitude: sentiment.magnitude
      },
      sentences: sentences.map((sentence: any) => ({
        text: sentence.text.content,
        sentiment: {
          score: sentence.sentiment.score,
          magnitude: sentence.sentiment.magnitude
        }
      })),
      language: result.language
    });
  } catch (error: any) {
    console.error('Error analyzing sentiment:', error);
    return c.json({ error: 'Failed to analyze sentiment: ' + error.message }, 500);
  }
});

// POST /extract-entities endpoint - Extract entities from text
app.post('/extract-entities', async (c: any) => {
  try {
    const { text }: { text: string } = await c.req.json();
    
    // Validate required fields
    if (!text) {
      return c.json({ error: 'Missing required field: text' }, 400);
    }
    
    // Validate text length (1-10000 characters for optimal performance)
    if (text.length < 1 || text.length > 10000) {
      return c.json({ error: 'Text must be between 1 and 10000 characters' }, 400);
    }
    
    // Get Google Cloud API key from environment variables
    const apiKey = c.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return c.json({ error: 'Google Cloud API key not configured' }, 500);
    }
    
    // Call Google Cloud Natural Language API for entity extraction
    const response = await fetch(
      `https://language.googleapis.com/v1/documents:analyzeEntities?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document: {
            content: text,
            type: 'PLAIN_TEXT'
          },
          encodingType: 'UTF8'
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Cloud Natural Language API error:', errorText);
      return c.json({ error: 'Failed to extract entities: ' + errorText }, response.status);
    }
    
    const result = await response.json();
    
    // Extract entity information
    const entities = result.entities || [];
    
    return c.json({
      entities: entities.map((entity: any) => ({
        name: entity.name,
        type: entity.type,
        salience: entity.salience,
        mentions: entity.mentions.map((mention: any) => ({
          text: mention.text.content,
          type: mention.type
        }))
      })),
      language: result.language
    });
  } catch (error: any) {
    console.error('Error extracting entities:', error);
    return c.json({ error: 'Failed to extract entities: ' + error.message }, 500);
  }
});

// POST /classify-text endpoint - Classify text into categories
app.post('/classify-text', async (c: any) => {
  try {
    const { text }: { text: string } = await c.req.json();
    
    // Validate required fields
    if (!text) {
      return c.json({ error: 'Missing required field: text' }, 400);
    }
    
    // Validate text length (1-10000 characters for optimal performance)
    if (text.length < 1 || text.length > 10000) {
      return c.json({ error: 'Text must be between 1 and 10000 characters' }, 400);
    }
    
    // Get Google Cloud API key from environment variables
    const apiKey = c.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      return c.json({ error: 'Google Cloud API key not configured' }, 500);
    }
    
    // Call Google Cloud Natural Language API for text classification
    const response = await fetch(
      `https://language.googleapis.com/v1/documents:classifyText?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          document: {
            content: text,
            type: 'PLAIN_TEXT'
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Cloud Natural Language API error:', errorText);
      return c.json({ error: 'Failed to classify text: ' + errorText }, response.status);
    }
    
    const result = await response.json();
    
    // Extract classification information
    const categories = result.categories || [];
    
    return c.json({
      categories: categories.map((category: any) => ({
        name: category.name,
        confidence: category.confidence
      })),
      language: result.language
    });
  } catch (error: any) {
    console.error('Error classifying text:', error);
    return c.json({ error: 'Failed to classify text: ' + error.message }, 500);
  }
});

export default app;