// packages/workers/tool-executor/src/index.ts - Tool Executor for Nano Banana Architecture
import { Hono } from 'hono';
import { BigQueryClient } from './tools/bigquery';
import { TranslationClient } from './tools/translate';
import { SpeechClient } from './tools/speech';
import { FirebaseClient } from './tools/additional/firebase';
import { SheetsClient } from './tools/additional/sheets';
import { DriveClient } from './tools/additional/drive';
import { CalendarClient, CalendarEvent } from './tools/additional/calendar';
import { JupiterClient } from './tools/jupiter';
import { NCBIClient } from './tools/ncbi';
import { ClinicalTrialsClient } from './tools/clinicaltrials';
import { CDCClient } from './tools/cdc';
import { BirdeyeClient } from './tools/birdeye';
import { DexScreenerClient } from './tools/dexscreener';
import { HeliusClient } from './tools/helius';
import { ProductScraperClient, AffiliateClient } from './tools/affiliate';
import { WhatsAppClient } from './tools/whatsapp';
import { RagLiteTool, RagLiteEnv } from './tools/rag-lite';
import { ShopifyClient } from './tools/shopify';
import { StripeClient } from './tools/stripe';
import { quantumTool } from './tools/quantum';

// Environment interface
interface Env extends RagLiteEnv {
  // ... existing env vars
  OPENAI_API_KEY: string;
  // ...
}

// Initialize Hono app
const app = new Hono<{ Bindings: Env }>();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID Tool Executor (Nano Banana Architecture)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /execute-trade endpoint - Execute a trade
app.post('/execute-trade', async (c: any) => {
  try {
    const { token, amount, action }: { token: string; amount: number; action: string } = await c.req.json();

    // Validate required fields
    if (!token || !amount || !action) {
      return c.json({ error: 'Missing required fields: token, amount, action' }, 400);
    }

    // Validate action
    if (action !== 'buy' && action !== 'sell') {
      return c.json({ error: 'Invalid action. Must be "buy" or "sell"' }, 400);
    }

    console.log(`Executing trade: ${action} ${amount} ${token}`);

    // TODO: Implement actual trade execution logic
    // This would involve:
    // 1. Calling Auth Worker to get Firebase token
    // 2. Updating Firestore with trade details
    // 3. Executing trade on Solana network

    // For now, return a mock result
    const result = {
      success: true,
      transactionId: `tx_${Date.now()}`,
      timestamp: Date.now(),
      token,
      amount,
      action,
      status: 'executed'
    };

    return c.json(result);
  } catch (error: any) {
    console.error('Error executing trade:', error);
    return c.json({ error: 'Failed to execute trade' }, 500);
  }
});

// POST /analyze-market endpoint - Analyze market conditions
app.post('/analyze-market', async (c: any) => {
  try {
    const { token, timeframe }: { token: string; timeframe?: string } = await c.req.json();

    // Validate required fields
    if (!token) {
      return c.json({ error: 'Missing required field: token' }, 400);
    }

    console.log(`Analyzing market for ${token} with timeframe ${timeframe || 'default'}`);

    // TODO: Implement actual market analysis logic
    // This would involve:
    // 1. Fetching market data from APIs
    // 2. Performing technical analysis
    // 3. Generating insights

    // For now, return a mock result
    const result = {
      token,
      timeframe: timeframe || '24h',
      price: 100 + Math.random() * 10, // Mock price
      change: (Math.random() - 0.5) * 10, // Mock change percentage
      volume: Math.random() * 1000000, // Mock volume
      trend: Math.random() > 0.5 ? 'bullish' : 'bearish',
      indicators: {
        rsi: 30 + Math.random() * 40, // Mock RSI
        macd: Math.random() * 2 - 1, // Mock MACD
        movingAverage: 95 + Math.random() * 10 // Mock moving average
      }
    };

    return c.json(result);
  } catch (error: any) {
    console.error('Error analyzing market:', error);
    return c.json({ error: 'Failed to analyze market' }, 500);
  }
});

// POST /get-portfolio endpoint - Get portfolio holdings
app.post('/get-portfolio', async (c: any) => {
  try {
    const { userId }: { userId: string } = await c.req.json();

    // Validate required fields
    if (!userId) {
      return c.json({ error: 'Missing required field: userId' }, 400);
    }

    console.log(`Getting portfolio for user ${userId}`);

    // TODO: Implement actual portfolio retrieval logic
    // This would involve:
    // 1. Calling Auth Worker to get Firebase token
    // 2. Querying Firestore for portfolio data

    // For now, return a mock result
    const result = {
      userId,
      totalValue: 10000 + Math.random() * 5000, // Mock total value
      holdings: [
        { token: 'SOL', amount: 10 + Math.random() * 5, value: 5000 + Math.random() * 2000 },
        { token: 'USDC', amount: 5000 + Math.random() * 2000, value: 5000 + Math.random() * 2000 }
      ],
      lastUpdated: Date.now()
    };

    return c.json(result);
  } catch (error: any) {
    console.error('Error getting portfolio:', error);
    return c.json({ error: 'Failed to get portfolio' }, 500);
  }
});

