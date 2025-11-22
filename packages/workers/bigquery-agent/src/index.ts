// packages/workers/bigquery-agent/src/index.ts - BigQuery Agent for Axiom ID
import { Hono } from 'hono';
import { BigQueryClient } from './client';

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID BigQuery Agent (Data Warehousing Microservice)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /log-event endpoint - Log events to BigQuery
app.post('/log-event', async (c: any) => {
  try {
    const { dataset, table, row }: { dataset: string; table: string; row: any } = await c.req.json();
    
    // Validate required fields
    if (!dataset || !table || !row) {
      return c.json({ error: 'Missing required fields: dataset, table, row' }, 400);
    }
    
    // Check if required environment variables are set
    if (!c.env.BIGQUERY_PROJECT_ID) {
      return c.json({ error: 'BigQuery Project ID not configured' }, 500);
    }
    
    // Initialize BigQuery client
    const bigQueryClient = new BigQueryClient(c.env.BIGQUERY_PROJECT_ID, c.env.AUTH_WORKER);
    
    // Insert row
    const result = await bigQueryClient.insertRows(dataset, table, [row]);
    
    return c.json({ success: true, result });
  } catch (error: any) {
    console.error('Error logging event:', error);
    return c.json({ error: 'Failed to log event: ' + error.message }, 500);
  }
});

// POST /run-analysis endpoint - Run analytical queries
app.post('/run-analysis', async (c: any) => {
  try {
    const { sql }: { sql: string } = await c.req.json();
    
    // Validate required fields
    if (!sql) {
      return c.json({ error: 'Missing required field: sql' }, 400);
    }
    
    // Check if required environment variables are set
    if (!c.env.BIGQUERY_PROJECT_ID) {
      return c.json({ error: 'BigQuery Project ID not configured' }, 500);
    }
    
    // Initialize BigQuery client
    const bigQueryClient = new BigQueryClient(c.env.BIGQUERY_PROJECT_ID, c.env.AUTH_WORKER);
    
    // Run query
    const result = await bigQueryClient.runQuery(sql);
    
    return c.json({ result });
  } catch (error: any) {
    console.error('Error running analysis:', error);
    return c.json({ error: 'Failed to run analysis: ' + error.message }, 500);
  }
});

// POST /estimate-query-cost endpoint - Estimate query cost
app.post('/estimate-query-cost', async (c: any) => {
  try {
    const { sql }: { sql: string } = await c.req.json();
    
    // Validate required fields
    if (!sql) {
      return c.json({ error: 'Missing required field: sql' }, 400);
    }
    
    // Check if required environment variables are set
    if (!c.env.BIGQUERY_PROJECT_ID) {
      return c.json({ error: 'BigQuery Project ID not configured' }, 500);
    }
    
    // Initialize BigQuery client
    const bigQueryClient = new BigQueryClient(c.env.BIGQUERY_PROJECT_ID, c.env.AUTH_WORKER);
    
    // Estimate query cost
    const bytesProcessed = await bigQueryClient.estimateQueryCost(sql);
    const gigabytesProcessed = bytesProcessed / (1024 * 1024 * 1024);
    
    return c.json({ 
      bytesProcessed,
      gigabytesProcessed,
      withinFreeTier: bytesProcessed <= 1024 * 1024 * 1024 * 1024 // 1TB
    });
  } catch (error: any) {
    console.error('Error estimating query cost:', error);
    return c.json({ error: 'Failed to estimate query cost: ' + error.message }, 500);
  }
});

export default app;