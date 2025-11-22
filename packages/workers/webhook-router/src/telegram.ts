// packages/workers/webhook-router/src/telegram.ts - Telegram Webhook Handler
interface Env {
    AGENT_FACTORY: Fetcher;
}

interface TelegramUpdate {
    update_id: number;
    message?: {
        message_id: number;
        from: {
            id: number;
            first_name: string;
            username?: string;
        };
        chat: {
            id: number;
            type: string;
        };
        text?: string;
        photo?: Array<{
            file_id: string;
            file_size: number;
        }>;
        voice?: {
            file_id: string;
            duration: number;
        };
    };
}

export async function handleTelegramWebhook(
    agentId: string,
    update: TelegramUpdate,
    env: Env
): Promise<any> {
    console.log(`Telegram webhook for agent ${agentId}:`, update);

    // Extract message data
    const message = update.message;
    if (!message) {
        return { ok: true }; // Ignore non-message updates
    }

    // Prepare message payload
    const payload: any = {
        agentId,
        source: 'telegram',
        userId: message.from.id.toString(),
        username: message.from.username || message.from.first_name,
        chatId: message.chat.id.toString(),
    };

    // Handle different message types
    if (message.text) {
        payload.type = 'text';
        payload.content = message.text;
    } else if (message.photo) {
        payload.type = 'photo';
        payload.fileId = message.photo[message.photo.length - 1].file_id;
    } else if (message.voice) {
        payload.type = 'voice';
        payload.fileId = message.voice.file_id;
    }

    // Forward to Agent Factory for routing to Agent DO
    try {
        const response = await env.AGENT_FACTORY.fetch('http://agent-factory/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error('Failed to forward message to Agent Factory');
            return { ok: false, error: 'Failed to process message' };
        }

        return { ok: true };
    } catch (error) {
        console.error('Error forwarding to Agent Factory:', error);
        return { ok: false, error: 'Internal error' };
    }
}