// POST /upload-asset endpoint - Upload asset to R2
app.post('/upload-asset', async (c: any) => {
  try {
    const { fileName, data }: { fileName: string; data: string } = await c.req.json();

    // Validate required fields
    if (!fileName || !data) {
      return c.json({ error: 'Missing required fields: fileName, data' }, 400);
    }

    // Check if R2 bucket is configured
    if (!c.env.ASSETS_BUCKET) {
      return c.json({ error: 'R2 bucket not configured' }, 500);
    }

    console.log(`Uploading asset ${fileName} to R2`);

    // TODO: Implement actual R2 upload logic
    // This would involve:
    // 1. Uploading file to R2 bucket
    // 2. Returning signed URL for access

    // For now, return a mock result
    const result = {
      fileName,
      url: `https://axiom-assets.cloudflare.com/${fileName}`,
      uploadedAt: Date.now()
    };

    return c.json(result);
  } catch (error: any) {
    console.error('Error uploading asset:', error);
    return c.json({ error: 'Failed to upload asset' }, 500);
  }
});

// POST /get-health-recommendations endpoint - Route to Health Agent
app.post('/get-health-recommendations', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to Health Agent via Service Binding (Nano Banana optimization)
    if (c.env.HEALTH_AGENT) {
      try {
        const response = await c.env.HEALTH_AGENT.fetch('http://health-agent/get-health-recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
  } catch (error: any) {
    console.error('Error routing to health agent:', error);
    return c.json({ error: 'Failed to route to health agent' }, 500);
  }
});

// POST /analyze-sentiment endpoint - Route to NLP Agent
app.post('/analyze-sentiment', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to NLP Agent via Service Binding (Nano Banana optimization)
    if (c.env.NLP_AGENT) {
      try {
        const response = await c.env.NLP_AGENT.fetch('http://nlp-agent/analyze-sentiment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
  } catch (error: any) {
    console.error('Error routing to NLP agent:', error);
    return c.json({ error: 'Failed to route to NLP agent' }, 500);
  }
});

// POST /extract-entities endpoint - Route to NLP Agent
app.post('/extract-entities', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to NLP Agent via Service Binding (Nano Banana optimization)
    if (c.env.NLP_AGENT) {
      try {
        const response = await c.env.NLP_AGENT.fetch('http://nlp-agent/extract-entities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
  } catch (error: any) {
    console.error('Error routing to NLP agent:', error);
    return c.json({ error: 'Failed to route to NLP agent' }, 500);
  }
});

// POST /classify-text endpoint - Route to NLP Agent
app.post('/classify-text', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to NLP Agent via Service Binding (Nano Banana optimization)
    if (c.env.NLP_AGENT) {
      try {
        const response = await c.env.NLP_AGENT.fetch('http://nlp-agent/classify-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
  } catch (error: any) {
    console.error('Error routing to NLP agent:', error);
    return c.json({ error: 'Failed to route to NLP agent' }, 500);
  }
});

// POST /compute-route endpoint - Route to Travel Agent
app.post('/compute-route', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to Travel Agent via Service Binding (Nano Banana optimization)
    if (c.env.TRAVEL_AGENT) {
      try {
        const response = await c.env.TRAVEL_AGENT.fetch('http://travel-agent/compute-route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
  } catch (error: any) {
    console.error('Error routing to travel agent:', error);
    return c.json({ error: 'Failed to route to travel agent' }, 500);
  }
});

// POST /compute-route-matrix endpoint - Route to Travel Agent
app.post('/compute-route-matrix', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to Travel Agent via Service Binding (Nano Banana optimization)
    if (c.env.TRAVEL_AGENT) {
      try {
        const response = await c.env.TRAVEL_AGENT.fetch('http://travel-agent/compute-route-matrix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
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
  } catch (error: any) {
    console.error('Error routing to travel agent:', error);
    return c.json({ error: 'Failed to route to travel agent' }, 500);
  }
});

// POST /log-event endpoint - Log events to BigQuery
app.post('/log-event', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to BigQuery Agent via Service Binding
    if (c.env.BIGQUERY_AGENT) {
      try {
        const response = await c.env.BIGQUERY_AGENT.fetch('http://bigquery-agent/log-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        return c.json(result);
      } catch (error: any) {
        console.error('Error calling BigQuery agent:', error);
        return c.json({ error: 'Failed to log event' }, 500);
      }
    } else {
      return c.json({ error: 'BigQuery agent not available' }, 500);
    }
  } catch (error: any) {
    console.error('Error routing to BigQuery agent:', error);
    return c.json({ error: 'Failed to route to BigQuery agent' }, 500);
  }
});

// POST /run-analysis endpoint - Run analytical queries
app.post('/run-analysis', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to BigQuery Agent via Service Binding
    if (c.env.BIGQUERY_AGENT) {
      try {
        const response = await c.env.BIGQUERY_AGENT.fetch('http://bigquery-agent/run-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        return c.json(result);
      } catch (error: any) {
        console.error('Error calling BigQuery agent:', error);
        return c.json({ error: 'Failed to run analysis' }, 500);
      }
    } else {
      return c.json({ error: 'BigQuery agent not available' }, 500);
    }
  } catch (error: any) {
    console.error('Error routing to BigQuery agent:', error);
    return c.json({ error: 'Failed to route to BigQuery agent' }, 500);
  }
});

// POST /estimate-query-cost endpoint - Estimate query cost
app.post('/estimate-query-cost', async (c: any) => {
  try {
    const payload = await c.req.json();

    // Route to BigQuery Agent via Service Binding
    if (c.env.BIGQUERY_AGENT) {
      try {
        const response = await c.env.BIGQUERY_AGENT.fetch('http://bigquery-agent/estimate-query-cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        return c.json(result);
      } catch (error: any) {
        console.error('Error calling BigQuery agent:', error);
        return c.json({ error: 'Failed to estimate query cost' }, 500);
      }
    } else {
      return c.json({ error: 'BigQuery agent not available' }, 500);
    }
  } catch (error: any) {
    console.error('Error routing to BigQuery agent:', error);
    return c.json({ error: 'Failed to route to BigQuery agent' }, 500);
  }
});

// POST /run-analytics endpoint - Execute BigQuery analytics
app.post('/run-analytics', async (c: any) => {
  try {
    const { sql }: { sql: string } = await c.req.json();

    // Validate required fields
    if (!sql) {
      return c.json({ error: 'Missing required field: sql' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.GOOGLE_CLOUD_PROJECT_ID) {
      return c.json({ error: 'Google Cloud Project ID not configured' }, 500);
    }

    // Initialize BigQuery client
    const bigQueryClient = new BigQueryClient(
      c.env.GOOGLE_CLOUD_PROJECT_ID,
      c.env.AUTH_WORKER,
      c.env.BIGQUERY_USAGE_KV // KV namespace for usage tracking
    );

    // Execute query
    const result = await bigQueryClient.runQuery(sql);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error running analytics query:', error);
    return c.json({ error: 'Failed to run analytics query: ' + error.message }, 500);
  }
});

// POST /translate endpoint - Translate text
app.post('/translate', async (c: any) => {
  try {
    const { text, targetLang }: { text: string; targetLang: string } = await c.req.json();

    // Validate required fields
    if (!text || !targetLang) {
      return c.json({ error: 'Missing required fields: text, targetLang' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.GOOGLE_TRANSLATE_API_KEY) {
      return c.json({ error: 'Google Translate API key not configured' }, 500);
    }

    // Initialize Translation client
    const translationClient = new TranslationClient(c.env.GOOGLE_TRANSLATE_API_KEY);

    // Translate text
    const result = await translationClient.translateText(text, targetLang);

    return c.json(result);
  } catch (error: any) {
    console.error('Error translating text:', error);
    return c.json({ error: 'Failed to translate text: ' + error.message }, 500);
  }
});

// POST /transcribe-audio endpoint - Transcribe audio
app.post('/transcribe-audio', async (c: any) => {
  try {
    const { audio }: { audio: string } = await c.req.json();

    // Validate required fields
    if (!audio) {
      return c.json({ error: 'Missing required field: audio' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.GOOGLE_SPEECH_API_KEY) {
      return c.json({ error: 'Google Speech API key not configured' }, 500);
    }

    // Initialize Speech client
    const speechClient = new SpeechClient(c.env.GOOGLE_SPEECH_API_KEY);

    // Transcribe audio
    const result = await speechClient.transcribe(audio);

    return c.json({ transcript: result });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    return c.json({ error: 'Failed to transcribe audio: ' + error.message }, 500);
  }
});

// POST /analyze-pronunciation endpoint
app.post('/analyze-pronunciation', async (c: any) => {
  try {
    const { audioBase64, targetLanguage }: { audioBase64: string; targetLanguage: string } = await c.req.json();

    if (!c.env.GOOGLE_SPEECH_API_KEY) {
      return c.json({ error: 'Google Speech API key not configured' }, 500);
    }

    const speech = new SpeechClient(c.env.GOOGLE_SPEECH_API_KEY);
    const analysis = await speech.analyzePronunciation(audioBase64, targetLanguage);
    return c.json(analysis);
  } catch (error: any) {
    console.error('Error analyzing pronunciation:', error);
    return c.json({ error: 'Failed to analyze pronunciation' }, 500);
  }
});

// POST /scrape-product endpoint
app.post('/scrape-product', async (c: any) => {
  try {
    const { url }: { url: string } = await c.req.json();
    const scraper = new ProductScraperClient();
    const result = await scraper.scrape(url);
    return c.json(result);
  } catch (error: any) {
    console.error('Error scraping product:', error);
    return c.json({ error: 'Failed to scrape product' }, 500);
  }
});

// POST /generate-affiliate-link endpoint
app.post('/generate-affiliate-link', async (c: any) => {
  try {
    const { productId, platform }: { productId: string; platform: string } = await c.req.json();
    const affiliate = new AffiliateClient();
    const result = await affiliate.generateLink(productId, platform);
    return c.json(result);
  } catch (error: any) {
    console.error('Error generating affiliate link:', error);
    return c.json({ error: 'Failed to generate affiliate link' }, 500);
  }
});

// POST /shopify-sync endpoint
app.post('/shopify-sync', async (c: any) => {
  try {
    const { storeUrl, apiKey }: { storeUrl: string; apiKey: string } = await c.req.json();
    const shopify = new ShopifyClient(apiKey);
    const result = await shopify.syncProducts(storeUrl);
    return c.json(result);
  } catch (error: any) {
    console.error('Error syncing Shopify:', error);
    return c.json({ error: 'Failed to sync Shopify store' }, 500);
  }
});

// POST /process-payment endpoint
app.post('/process-payment', async (c: any) => {
  try {
    const { amount, currency, customerId }: { amount: number; currency: string; customerId: string } = await c.req.json();

    if (!c.env.STRIPE_API_KEY) {
      // Fallback for dev/test if no key provided
      console.warn("STRIPE_API_KEY not set, using mock mode");
    }

    const stripe = new StripeClient(c.env.STRIPE_API_KEY || "mock_key");
    const result = await stripe.processPayment(amount, currency, customerId);
    return c.json(result);
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return c.json({ error: 'Failed to process payment' }, 500);
  }
});

// POST /firebase-get-document endpoint - Get a document from Firebase
app.post('/firebase-get-document', async (c: any) => {
  try {
    const { collection, documentId }: { collection: string; documentId: string } = await c.req.json();

    // Validate required fields
    if (!collection || !documentId) {
      return c.json({ error: 'Missing required fields: collection, documentId' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.FIREBASE_PROJECT_ID || !c.env.FIREBASE_CLIENT_EMAIL || !c.env.FIREBASE_PRIVATE_KEY) {
      return c.json({ error: 'Firebase configuration not set' }, 500);
    }

    // Initialize Firebase client
    const firebaseClient = new FirebaseClient({
      projectId: c.env.FIREBASE_PROJECT_ID,
      clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
      privateKey: c.env.FIREBASE_PRIVATE_KEY
    });

    // Get document
    const result = await firebaseClient.getDocument(collection, documentId);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error getting Firebase document:', error);
    return c.json({ error: 'Failed to get Firebase document: ' + error.message }, 500);
  }
});

// POST /firebase-set-document endpoint - Set a document in Firebase
app.post('/firebase-set-document', async (c: any) => {
  try {
    const { collection, documentId, data }: { collection: string; documentId: string | null; data: Record<string, any> } = await c.req.json();

    // Validate required fields
    if (!collection || !data) {
      return c.json({ error: 'Missing required fields: collection, data' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.FIREBASE_PROJECT_ID || !c.env.FIREBASE_CLIENT_EMAIL || !c.env.FIREBASE_PRIVATE_KEY) {
      return c.json({ error: 'Firebase configuration not set' }, 500);
    }

    // Initialize Firebase client
    const firebaseClient = new FirebaseClient({
      projectId: c.env.FIREBASE_PROJECT_ID,
      clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
      privateKey: c.env.FIREBASE_PRIVATE_KEY
    });

    // Set document
    const result = await firebaseClient.setDocument(collection, documentId, data);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error setting Firebase document:', error);
    return c.json({ error: 'Failed to set Firebase document: ' + error.message }, 500);
  }
});

// POST /sheets-get-data endpoint - Get data from Google Sheets
app.post('/sheets-get-data', async (c: any) => {
  try {
    const { range }: { range: string } = await c.req.json();

    // Validate required fields
    if (!range) {
      return c.json({ error: 'Missing required field: range' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.SHEETS_CLIENT_ID || !c.env.SHEETS_CLIENT_SECRET || !c.env.SHEETS_REFRESH_TOKEN || !c.env.SHEETS_SPREADSHEET_ID) {
      return c.json({ error: 'Google Sheets configuration not set' }, 500);
    }

    // Initialize Sheets client
    const sheetsClient = new SheetsClient({
      clientId: c.env.SHEETS_CLIENT_ID,
      clientSecret: c.env.SHEETS_CLIENT_SECRET,
      refreshToken: c.env.SHEETS_REFRESH_TOKEN,
      spreadsheetId: c.env.SHEETS_SPREADSHEET_ID
    });

    // Get sheet data
    const result = await sheetsClient.getSheetData(range);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error getting Sheets data:', error);
    return c.json({ error: 'Failed to get Sheets data: ' + error.message }, 500);
  }
});

// POST /sheets-update-data endpoint - Update data in Google Sheets
app.post('/sheets-update-data', async (c: any) => {
  try {
    const { range, values }: { range: string; values: any[][] } = await c.req.json();

    // Validate required fields
    if (!range || !values) {
      return c.json({ error: 'Missing required fields: range, values' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.SHEETS_CLIENT_ID || !c.env.SHEETS_CLIENT_SECRET || !c.env.SHEETS_REFRESH_TOKEN || !c.env.SHEETS_SPREADSHEET_ID) {
      return c.json({ error: 'Google Sheets configuration not set' }, 500);
    }

    // Initialize Sheets client
    const sheetsClient = new SheetsClient({
      clientId: c.env.SHEETS_CLIENT_ID,
      clientSecret: c.env.SHEETS_CLIENT_SECRET,
      refreshToken: c.env.SHEETS_REFRESH_TOKEN,
      spreadsheetId: c.env.SHEETS_SPREADSHEET_ID
    });

    // Update sheet data
    const result = await sheetsClient.updateSheetData(range, values);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error updating Sheets data:', error);
    return c.json({ error: 'Failed to update Sheets data: ' + error.message }, 500);
  }
});

// POST /drive-list-files endpoint - List files in Google Drive
app.post('/drive-list-files', async (c: any) => {
  try {
    const { query, limit }: { query?: string; limit?: number } = await c.req.json();

    // Check if required environment variables are set
    if (!c.env.DRIVE_CLIENT_ID || !c.env.DRIVE_CLIENT_SECRET || !c.env.DRIVE_REFRESH_TOKEN) {
      return c.json({ error: 'Google Drive configuration not set' }, 500);
    }

    // Initialize Drive client
    const driveClient = new DriveClient({
      clientId: c.env.DRIVE_CLIENT_ID,
      clientSecret: c.env.DRIVE_CLIENT_SECRET,
      refreshToken: c.env.DRIVE_REFRESH_TOKEN
    });

    // List files
    const result = await driveClient.listFiles(query, limit);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error listing Drive files:', error);
    return c.json({ error: 'Failed to list Drive files: ' + error.message }, 500);
  }
});

// POST /drive-upload-file endpoint - Upload a file to Google Drive
app.post('/drive-upload-file', async (c: any) => {
  try {
    const { fileName, mimeType, data, parentId }: { fileName: string; mimeType: string; data: string; parentId?: string } = await c.req.json();

    // Validate required fields
    if (!fileName || !mimeType || !data) {
      return c.json({ error: 'Missing required fields: fileName, mimeType, data' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.DRIVE_CLIENT_ID || !c.env.DRIVE_CLIENT_SECRET || !c.env.DRIVE_REFRESH_TOKEN) {
      return c.json({ error: 'Google Drive configuration not set' }, 500);
    }

    // Initialize Drive client
    const driveClient = new DriveClient({
      clientId: c.env.DRIVE_CLIENT_ID,
      clientSecret: c.env.DRIVE_CLIENT_SECRET,
      refreshToken: c.env.DRIVE_REFRESH_TOKEN
    });

    // Convert base64 data to ArrayBuffer
    const binaryString = atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Upload file
    const result = await driveClient.uploadFile(fileName, mimeType, bytes.buffer, parentId);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error uploading Drive file:', error);
    return c.json({ error: 'Failed to upload Drive file: ' + error.message }, 500);
  }
});

// POST /calendar-list-events endpoint - List events in Google Calendar
app.post('/calendar-list-events', async (c: any) => {
  try {
    const { calendarId, timeMin, timeMax, maxResults }: { calendarId?: string; timeMin?: string; timeMax?: string; maxResults?: number } = await c.req.json();

    // Check if required environment variables are set
    if (!c.env.CALENDAR_CLIENT_ID || !c.env.CALENDAR_CLIENT_SECRET || !c.env.CALENDAR_REFRESH_TOKEN) {
      return c.json({ error: 'Google Calendar configuration not set' }, 500);
    }

    // Initialize Calendar client
    const calendarClient = new CalendarClient({
      clientId: c.env.CALENDAR_CLIENT_ID,
      clientSecret: c.env.CALENDAR_CLIENT_SECRET,
      refreshToken: c.env.CALENDAR_REFRESH_TOKEN
    });

    // List events
    const result = await calendarClient.listEvents(calendarId || 'primary', timeMin, timeMax, maxResults);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error listing Calendar events:', error);
    return c.json({ error: 'Failed to list Calendar events: ' + error.message }, 500);
  }
});

// POST /calendar-create-event endpoint - Create an event in Google Calendar
app.post('/calendar-create-event', async (c: any) => {
  try {
    const { calendarId, event }: { calendarId?: string; event: CalendarEvent } = await c.req.json();

    // Validate required fields
    if (!event) {
      return c.json({ error: 'Missing required field: event' }, 400);
    }

    // Check if required environment variables are set
    if (!c.env.CALENDAR_CLIENT_ID || !c.env.CALENDAR_CLIENT_SECRET || !c.env.CALENDAR_REFRESH_TOKEN) {
      return c.json({ error: 'Google Calendar configuration not set' }, 500);
    }

    // Initialize Calendar client
    const calendarClient = new CalendarClient({
      clientId: c.env.CALENDAR_CLIENT_ID,
      clientSecret: c.env.CALENDAR_CLIENT_SECRET,
      refreshToken: c.env.CALENDAR_REFRESH_TOKEN
    });

    // Create event
    const result = await calendarClient.createEvent(calendarId || 'primary', event);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error creating Calendar event:', error);
    return c.json({ error: 'Failed to create Calendar event: ' + error.message }, 500);
  }
});

// POST /get-auth-price endpoint - Get authentication price (Jupiter integration)
app.post('/get-auth-price', async (c: any) => {
  try {
    const { token }: { token: string } = await c.req.json();

    // Validate required fields
    if (!token) {
      return c.json({ error: 'Missing required field: token' }, 400);
    }
    // Initialize Jupiter client
    const jupiterClient = new JupiterClient();

    // Get price for token (example: SOL to USDC)
    // In a real implementation, you would map token symbols to mint addresses
    const mintAddresses: Record<string, string> = {
      'SOL': 'So11111111111111111111111111111111111111112',
      'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
    };

    const inputMint = mintAddresses[token] || mintAddresses['SOL'];
    const outputMint = mintAddresses['USDC'];

    const quote = await jupiterClient.getQuote(inputMint, outputMint, 1000000); // 1 unit

    return c.json({ price: quote.outAmount });
  } catch (error: any) {
    console.error('Error getting auth price:', error);
    return c.json({ error: 'Failed to get auth price: ' + error.message }, 500);
  }
});

// --- ELITE AGENT RPC METHODS ---

// QUANTUM TRADER TOOLS
app.post('/scan_token_security', async (c: any) => {
  // TODO: Implement RugCheck / Helius audit
  return c.json({ safe: true, score: 95, warnings: [] });
});

app.post('/get_jupiter_quote', async (c: any) => {
  const body = await c.req.json();
  const jupiter = new JupiterClient();
  // Mock implementation for now, assuming body has inputMint, outputMint, amount
  // const quote = await jupiter.getQuote(body.inputMint, body.outputMint, body.amount);
  return c.json({ quote: "mock_quote_data", outAmount: 1000 });
});

app.post('/execute_swap_solana', async (c: any) => {
  // TODO: Implement actual swap execution
  return c.json({ txId: "mock_tx_id", status: "confirmed" });
});

app.post('/analyze_chart_image', async (c: any) => {
  // TODO: Implement Vision API analysis
  return c.json({ pattern: "bullish_engulfing", sentiment: "bullish" });
});

app.post('/check_network_fee', async (c: any) => {
  const helius = new HeliusClient(c.env.HELIUS_API_KEY || "");
  // const fees = await helius.getPriorityFees();
  return c.json({ priorityFee: "high", recommended: 5000 });
});

app.post('/get_token_data', async (c: any) => {
  // TODO: Implement Birdeye/DexScreener fetch
  return c.json({ price: 100, liquidity: 500000, volume24h: 1000000 });
});


// NEXUS ANALYST TOOLS
app.post('/run_bigquery_sql', async (c: any) => {
  const { sql } = await c.req.json();
  // Reuse existing BigQuery logic
  if (!c.env.GOOGLE_CLOUD_PROJECT_ID) return c.json({ error: "No GCP Project" }, 500);
  const bq = new BigQueryClient(c.env.GOOGLE_CLOUD_PROJECT_ID, c.env.AUTH_WORKER, c.env.BIGQUERY_USAGE_KV);
  const result = await bq.runQuery(sql);
  return c.json({ result });
});

app.post('/execute_python_script', async (c: any) => {
  // TODO: Implement Cloud Run / Python sandbox execution
  return c.json({ output: "mock_python_output", success: true });
});

app.post('/google_search_grounding', async (c: any) => {
  // TODO: Implement Google Search API
  return c.json({ results: [{ title: "Mock Result", snippet: "Verified info" }] });
});

app.post('/analyze_sentiment_nlp', async (c: any) => {
  // Reuse existing NLP route or logic
  return c.json({ sentiment: "positive", score: 0.8 });
});

app.post('/save_report_firestore', async (c: any) => {
  // Reuse existing Firebase logic
  return c.json({ success: true, docId: "report_123" });
});


// NOMAD VOYAGER TOOLS
app.post('/plan_route_maps', async (c: any) => {
  // Reuse existing route logic
  return c.json({ route: "mock_route_data", duration: "2h" });
});

app.post('/get_health_advisory', async (c: any) => {
  const cdc = new CDCClient();
  // const advisory = await cdc.getAdvisory(country);
  return c.json({ advisory: "Level 1: Practice Usual Precautions" });
});

app.post('/translate_text', async (c: any) => {
  const { text, target } = await c.req.json();
  const translator = new TranslationClient(c.env.GOOGLE_TRANSLATE_API_KEY || "");
  const result = await translator.translateText(text, target);
  return c.json(result);
});

app.post('/add_calendar_event', async (c: any) => {
  // Reuse existing calendar logic
  return c.json({ eventId: "evt_123", status: "confirmed" });
});

app.post('/get_weather_forecast', async (c: any) => {
  // TODO: Implement Weather API
  return c.json({ temp: 25, condition: "Sunny" });
});

// POST /birdeye-token-overview endpoint
app.post('/birdeye-token-overview', async (c: any) => {
  try {
    const { address }: { address: string } = await c.req.json();

    if (!address) {
      return c.json({ error: 'Missing required field: address' }, 400);
    }

    if (!c.env.BIRDEYE_API_KEY) {
      return c.json({ error: 'Birdeye API key not configured' }, 500);
    }

    const client = new BirdeyeClient(c.env.BIRDEYE_API_KEY);
    const result = await client.getTokenOverview(address);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error getting Birdeye token overview:', error);
    return c.json({ error: 'Failed to get token overview: ' + error.message }, 500);
  }
});

// POST /birdeye-trending endpoint
app.post('/birdeye-trending', async (c: any) => {
  try {
    const { limit }: { limit?: number } = await c.req.json();

    if (!c.env.BIRDEYE_API_KEY) {
      return c.json({ error: 'Birdeye API key not configured' }, 500);
    }

    const client = new BirdeyeClient(c.env.BIRDEYE_API_KEY);
    const result = await client.getTrending(limit);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error getting Birdeye trending tokens:', error);
    return c.json({ error: 'Failed to get trending tokens: ' + error.message }, 500);
  }
});

// POST /dexscreener-pair endpoint
app.post('/dexscreener-pair', async (c: any) => {
  try {
    const { chainId, pairAddress }: { chainId: string; pairAddress: string } = await c.req.json();

    if (!chainId || !pairAddress) {
      return c.json({ error: 'Missing required fields: chainId, pairAddress' }, 400);
    }

    const client = new DexScreenerClient();
    const result = await client.getPair(chainId, pairAddress);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error getting DexScreener pair:', error);
    return c.json({ error: 'Failed to get pair data: ' + error.message }, 500);
  }
});

// POST /dexscreener-search endpoint
app.post('/dexscreener-search', async (c: any) => {
  try {
    const { query }: { query: string } = await c.req.json();

    if (!query) {
      return c.json({ error: 'Missing required field: query' }, 400);
    }

    const client = new DexScreenerClient();
    const result = await client.searchPairs(query);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error searching DexScreener:', error);
    return c.json({ error: 'Failed to search pairs: ' + error.message }, 500);
  }
});

// POST /search-science endpoint - Search scientific papers (NCBI integration)
app.post('/search-science', async (c: any) => {
  try {
    const { query }: { query: string } = await c.req.json();

    // Validate required fields
    if (!query) {
      return c.json({ error: 'Missing required field: query' }, 400);
    }

    // Initialize NCBI client
    const ncbiClient = new NCBIClient();

    // Search for papers
    const result = await ncbiClient.searchPapers(query);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error searching science papers:', error);
    return c.json({ error: 'Failed to search science papers: ' + error.message }, 500);
  }
});

// POST /search-clinical-trials endpoint - Search clinical trials (ClinicalTrials.gov integration)
app.post('/search-clinical-trials', async (c: any) => {
  try {
    const { query, count }: { query: string; count?: number } = await c.req.json();

    // Validate required fields
    if (!query) {
      return c.json({ error: 'Missing required field: query' }, 400);
    }

    // Initialize ClinicalTrials client
    const clinicalTrialsClient = new ClinicalTrialsClient();

    // Search for clinical trials
    const result = await clinicalTrialsClient.searchTrials(query, count || 20);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error searching clinical trials:', error);
    return c.json({ error: 'Failed to search clinical trials: ' + error.message }, 500);
  }
});

// POST /get-clinical-trial endpoint - Get detailed clinical trial information (ClinicalTrials.gov integration)
app.post('/get-clinical-trial', async (c: any) => {
  try {
    const { nctId }: { nctId: string } = await c.req.json();

    // Validate required fields
    if (!nctId) {
      return c.json({ error: 'Missing required field: nctId' }, 400);
    }

    // Initialize ClinicalTrials client
    const clinicalTrialsClient = new ClinicalTrialsClient();

    // Get detailed trial information
    const result = await clinicalTrialsClient.getTrial(nctId);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error getting clinical trial:', error);
    return c.json({ error: 'Failed to get clinical trial: ' + error.message }, 500);
  }
});

// POST /search-cdc-data endpoint - Search public health data (CDC integration)
app.post('/search-cdc-data', async (c: any) => {
  try {
    const { datasetId, query, limit }: { datasetId: string; query?: string; limit?: number } = await c.req.json();

    // Validate required fields
    if (!datasetId) {
      return c.json({ error: 'Missing required field: datasetId' }, 400);
    }

    // Initialize CDC client
    const cdcClient = new CDCClient();

    // Search for health data
    const result = await cdcClient.searchHealthData(datasetId, query, limit || 20);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error searching CDC data:', error);
    return c.json({ error: 'Failed to search CDC data: ' + error.message }, 500);
  }
});

// POST /get-health-condition endpoint - Get health condition data (CDC integration)
app.post('/get-health-condition', async (c: any) => {
  try {
    const { condition, location, limit }: { condition: string; location?: string; limit?: number } = await c.req.json();

    // Validate required fields
    if (!condition) {
      return c.json({ error: 'Missing required field: condition' }, 400);
    }

    // Initialize CDC client
    const cdcClient = new CDCClient();

    // Get health condition data
    const result = await cdcClient.getHealthCondition(condition, location, limit || 20);

    return c.json({ result });
  } catch (error: any) {
    console.error('Error getting health condition data:', error);
    return c.json({ error: 'Failed to get health condition data: ' + error.message }, 500);
  }
});

// --- RAG LITE ENDPOINTS ---

/**
 * Ingest text chunks for RAG
 * Body: { chunks: string[], metadata: { businessId: string, ... } }
 */
app.post('/rag-ingest', async (c) => {
  try {
    const { chunks, metadata } = await c.req.json();

    if (!chunks || !Array.isArray(chunks) || !metadata || !metadata.businessId) {
      return c.json({ error: 'Invalid input. Requires chunks array and metadata.businessId' }, 400);
    }

    const ragTool = new RagLiteTool(c.env);
    const result = await ragTool.ingest(chunks, metadata);

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Query RAG index
 * Body: { query: string, businessId: string }
 */
app.post('/rag-query', async (c) => {
  try {
    const { query, businessId } = await c.req.json();

    if (!query || !businessId) {
      return c.json({ error: 'Invalid input. Requires query and businessId' }, 400);
    }

    const ragTool = new RagLiteTool(c.env);
    const result = await ragTool.query(query, businessId);

    return c.json(result);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// --- QUANTUM ENTROPY ENDPOINT ---
app.post('/get-quantum-seed', async (c: any) => {
  try {
    const { length }: { length?: number } = await c.req.json();

    console.log(`Generating quantum seed with length ${length || 16}`);

    // Execute quantum tool
    const result = await quantumTool.execute({ length: length || 16 });

    return c.json(result);
  } catch (error: any) {
    console.error('Error generating quantum seed:', error);
    return c.json({
      error: 'Failed to generate quantum seed: ' + error.message,
      fallback: true
    }, 500);
  }
});

export default app;