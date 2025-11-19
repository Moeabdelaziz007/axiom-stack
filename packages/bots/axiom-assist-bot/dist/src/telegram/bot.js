// packages/bots/axiom-assist-bot/src/telegram/bot.ts - Telegram Bot Interface
import { Telegraf } from 'telegraf';
import { AxiomBrain } from '@axiom-stack/core';
export class TelegramBot {
    constructor() {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
        }
        this.bot = new Telegraf(token);
        this.brain = new AxiomBrain();
        this.setupHandlers();
    }
    setupHandlers() {
        // Handle start command
        this.bot.start((ctx) => {
            console.log(`🆕 New Telegram user: ${ctx.from?.username || ctx.from?.id}`);
            ctx.reply(`👋 Hello! I'm Axiom Assist, your AI Developer Advocate for the Axiom ID project.\n\n` +
                `I can help you with:\n` +
                `• Understanding Axiom ID concepts\n` +
                `• Installation and setup\n` +
                `• Code examples and explanations\n` +
                `• Contribution guidelines\n` +
                `• Project roadmap and vision\n\n` +
                `Just send me a message with your question!`);
        });
        // Handle help command
        this.bot.help((ctx) => {
            ctx.reply(`🤖 Axiom Assist Bot Help\n\n` +
                `Commands:\n` +
                `/start - Start the bot\n` +
                `/help - Show this help message\n\n` +
                `Just ask me anything about Axiom ID and I'll do my best to help!`);
        });
        // Handle text messages
        this.bot.on('text', async (ctx) => {
            const message = ctx.message.text;
            const userId = ctx.from?.id.toString() || 'unknown';
            console.log(`💬 Telegram message from ${userId}: ${message}`);
            try {
                // Send typing action
                await ctx.sendChatAction('typing');
                // Process with the core brain
                const response = await this.brain.process(message, userId);
                // Send response
                await ctx.reply(response.text);
                console.log(`✅ Responded to Telegram user ${userId}`);
            }
            catch (error) {
                console.error('❌ Error processing Telegram message:', error);
                await ctx.reply("Sorry, I encountered an error while processing your question. Please try again later.");
            }
        });
        // Handle errors
        this.bot.catch((err, ctx) => {
            console.error(`❌ Telegram Bot Error for ${ctx.updateType}:`, err);
            ctx.reply('Oops! Something went wrong. Please try again later.');
        });
    }
    async start() {
        try {
            // Launch the bot
            await this.bot.launch();
            console.log('🚀 Telegram Bot started');
        }
        catch (error) {
            console.error('❌ Failed to start Telegram Bot:', error);
            throw error;
        }
    }
    async stop() {
        try {
            // Stop the bot
            this.bot.stop();
            console.log('⏹️ Telegram Bot stopped');
        }
        catch (error) {
            console.error('❌ Error stopping Telegram Bot:', error);
        }
    }
}
//# sourceMappingURL=bot.js.map