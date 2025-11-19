// packages/bots/axiom-assist-bot/src/index.ts - Unified Runner for Discord and Telegram Bots
import { DiscordBot } from './discord/bot';
import { TelegramBot } from './telegram/bot';
import 'dotenv/config';

async function startBots() {
  console.log('🚀 Starting Axiom Assist Bots...');
  
  const bots: Array<{ name: string; start: () => Promise<void>; stop: () => Promise<void> }> = [];
  
  // Start Discord Bot if token is available
  if (process.env.DISCORD_TOKEN) {
    try {
      const discordBot = new DiscordBot();
      await discordBot.start();
      bots.push({
        name: 'Discord',
        start: async () => discordBot.start(),
        stop: async () => discordBot.stop()
      });
      console.log('✅ Discord Bot initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Discord Bot:', error);
    }
  } else {
    console.log('⚠️  DISCORD_TOKEN not found, skipping Discord Bot');
  }
  
  // Start Telegram Bot if token is available
  if (process.env.TELEGRAM_BOT_TOKEN) {
    try {
      const telegramBot = new TelegramBot();
      await telegramBot.start();
      bots.push({
        name: 'Telegram',
        start: async () => telegramBot.start(),
        stop: async () => telegramBot.stop()
      });
      console.log('✅ Telegram Bot initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Telegram Bot:', error);
    }
  } else {
    console.log('⚠️  TELEGRAM_BOT_TOKEN not found, skipping Telegram Bot');
  }
  
  // Handle graceful shutdown
  const shutdown = async () => {
    console.log('\n🛑 Shutting down bots...');
    for (const bot of bots) {
      try {
        await bot.stop();
        console.log(`✅ ${bot.name} Bot stopped`);
      } catch (error) {
        console.error(`❌ Error stopping ${bot.name} Bot:`, error);
      }
    }
    process.exit(0);
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  
  console.log('🤖 Axiom Assist Bots are now running!');
  console.log('Use Ctrl+C to stop the bots');
}

// Start the bots
startBots().catch(error => {
  console.error('❌ Failed to start bots:', error);
  process.exit(1);
});