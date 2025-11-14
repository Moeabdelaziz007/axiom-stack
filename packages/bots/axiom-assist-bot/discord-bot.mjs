// discord-bot.mjs
import { Client, GatewayIntentBits, Events, ActivityType } from 'discord.js';
import 'dotenv/config';

// Import the orchestrator
import AxiomOrchestrator from './orchestrator.mjs';

// Create a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ] 
});

// Create a global orchestrator instance
const orchestrator = new AxiomOrchestrator();

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
  console.log(`🎉 Ready! Logged in as ${readyClient.user.tag}`);
  console.log(`🤖 Bot is running in ${readyClient.guilds.cache.size} guilds`);
  
  // Set bot status
  client.user.setActivity('Axiom ID Docs', { type: ActivityType.Reading });
  
  // Initialize the orchestrator
  orchestrator.initialize()
    .then(() => {
      console.log('✅ Axiom Orchestrator connected to Discord bot');
    })
    .catch(error => {
      console.error('❌ Failed to initialize Axiom Orchestrator:', error);
    });
});

// Listen for messages
client.on(Events.MessageCreate, async message => {
  // Avoid responding to bots (including self)
  if (message.author.bot) return;
  
  // Check if the bot is mentioned or message starts with a command prefix
  const isMentioned = message.mentions.has(client.user);
  const isDM = message.channel.type === 1; // Direct message
  const hasCommandPrefix = message.content.startsWith('!axiom');
  
  // Only respond if mentioned, in DM, or using command prefix
  if (!isMentioned && !isDM && !hasCommandPrefix) return;
  
  // Don't process empty messages
  if (!message.content.trim()) return;
  
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
    
    // Use the orchestrator to handle the query
    try {
      const response = await orchestrator.handleUserQuery(question);
      await message.reply({
        content: response,
        allowedMentions: { repliedUser: false }
      });
    } catch (error) {
      console.error('Error processing with orchestrator:', error);
      await message.reply({
        content: "Sorry, I encountered an error while processing your question. Please try again later.",
        allowedMentions: { repliedUser: false }
      });
    }
    
    console.log(`✅ Responded to ${message.author.tag}`);
    
  } catch (error) {
    console.error('Error processing message:', error);
    
    await message.reply({
      content: "Sorry, I encountered an error while processing your question. Please try again later or ask in the #support channel.",
      allowedMentions: { repliedUser: false }
    });
  }
});

// Handle errors
client.on(Events.Error, error => {
  console.error('Discord client error:', error);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);