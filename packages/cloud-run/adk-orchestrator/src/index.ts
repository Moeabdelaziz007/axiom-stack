import express from 'express';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { getHotState, setHotState } from '../../shared/redis/redis-client';
import { searchKnowledge } from '../../shared/vertex/vertex-client';

dotenv.config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'adk-orchestrator' });
});

// ADK orchestration endpoint
app.post('/run', asyncHandler(async (req, res) => {
    const { sessionId, message, agentConfig } = req.body;

    // TODO: Initialize Google ADK session
    // const session = await adk.createSession(sessionId);

    // Check Redis for hot state (recent conversation)
    const cachedState = await getHotState(`session:${sessionId}`);

    if (cachedState) {
        console.log(`[ADK] Found cached state for session ${sessionId}`);
    }

    // TODO: Query Vertex AI for long-term knowledge if needed
    // const knowledge = await searchKnowledge(message);

    // TODO: Process message through ADK
    // const response = await session.run(message, agentConfig);

    // Cache new state in Redis
    await setHotState(`session:${sessionId}`, JSON.stringify({
        lastMessage: message,
        timestamp: Date.now()
    }), 3600);

    res.json({
        sessionId,
        response: 'ADK orchestrator placeholder - integration pending',
        timestamp: Date.now()
    });
}));

// Server-Sent Events endpoint for streaming responses
app.get('/run_sse', asyncHandler(async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // TODO: Implement SSE streaming from ADK
    res.write('data: {"status": "connected"}\n\n');

    // Keep connection alive
    const keepAlive = setInterval(() => {
        res.write('data: {"type": "ping"}\n\n');
    }, 30000);

    req.on('close', () => {
        clearInterval(keepAlive);
    });
}));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`[ADK Orchestrator] Running on port ${PORT}`);
    console.log(`[ADK Orchestrator] Google Cloud Project: ${process.env.GOOGLE_CLOUD_PROJECT}`);
});
