// packages/workers/webhook-router/src/discord.ts - Discord Webhook Handler
interface Env {
    AGENT_FACTORY: Fetcher;
}

interface DiscordUpdate {
    content?: string;
    embeds?: Array<any>;
    username?: string;
    avatar_url?: string;
}

export async function handleDiscordWebhook(
    agentId: string,
    update: DiscordUpdate,
    env: Env
): Promise<any> {
    console.log(`Discord webhook for agent ${agentId}:`, update);

    // Prepare message payload
    const payload: any = {
        agentId,
        source: 'discord',
        type: 'text',
        content: update.content || '',
        username: update.username,
    };

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
