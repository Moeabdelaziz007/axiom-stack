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
    this.brain = new AxiomBrain();
    
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
          // These are handled by dedicated handlers
          return;
        }
        
        try {
          console.log(`🤖 Question from Telegram user ${ctx.from.username || userId}: ${messageText}`);
          
          // Process with Core Brain
          const response: BrainResponse = await this.brain.process(messageText, userId);
          
          // Send response
          await ctx.reply(response.text);
          
          console.log(`✅ Responded to Telegram user ${ctx.from.username || userId}`);
        } catch (error) {
          console.error('❌ Error processing Telegram message:', error);
          await ctx.reply('Sorry, I encountered an error while processing your request.');
        }
      }
    });

    // Error handling
    this.bot.catch((err, ctx) => {
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