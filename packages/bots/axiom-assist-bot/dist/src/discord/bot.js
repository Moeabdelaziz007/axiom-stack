// packages/bots/axiom-assist-bot/src/discord/bot.ts - Discord Bot Interface
import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js';
import { AxiomBrain } from '@axiom-stack/core';
export class DiscordBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });
        this.brain = new AxiomBrain();
        this.setupHandlers();
    }
    setupHandlers() {
        // When the client is ready, run this code (only once)
        this.client.once(Events.ClientReady, readyClient => {
            console.log(`🎉 Ready! Logged in as ${readyClient.user.tag}`);
            console.log(`🤖 Bot is running in ${readyClient.guilds.cache.size} guilds`);
            // Set bot status
            readyClient.user.setActivity('Axiom ID Docs', { type: ActivityType.Reading });
        });
        // Listen for messages
        this.client.on(Events.MessageCreate, async (message) => {
            // Avoid responding to bots (including self)
            if (message.author.bot)
                return;
            // Check if the bot is mentioned or message starts with a command prefix
            const isMentioned = message.mentions.has(this.client.user);
            const isDM = message.channel.type === 1; // Direct message
            const hasCommandPrefix = message.content.startsWith('!axiom');
            // Only respond if mentioned, in DM, or using command prefix
            if (!isMentioned && !isDM && !hasCommandPrefix)
                return;
            // Don't process empty messages
            if (!message.content.trim())
                return;
            await this.processMessage(message, isMentioned, hasCommandPrefix);
        });
        // Handle errors
        this.client.on(Events.Error, error => {
            console.error('Discord client error:', error);
        });
    }
    async processMessage(message, isMentioned, hasCommandPrefix) {
        try {
            // Send typing indicator
            await message.channel.sendTyping();
            // Extract the question (remove bot mention if present)
            let question = message.content;
            if (isMentioned) {
                // Remove the mention from the question
                question = question.replace(/<@!?\d+>/g, '').trim();
            }
            if (hasCommandPrefix) {
                // Remove the command prefix
                question = question.replace(/^!axiom\s*/, '').trim();
            }
            // Handle special commands
            if (question.toLowerCase() === 'help') {
                await message.reply({
                    content: `👋 Hello! I'm Axiom Assist, your AI Developer Advocate for the Axiom ID project.
          
I can help you with:
• Understanding Axiom ID concepts
• Installation and setup
• Code examples and explanations
• Contribution guidelines
• Project roadmap and vision

Just mention me (@AxiomAssist) or use \`!axiom\` followed by your question!

Example: "@AxiomAssist how do I create an agent identity?"`,
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            if (question.toLowerCase() === 'ping') {
                await message.reply({
                    content: '🏓 Pong! I\'m alive and ready to help!',
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
            console.log(`🤖 Question from ${message.author.tag}: ${question}`);
            // Use the core brain to handle the query
            try {
                const response = await this.brain.process(question, message.author.id);
                await message.reply({
                    content: response.text,
                    allowedMentions: { repliedUser: false }
                });
            }
            catch (error) {
                console.error('Error processing with core brain:', error);
                await message.reply({
                    content: "Sorry, I encountered an error while processing your question. Please try again later.",
                    allowedMentions: { repliedUser: false }
                });
            }
            console.log(`✅ Responded to ${message.author.tag}`);
        }
        catch (error) {
            console.error('Error processing message:', error);
            await message.reply({
                content: "Sorry, I encountered an error while processing your question. Please try again later or ask in the #support channel.",
                allowedMentions: { repliedUser: false }
            });
        }
    }
    async login(token) {
        try {
            await this.client.login(token);
            console.log('✅ Discord Bot logged in successfully');
        }
        catch (error) {
            console.error('❌ Failed to login Discord Bot:', error);
            throw error;
        }
    }
    getClient() {
        return this.client;
    }
}
//# sourceMappingURL=bot.js.map