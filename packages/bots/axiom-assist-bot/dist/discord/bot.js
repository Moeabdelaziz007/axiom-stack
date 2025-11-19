"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBot = void 0;
// src/discord/bot.ts - Discord Bot Interface (Refactored for Hexagonal Architecture)
const discord_js_1 = require("discord.js");
const core_1 = require("@axiom-stack/core");
class DiscordBot {
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.MessageContent,
                discord_js_1.GatewayIntentBits.GuildMembers
            ]
        });
        this.brain = new core_1.AxiomBrain();
        this.setupHandlers();
    }
    setupHandlers() {
        // Client Ready Handler
        this.client.once(discord_js_1.Events.ClientReady, (readyClient) => {
            console.log(`🤖 Discord Bot is online as ${readyClient.user?.tag}!`);
            // Set presence with "Reading" activity
            if (readyClient.user) {
                readyClient.user.setActivity('Axiom ID Docs', { type: discord_js_1.ActivityType.Watching });
            }
        });
        // Message Handler
        this.client.on(discord_js_1.Events.MessageCreate, async (message) => {
            // Ignore bot messages and empty messages
            if (message.author.bot || !message.content)
                return;
            // Special commands
            if (message.content === '!ping') {
                await message.reply('Pong! 🏓');
                return;
            }
            if (message.content === '!help') {
                await message.reply('🤖 I am the Axiom ID Assistant. Ask me anything about the project!');
                return;
            }
            try {
                // Show typing indicator
                if (message.channel.type !== discord_js_1.ChannelType.DM) {
                    await message.channel.sendTyping();
                }
                // Process with Core Brain
                const response = await this.brain.process(message.content, message.author.id);
                // Send response
                await message.reply(response.text);
            }
            catch (error) {
                console.error('❌ Error processing Discord message:', error);
                await message.reply('Sorry, I encountered an error while processing your request.');
            }
        });
        // Error Handler
        this.client.on(discord_js_1.Events.Error, (error) => {
            console.error('❌ Discord Client Error:', error);
        });
    }
    async start() {
        const token = process.env.DISCORD_TOKEN;
        if (!token) {
            throw new Error('DISCORD_TOKEN is not set in environment variables');
        }
        await this.client.login(token);
        console.log('🚀 Discord Bot started successfully');
    }
    async stop() {
        await this.client.destroy();
        console.log('🛑 Discord Bot stopped');
    }
}
exports.DiscordBot = DiscordBot;
