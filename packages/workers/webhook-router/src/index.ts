// packages/workers/webhook-router/src/index.ts - Universal Webhook Router
import { Hono } from 'hono';
import { handleTelegramWebhook } from './telegram';
import { handleWhatsAppWebhook } from './whatsapp';
import { handleDiscordWebhook } from './discord';

interface Env {
    AGENT_FACTORY: Fetcher;
    TELEGRAM_SECRET_TOKEN: string;
    WHATSAPP_APP_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// Health check
app.get('/', (c) => {
    return c.json({
        service: 'Axiom Webhook Router',
        version: '1.0.0',
        endpoints: [
            'POST /telegram/:agentId',
            'POST /whatsapp/:agentId',
            'POST /discord/:agentId'
        ]
    });
});

// Telegram webhook endpoint
app.post('/telegram/:agentId', async (c) => {
    try {
        const agentId = c.req.param('agentId');
        const secretToken = c.req.header('X-Telegram-Bot-Api-Secret-Token');

        // Verify Telegram signature
        if (secretToken !== c.env.TELEGRAM_SECRET_TOKEN) {
            return c.json({ error: 'Invalid secret token' }, 401);
        }

        const update = await c.req.json();

        // Forward to Telegram handler
        const response = await handleTelegramWebhook(agentId, update, c.env);

        return c.json(response);
    } catch (error) {
        console.error('Telegram webhook error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// WhatsApp webhook endpoint
app.post('/whatsapp/:agentId', async (c) => {
    try {
        const agentId = c.req.param('agentId');

        // Verify WhatsApp signature
        const signature = c.req.header('X-Hub-Signature-256');
        const body = await c.req.text();

        if (!signature) {
            return c.json({ error: 'Missing signature' }, 401);
        }

        // TODO: Implement signature verification
        // const isValid = verifyWhatsAppSignature(body, signature, c.env.WHATSAPP_APP_SECRET);
        // if (!isValid) {
        //   return c.json({ error: 'Invalid signature' }, 401);
        // }

        const update = JSON.parse(body);

        // Forward to WhatsApp handler
        const response = await handleWhatsAppWebhook(agentId, update, c.env);

        return c.json(response);
    } catch (error) {
        console.error('WhatsApp webhook error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

// Discord webhook endpoint
app.post('/discord/:agentId', async (c) => {
    try {
        const agentId = c.req.param('agentId');
        const update = await c.req.json();

        // Forward to Discord handler
        const response = await handleDiscordWebhook(agentId, update, c.env);

        return c.json(response);
    } catch (error) {
        console.error('Discord webhook error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

export default app;
