// packages/workers/webhook-router/src/whatsapp.ts - WhatsApp Webhook Handler
interface Env {
    AGENT_FACTORY: Fetcher;
}

interface WhatsAppUpdate {
    object: string;
    entry: Array<{
        id: string;
        changes: Array<{
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                messages?: Array<{
                    from: string;
                    id: string;
                    timestamp: string;
                    type: 'text' | 'image' | 'audio';
                    text?: {
                        body: string;
                    };
                    image?: {
                        id: string;
                        mime_type: string;
                    };
                    audio?: {
                        id: string;
                        mime_type: string;
                    };
                }>;
            };
            field: string;
        }>;
    }>;
}

export async function handleWhatsAppWebhook(
    agentId: string,
    update: WhatsAppUpdate,
    env: Env
): Promise<any> {
    console.log(`WhatsApp webhook for agent ${agentId}:`, update);

    // Extract message data
    if (!update.entry || update.entry.length === 0) {
        return { ok: true }; // Ignore empty updates
    }

    const entry = update.entry[0];
    const changes = entry.changes[0];
    const messages = changes.value.messages;

    if (!messages || messages.length === 0) {
        return { ok: true }; // Ignore non-message updates
    }

    const message = messages[0];

    // Prepare message payload
    const payload: any = {
        agentId,
        source: 'whatsapp',
        userId: message.from,
        messageId: message.id,
        timestamp: message.timestamp,
    };

    // Handle different message types
    if (message.type === 'text' && message.text) {
        payload.type = 'text';
        payload.content = message.text.body;
    } else if (message.type === 'image' && message.image) {
        payload.type = 'image';
        payload.mediaId = message.image.id;
        payload.mimeType = message.image.mime_type;
    } else if (message.type === 'audio' && message.audio) {
        payload.type = 'audio';
        payload.mediaId = message.audio.id;
        payload.mimeType = message.audio.mime_type;
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
