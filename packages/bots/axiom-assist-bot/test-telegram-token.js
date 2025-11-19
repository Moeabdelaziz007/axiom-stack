// Telegram bot token test
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables from .env.telegram
dotenv.config({ path: '.env.telegram' });

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

console.log('Testing Telegram bot token...');

// Test the bot token by getting bot info
axios.get(`https://api.telegram.org/bot${token}/getMe`)
  .then(response => {
    console.log('✅ Telegram bot token is valid!');
    console.log('Bot info:', response.data.result);
  })
  .catch(error => {
    console.error('❌ Telegram bot token is invalid or there was an error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  });