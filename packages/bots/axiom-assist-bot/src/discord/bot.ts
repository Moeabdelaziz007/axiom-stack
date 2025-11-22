// src/discord/bot.ts - Discord Bot Interface (Refactored for Hexagonal Architecture)
import { Client, GatewayIntentBits, Events, ActivityType, ChannelType, Message } from 'discord.js';
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
    this.client.once(Events.ClientReady, (readyClient: Client<true>) => {
      console.log(`🤖 Discord Bot is online as ${readyClient.user.tag}!`);

      // Set presence with "Reading" activity
      readyClient.user.setActivity('Axiom ID Docs', { type: ActivityType.Watching });
    });

    // Message Handler
    this.client.on(Events.MessageCreate, async (message: Message) => {
      // Ignore bot messages and empty messages
      if (message.author.bot || (!message.content && message.attachments.size === 0)) return;

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
        const imageAttachment = message.attachments.find((att: any) =>
          att.contentType?.startsWith('image/')
        );

        let brainRequest: any = {
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
        const response: any = await this.brain.process(brainRequest);

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
        } else {
          // Standard text response
          await message.reply(response.text);
        }
      } catch (error: any) {
        console.error('❌ Error processing Discord message:', error);
        await message.reply('Sorry, I encountered an error while processing your request.');
      }
    });

    // Error Handler
    this.client.on(Events.Error, (error: Error) => {
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