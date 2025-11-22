// packages/workers/social-agent/src/index.ts
// Holistic Social Agent - Spokesperson for Axiom ID
// Triggers: External Cron (Zero Cost Scheduling)

import { Hono } from 'hono';
import { DataMiner, type MiningResult } from './miner';
import { Publisher } from './publisher';

const app = new Hono<{ Bindings: Env }>();

// Environment variables interface
interface Env {
  // Security
  CRON_SECRET: string;

  // Facebook
  PAGE_ACCESS_TOKEN?: string;
  PAGE_ID?: string;

  // Telegram
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHANNEL_ID?: string;

  // Discord
  DISCORD_WEBHOOK_URL?: string;

  // Twitter/X
  TWITTER_API_KEY?: string;
  TWITTER_API_SECRET?: string;
  TWITTER_ACCESS_TOKEN?: string;
  TWITTER_ACCESS_SECRET?: string;

  // Backend Services
  AXIOM_BRAIN_URL?: string;
  TOOL_EXECUTOR_URL?: string;

  // Data Sources
  GITHUB_TOKEN?: string;
  KV_WHITEPAPER?: KVNamespace;
}

// CORS middleware
app.use('*', async (c, next) => {
  c.res.headers.set('Access-Control-Allow-Origin', '*');
  c.res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  await next();
});

// Health check
app.get('/', (c) => {
  return c.json({
    service: 'Axiom ID - Social Agent (Spokesperson)',
    status: 'online',
    version: '2.0.0 - Holistic Edition',
    pillars: ['wins', 'tech', 'vision'],
    timestamp: new Date().toISOString()
  });
});

/**
 * 🎯 MAIN TRIGGER ENDPOINT (Called by External Cron)
 * URL: https://social-agent.axiomid.workers.dev/trigger?pillar=wins&key=YOUR_SECRET
 * 
 * Schedule via cron-job.org (Free):
 * - 9:00 AM UTC: ?pillar=wins
 * - 2:00 PM UTC: ?pillar=tech
 * - 8:00 PM UTC: ?pillar=vision
 */
app.get('/trigger', async (c) => {
  try {
    // Security Check
    const providedKey = c.req.query('key');
    if (!providedKey || providedKey !== c.env.CRON_SECRET) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get Pillar
    const pillar = c.req.query('pillar') as 'wins' | 'tech' | 'vision' | undefined;
    if (!pillar || !['wins', 'tech', 'vision'].includes(pillar)) {
      return c.json({ error: 'Invalid pillar. Must be: wins, tech, or vision' }, 400);
    }

    console.log(`🎯 Trigger received: Pillar = ${pillar}`);

    // Step 1: Mine Data
    const miner = new DataMiner({
      TOOL_EXECUTOR_URL: c.env.TOOL_EXECUTOR_URL,
      GITHUB_TOKEN: c.env.GITHUB_TOKEN,
      KV_WHITEPAPER: c.env.KV_WHITEPAPER
    });

    let miningResult: MiningResult;

    switch (pillar) {
      case 'wins':
        miningResult = await miner.getWins();
        break;
      case 'tech':
        miningResult = await miner.getTech();
        break;
      case 'vision':
        miningResult = await miner.getVision();
        break;
    }

    console.log(`✅ Mined Data: ${miningResult.title}`);

    // Step 2: Publish
    const publisher = new Publisher(c.env, c.env.AXIOM_BRAIN_URL);
    const publishResults = await publisher.publishAll(miningResult);

    // Step 3: Report
    const successCount = publishResults.filter(r => r.success).length;
    const failureCount = publishResults.length - successCount;

    return c.json({
      success: true,
      pillar,
      miningResult: {
        type: miningResult.type,
        title: miningResult.title,
        timestamp: miningResult.timestamp
      },
      publishResults,
      summary: {
        total: publishResults.length,
        success: successCount,
        failed: failureCount
      }
    });

  } catch (error: any) {
    console.error('❌ Trigger failed:', error);
    return c.json({
      error: 'Internal server error',
      details: error.message
    }, 500);
  }
});

/**
 * Manual Testing Endpoint 
 * Use this to test without waiting for cron
 */
app.post('/manual-publish', async (c) => {
  try {
    const { pillar, content } = await c.req.json();

    if (!pillar || !['wins', 'tech', 'vision'].includes(pillar)) {
      return c.json({ error: 'Invalid pillar' }, 400);
    }

    // Create mock mining result
    const miningResult: MiningResult = {
      type: pillar,
      title: content?.title || 'Manual Test Post',
      data: content?.data || {},
      timestamp: new Date().toISOString()
    };

    const publisher = new Publisher(c.env, c.env.AXIOM_BRAIN_URL);
    const publishResults = await publisher.publishAll(miningResult);

    return c.json({ success: true, publishResults });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Status check for monitoring dashboard
 */
app.get('/status', async (c) => {
  return c.json({
    miner: {
      bigquery: !!c.env.TOOL_EXECUTOR_URL,
      github: !!c.env.GITHUB_TOKEN,
      whitepaper: !!c.env.KV_WHITEPAPER
    },
    publisher: {
      telegram: !!c.env.TELEGRAM_BOT_TOKEN,
      discord: !!c.env.DISCORD_WEBHOOK_URL,
      facebook: !!c.env.PAGE_ACCESS_TOKEN,
      twitter: !!c.env.TWITTER_API_KEY
    },
    brain: {
      connected: !!c.env.AXIOM_BRAIN_URL
    }
  });
});

export default app;