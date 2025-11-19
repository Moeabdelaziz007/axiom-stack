#!/usr/bin/env node

// test-discord-token.mjs - Test script to verify Discord bot token
import 'dotenv/config';

async function testDiscordToken() {
  console.log('Testing Discord bot token...');
  
  try {
    // Check if Discord bot token is provided
    const discordToken = process.env.DISCORD_BOT_TOKEN;
    
    if (!discordToken) {
      throw new Error('DISCORD_BOT_TOKEN is not set in environment variables');
    }
    
    if (discordToken === 'your_discord_bot_token_here') {
      throw new Error('DISCORD_BOT_TOKEN is still set to the placeholder value');
    }
    
    // Check if token looks valid (Discord tokens are typically long strings)
    if (discordToken.length < 20) {
      throw new Error('DISCORD_BOT_TOKEN appears to be too short to be valid');
    }
    
    console.log('✅ Discord bot token appears to be properly configured!');
    console.log('✅ Token length:', discordToken.length);
    console.log('✅ Token format appears valid');
    
  } catch (error) {
    console.error('❌ Error testing Discord token:', error.message);
    console.log('\n🔧 To fix this issue:');
    console.log('1. Go to https://discord.com/developers/applications');
    console.log('2. Create a new application or select an existing one');
    console.log('3. Go to the "Bot" section');
    console.log('4. Click "Reset Token" or "Copy" to get your bot token');
    console.log('5. Update your .env file with the real token');
  }
}

testDiscordToken();