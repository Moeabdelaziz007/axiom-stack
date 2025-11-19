// src/discord/bot.ts - Discord Bot Interface (Refactored for Hexagonal Architecture)
import { Client, GatewayIntentBits, Events, ActivityType, ChannelType } from 'discord.js';
import { AxiomBrain, BrainResponse } from '@axiom-stack/core';

export class DiscordBot {
  private client: Client;
  private brain: AxiomBrain;

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

  private setupHandlers(): void {
    // Client Ready Handler
    this.client.once(Events.ClientReady, (readyClient) => {
      console.log(`🤖 Discord Bot is online as ${readyClient.user?.tag}!`);
      
      // Set presence with "Reading" activity
      if (readyClient.user) {
        readyClient.user.setActivity('Axiom ID Docs', { type: ActivityType.Watching });
      }
    });

    // Message Handler
    this.client.on(Events.MessageCreate, async (message) => {
      // Ignore bot messages and empty messages
      if (message.author.bot || !message.content) return;
      
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
        if (message.channel.type !== ChannelType.DM) {
          await message.channel.sendTyping();
        }
        
        // Process with Core Brain
        const response: BrainResponse = await this.brain.process(
          message.content, 
          message.author.id
        );
        
        // Send response
        await message.reply(response.text);
      } catch (error) {
        console.error('❌ Error processing Discord message:', error);
        await message.reply('Sorry, I encountered an error while processing your request.');
      }
    });

    // Error Handler
    this.client.on(Events.Error, (error) => {
      console.error('❌ Discord Client Error:', error);
    });
  }

  async start(): Promise<void> {
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('DISCORD_TOKEN is not set in environment variables');
    }
    
    await this.client.login(token);
    console.log('🚀 Discord Bot started successfully');
  }

  async stop(): Promise<void> {
    await this.client.destroy();
    console.log('🛑 Discord Bot stopped');
  }
}