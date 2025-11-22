// packages/workers/social-agent/src/publisher.ts
// Publishing Engine - Distributes content across channels

import type { MiningResult } from './miner';

export interface PublishResult {
    channel: string;
    success: boolean;
    id?: string;
    error?: string;
}

export class Publisher {
    constructor(
        private env: {
            TELEGRAM_BOT_TOKEN?: string;
            TELEGRAM_CHAT_ID?: string;
            TWITTER_API_KEY?: string;
            TWITTER_API_SECRET?: string;
            TWITTER_ACCESS_TOKEN?: string;
            TWITTER_ACCESS_SECRET?: string;
            DISCORD_WEBHOOK_URL?: string;
            PAGE_ACCESS_TOKEN?: string;
        },
        private axiomBrainUrl?: string
    ) { }

    /**
     * Generates engaging caption using Axiom Brain
     */
    private async generateCaption(miningResult: MiningResult): Promise<string> {
        if (!this.axiomBrainUrl) {
            return this.getFallbackCaption(miningResult);
        }

        try {
            const prompt = this.buildPrompt(miningResult);

            const response = await fetch(`${this.axiomBrainUrl}/generate-content`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                return this.getFallbackCaption(miningResult);
            }

            const data = await response.json();
            return data.content || this.getFallbackCaption(miningResult);
        } catch (error) {
            console.error('Error generating caption:', error);
            return this.getFallbackCaption(miningResult);
        }
    }

    /**
     * Builds LLM prompt based on pillar type
     */
    private buildPrompt(result: MiningResult): string {
        switch (result.type) {
            case 'wins':
                return `Create a short, exciting social media post about this trading win: ${JSON.stringify(result.data)}. Format: Emoji + 1 sentence + metrics. Max 280 chars.`;

            case 'tech':
                return `Explain this technical update for non-technical audience: "${result.data.message}". Keep it simple and exciting. Max 280 chars.`;

            case 'vision':
                return `Create a thought-provoking tweet about: "${result.data.content}". Make it philosophical yet accessible. Max 280 chars.`;

            default:
                return `Create an engaging social media post about: ${result.title}`;
        }
    }

    /**
     * Fallback captions when Brain is unavailable
     */
    private getFallbackCaption(result: MiningResult): string {
        switch (result.type) {
            case 'wins':
                return `🚀 Market Victory! Closed ${result.data.token_symbol} position with +${result.data.profit_pct}% profit. #crypto #trading`;

            case 'tech':
                return `🛠️ The Build: ${result.title}\n\nCore upgrade deployed. The future is being written in code. #tech #blockchain`;

            case 'vision':
                return `🔮 Vision: ${result.title}\n\n${result.data.content.substring(0, 200)}... #future #AI`;

            default:
                return `Axiom ID Update: ${result.title}`;
        }
    }

    /**
   * Publishes to Telegram (supports text and video)
   */
    async publishToTelegram(content: string, videoUrl?: string): Promise<PublishResult> {
        if (!this.env.TELEGRAM_BOT_TOKEN || !this.env.TELEGRAM_CHAT_ID) {
            return { channel: 'telegram', success: false, error: 'Missing credentials' };
        }

        try {
            const baseUrl = `https://api.telegram.org/bot${this.env.TELEGRAM_BOT_TOKEN}`;

            let response: Response;

            if (videoUrl) {
                // Send video with caption
                response = await fetch(`${baseUrl}/sendVideo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: this.env.TELEGRAM_CHAT_ID,
                        video: videoUrl,
                        caption: content,
                        parse_mode: 'Markdown'
                    })
                });
            } else {
                // Send text message
                response = await fetch(`${baseUrl}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: this.env.TELEGRAM_CHAT_ID,
                        text: content,
                        parse_mode: 'Markdown'
                    })
                });
            }

            const data = await response.json();

            if (!data.ok) {
                return { channel: 'telegram', success: false, error: data.description };
            }

            return { channel: 'telegram', success: true, id: data.result.message_id };
        } catch (error: any) {
            return { channel: 'telegram', success: false, error: error.message };
        }
    }

    /**
     * Publishes to Discord via Webhook
     */
    async publishToDiscord(content: string): Promise<PublishResult> {
        if (!this.env.DISCORD_WEBHOOK_URL) {
            return { channel: 'discord', success: false, error: 'Missing webhook URL' };
        }

        try {
            const response = await fetch(this.env.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                return { channel: 'discord', success: false, error: `HTTP ${response.status}` };
            }

            return { channel: 'discord', success: true };
        } catch (error: any) {
            return { channel: 'discord', success: false, error: error.message };
        }
    }

    /**
     * Publishes to Twitter (X)
     * Note: Twitter API v2 requires OAuth 1.0a, which is complex in Workers
     * This is a simplified version - production would need proper OAuth library
     */
    async publishToTwitter(content: string): Promise<PublishResult> {
        // Twitter integration requires OAuth 1.0a signature
        // For now, return placeholder - implement with proper library in production
        console.log('[Twitter] Would post:', content);
        return {
            channel: 'twitter',
            success: false,
            error: 'Twitter integration pending OAuth implementation'
        };
    }

    /**
     * Publishes to Facebook (existing)
     */
    async publishToFacebook(content: string): Promise<PublishResult> {
        if (!this.env.PAGE_ACCESS_TOKEN) {
            return { channel: 'facebook', success: false, error: 'Missing access token' };
        }

        try {
            const response = await fetch(
                'https://graph.facebook.com/v19.0/me/feed',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        message: content,
                        access_token: this.env.PAGE_ACCESS_TOKEN
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return { channel: 'facebook', success: false, error: data.error?.message };
            }

            return { channel: 'facebook', success: true, id: data.id };
        } catch (error: any) {
            return { channel: 'facebook', success: false, error: error.message };
        }
    }

    /**
     * Publishes to all configured channels
     */
    async publishAll(miningResult: MiningResult): Promise<PublishResult[]> {
        const caption = await this.generateCaption(miningResult);

        console.log(`📤 Publishing: "${caption}"`);

        const results = await Promise.all([
            this.publishToTelegram(caption),
            this.publishToDiscord(caption),
            this.publishToFacebook(caption),
            // this.publishToTwitter(caption), // Uncomment when OAuth implemented
        ]);

        return results;
    }
}
