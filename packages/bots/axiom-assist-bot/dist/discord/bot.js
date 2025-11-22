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
        this.brain = new core_1.AxiomBrain('https://axiom-brain.amrikyy.workers.dev');
        this.setupHandlers();
    }
    setupHandlers() {
        // Client Ready Handler
        this.client.once(discord_js_1.Events.ClientReady, (readyClient) => {
            console.log(`🤖 Discord Bot is online as ${readyClient.user.tag}!`);
            // Set presence with "Reading" activity
            readyClient.user.setActivity('Axiom ID Docs', { type: discord_js_1.ActivityType.Watching });
        });
        // Message Handler
        this.client.on(discord_js_1.Events.MessageCreate, async (message) => {
            // Ignore bot messages and empty messages
            if (message.author.bot || (!message.content && message.attachments.size === 0))
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
                if ('sendTyping' in message.channel) {
                    await message.channel.sendTyping();
                }
                // Check for image attachments
                const imageAttachment = message.attachments.find((att) => att.contentType?.startsWith('image/'));
                let brainRequest = {
                    message: message.content || 'What do you see in this image?',
                    userId: message.author.id
                };
                // If image exists, download and encode
                if (imageAttachment) {
                    const response = await fetch(imageAttachment.url);
                    const buffer = await response.arrayBuffer();
                    brainRequest.image = Buffer.from(buffer).toString('base64');
                }
                // Process with Core Brain
                const response = await this.brain.process(brainRequest);
                // Send as rich embed if structured data exists
                if (response.data) {
                    const { EmbedBuilder } = require('discord.js');
                    const embed = new EmbedBuilder()
                        .setColor(0x00F0FF) // Axiom Cyan
                        .setTitle(response.data.title || 'Axiom Brain Response')
                        .setDescription(response.text)
                        .setTimestamp();
                    // Add fields if structured data exists
                    if (response.data.fields) {
                        for (const [key, value] of Object.entries(response.data.fields)) {
                            embed.addFields({ name: key, value: String(value), inline: true });
                        }
                    }
                    await message.reply({ embeds: [embed] });
                }
                else {
                    // Standard text response
                    await message.reply(response.text);
                }
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
