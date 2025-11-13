console.log('Hello, Axiom Stack!');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Test environment variables
import 'dotenv/config';
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('PINECONE_API_KEY exists:', !!process.env.PINECONE_API_KEY);
console.log('DISCORD_BOT_TOKEN exists:', !!process.env.DISCORD_BOT_TOKEN);