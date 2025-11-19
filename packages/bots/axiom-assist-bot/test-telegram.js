// Simple Telegram bot test
import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

// Load environment variables from .env.telegram
dotenv.config({ path: '.env.telegram' });

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  console.log(`New Telegram user: ${ctx.from?.username || ctx.from?.id}`);
  ctx.reply(
    `👋 Hello! I'm Axiom Assist, your AI Developer Advocate for the Axiom ID project.\n\n` +
    `I can help you with:\n` +
    `• Understanding Axiom ID concepts\n` +
    `• Installation and setup\n` +
    `• Code examples and explanations\n` +
    `• Contribution guidelines\n` +
    `• Project roadmap and vision\n\n` +
    `Just send me a message with your question!`
  );
});

bot.help((ctx) => {
  ctx.reply(
    `🤖 Axiom Assist Bot Help\n\n` +
    `Commands:\n` +
    `/start - Start the bot\n` +
    `/help - Show this help message\n\n` +
    `Just ask me anything about Axiom ID and I'll do my best to help!`
  );
});

bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  const userId = ctx.from?.id.toString() || 'unknown';
  
  console.log(`Telegram message from ${userId}: ${message}`);
  
  try {
    // Send typing action
    await ctx.sendChatAction('typing');
    
    // Simple response for testing
    await ctx.reply(`I received your message: "${message}"\n\nI'm the Axiom ID assistant bot. In the full implementation, I would process your query using AI and provide a detailed response.`);
    
    console.log(`Responded to Telegram user ${userId}`);
  } catch (error) {
    console.error('Error processing Telegram message:', error);
    await ctx.reply(
      "Sorry, I encountered an error while processing your question. Please try again later."
    );
  }
});

bot.catch((err, ctx) => {
  console.error(`Telegram Bot Error for ${ctx.updateType}:`, err);
  ctx.reply('Oops! Something went wrong. Please try again later.');
});

// Launch the bot
bot.launch()
  .then(() => {
    console.log('🚀 Telegram Bot started successfully');
    console.log('📍 Bot is now running and waiting for messages...');
  })
  .catch((error) => {
    console.error('❌ Failed to start Telegram Bot:', error);
    process.exit(1);
  });

// Handle graceful shutdown
process.once('SIGINT', () => {
  console.log('\n🛑 Shutting down Telegram Bot...');
  bot.stop('SIGINT');
  console.log('✅ Telegram Bot stopped');
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('\n🛑 Shutting down Telegram Bot...');
  bot.stop('SIGTERM');
  console.log('✅ Telegram Bot stopped');
  process.exit(0);
});