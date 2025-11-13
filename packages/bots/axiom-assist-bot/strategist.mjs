// strategist.mjs - Axiom Chief Strategist Engine
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the strategist prompt
const STRATEGIST_PROMPT = fs.readFileSync(path.join(__dirname, 'strategist-prompt.txt'), 'utf-8');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Initialize Pinecone and Embeddings
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.Index('axiom-id-brain');
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
  taskType: "RETRIEVAL_DOCUMENT"
});

async function getHighLevelContext() {
  try {
    // Use Pinecone to get relevant context
    const strategicQueries = [
      "Axiom ID project overview and vision",
      "Axiom ID technical architecture",
      "Axiom ID roadmap and future plans",
      "Axiom ID market positioning and competition"
    ];
    
    let context = '';
    
    for (const query of strategicQueries) {
      try {
        const queryEmbedding = await embeddings.embedQuery(query);
        const queryRequest = {
          vector: queryEmbedding,
          topK: 3,
          includeMetadata: true
        };
        
        const response = await pineconeIndex.query(queryRequest);
        const results = response.matches || [];
        
        if (results && results.length > 0) {
          context += `

---

Context for: ${query}
`;
          results.forEach((match, index) => {
            context += `\n${index + 1}. ${match.metadata?.text?.substring(0, 500)}...\n`;
          });
        }
      } catch (error) {
        console.warn(`Could not query context for "${query}":`, error.message);
      }
    }
    
    return context;
  } catch (error) {
    console.error('Error getting high-level context:', error);
    return '';
  }
}

async function generateStrategicIdeas() {
  try {
    // Get high-level context
    const context = await getHighLevelContext();
    
    // Get current date for the log
    const today = new Date().toISOString().split('T')[0];
    
    // Replace the date placeholder in the prompt
    const prompt = STRATEGIST_PROMPT.replace('YYYY-MM-DD', today) + 
      `

Here is the current context of the Axiom ID project:

${context}`;
    
    console.log('🧠 Axiom Chief Strategist is thinking...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const ideas = response.text();
    
    return ideas;
  } catch (error) {
    console.error('Error generating strategic ideas:', error);
    return "Sorry, I encountered an error while generating strategic ideas.";
  }
}

async function sendToDiscordWebhook(content) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.log('No Discord webhook URL provided. Printing to console instead.');
    console.log(content);
    return;
  }
  
  try {
    // Split content into chunks if it's too long for Discord
    const chunks = content.match(/.{1,1900}/gs) || [content];
    
    for (const chunk of chunks) {
      const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: chunk,
          username: 'Axiom Chief Strategist',
          avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
        }),
      });
      
      if (!response.ok) {
        console.error(`Failed to send to Discord: ${response.status} ${response.statusText}`);
      }
    }
    
    console.log('✅ Strategic ideas sent to Discord webhook');
  } catch (error) {
    console.error('Error sending to Discord webhook:', error);
  }
}

async function appendToLog(content) {
  const logFile = path.join(__dirname, 'STRATEGIST_LOG.md');
  const timestamp = new Date().toISOString();
  
  const logEntry = `

<!-- Generated on ${timestamp} -->
${content}`;
  
  try {
    fs.appendFileSync(logFile, logEntry);
    console.log(`✅ Strategic ideas appended to ${logFile}`);
  } catch (error) {
    console.error('Error appending to log file:', error);
  }
}

async function main() {
  console.log('🚀 Starting Axiom Chief Strategist Engine...');
  
  // Generate strategic ideas
  const ideas = await generateStrategicIdeas();
  
  // Send to Discord webhook if URL is provided
  await sendToDiscordWebhook(ideas);
  
  // Append to local log file
  await appendToLog(ideas);
  
  console.log('🎉 Axiom Chief Strategist Engine completed successfully!');
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateStrategicIdeas, sendToDiscordWebhook, appendToLog };