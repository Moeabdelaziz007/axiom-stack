// src/telegram/bot.ts - Telegram Bot Interface (Hexagonal Architecture)
import { Telegraf, Context } from 'telegraf';
import { AxiomBrain, BrainResponse } from '@axiom-stack/core';

export class TelegramBot {
  private bot: Telegraf;
  private brain: AxiomBrain;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
    }

    this.bot = new Telegraf(token);
    this.brain = new AxiomBrain('https://axiom-brain.amrikyy.workers.dev');

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Start command
    this.bot.start((ctx: Context) => {
      console.log(`👋 New Telegram user: ${ctx.from?.username || ctx.from?.id}`);
      return ctx.reply('🤖 Welcome to Axiom ID Assistant! Ask me anything about the project.');
    });

    // Help command
    this.bot.help((ctx: Context) => {
      return ctx.reply(`🤖 I am the Axiom ID Assistant. I can help you with:
      
• Understanding Axiom ID concepts
• Installation and setup
• Code examples and explanations
• Contribution guidelines

Just send me a message with your question!`);
    });

    // Handle text messages
    this.bot.on('text', async (ctx: Context) => {
      if (!ctx.message || !ctx.from) return;

      // Type guard for text messages
      if ('text' in ctx.message) {
        const messageText = ctx.message.text;
        const userId = ctx.from.id.toString();

        // Ignore empty messages
        if (!messageText?.trim()) return;

        // Handle special commands
        if (messageText === '/start' || messageText === '/help') {
          return;
        }

        try {
          console.log(`🤖 Question from Telegram user ${ctx.from.username || userId}: ${messageText}`);

          // Process with Core Brain
          // @ts-ignore - Bypass signature check due to workspace issue
          const response: any = await this.brain.process({
            message: messageText,
            userId: userId
          });

          // Send response
          await ctx.reply(response.text);

          console.log(`✅ Responded to Telegram user ${ctx.from.username || userId}`);
        } catch (error) {
          console.error('❌ Error processing Telegram message:', error);
          await ctx.reply('Sorry, I encountered an error while processing your request.');
        }
      }
    });

    // Handle photo messages
    this.bot.on('photo', async (ctx: Context) => {
      if (!ctx.message || !ctx.from) return;

      try {
        // Get the highest resolution photo
        // @ts-ignore - Telegraf types might be slightly off for photo array
        const photos = ctx.message.photo;
        const photo = photos[photos.length - 1];

        // Get file link
        const fileLink = await ctx.telegram.getFileLink(photo.file_id);

        // Download and convert to Base64
        const response = await fetch(fileLink.href);
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        // Get caption or use default message
        // @ts-ignore
        const caption = ctx.message.caption || 'What do you see in this image?';
        const userId = ctx.from.id.toString();

        console.log(`📷 Photo from Telegram user ${ctx.from.username || userId}`);

        // Process with Brain
        // @ts-ignore
        const brainResponse: any = await this.brain.process({
          message: caption,
          userId: userId,
          image: base64
        });

        // Send response
        await ctx.reply(brainResponse.text);

      } catch (error) {
        console.error('❌ Error processing photo:', error);
        await ctx.reply('Sorry, I couldn\'t process that image.');
      }
    });

    // Handle voice messages
    this.bot.on('voice', async (ctx: Context) => {
      if (!ctx.message || !ctx.from) return;

      try {
        // Get voice file
        // @ts-ignore
        const voice = ctx.message.voice;
        const fileLink = await ctx.telegram.getFileLink(voice.file_id);

        // Download audio
        const response = await fetch(fileLink.href);
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');

        const userId = ctx.from.id.toString();
        console.log(`🎤 Voice from Telegram user ${ctx.from.username || userId}`);

        // Send to Brain for transcription + processing
        // @ts-ignore
        const brainResponse: any = await this.brain.process({
          message: 'Transcribe and respond to this voice message',
          userId: userId,
          audio: base64
        });

        await ctx.reply(brainResponse.text);

      } catch (error) {
        console.error('❌ Error processing voice:', error);
        await ctx.reply('Sorry, I couldn\'t process that voice message.');
      }
    });

    // Error handling
    this.bot.catch((err: any, ctx: Context) => {
      console.error(`❌ Telegram Bot Error for ${ctx.updateType}:`, err);
      ctx.reply('Oops! Something went wrong. Please try again later.');
      return Promise.resolve(); // Return void promise to satisfy type
    });
  }

  async start(): Promise<void> {
    await this.bot.launch();
    console.log('🚀 Telegram Bot started successfully');
  }

  async stop(): Promise<void> {
    await this.bot.stop();
    console.log('🛑 Telegram Bot stopped');
  }
}