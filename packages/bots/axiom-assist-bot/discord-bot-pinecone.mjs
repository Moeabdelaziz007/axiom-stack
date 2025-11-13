// هذا السكريبت هو "واجهة المجتمع"
// سيتم تشغيله على Render (الخطة المجانية) بجانب واجهة الويب
// مهمته: الاستماع لـ Discord، البحث في Pinecone، الإجابة بـ Gemini

import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { PromptTemplate } from '@langchain/core/prompts';
import { promises as fs } from 'fs';

// --- Configuration ---
const PINECONE_INDEX_NAME = 'axiom-id-brain';
// ---------------------

// التحقق من المفاتيح
if (!process.env.GEMINI_API_KEY || !process.env.PINECONE_API_KEY || !process.env.DISCORD_BOT_TOKEN) {
  throw new Error('Missing GEMINI_API_KEY, PINECONE_API_KEY, or DISCORD_BOT_TOKEN');
}

// 1. Load Discord Persona Prompt
let discordPromptTemplate = '';
try {
  // سنفترض وجود ملف شخصية لبوت الديسكورد
  // يمكنك استخدام "strategist-prompt.txt" كقاعدة وتعديله
  discordPromptTemplate = await fs.readFile('discord-prompt.txt', 'utf-8'); 
} catch (e) {
  console.warn('Could not load discord-prompt.txt, using default fallback.');
  discordPromptTemplate = `You are a helpful AI assistant for the Axiom ID project. Answer the user's question based on the following context. If the context doesn't have the answer, say you don't know.
Context: {context}
Question: {question}
Answer:`;
}

// 2. Initialize Pinecone, Embeddings, and Retriever
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
  taskType: "RETRIEVAL_DOCUMENT"
});
const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
});
const retriever = vectorStore.asRetriever();

// 3. Initialize Gemini Chat Model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-2.5-flash-preview-09-2025",
  temperature: 0.5, // أكثر دقة للدعم الفني
});

// 4. Create the RAG Chain
const prompt = PromptTemplate.fromTemplate(discordPromptTemplate);
const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

// 5. Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Discord bot logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  // تجاهل رسائل البوتات الأخرى أو إذا لم يتم ذكره
  if (message.author.bot || !message.mentions.has(client.user.id)) {
    return;
  }

  // إزالة المنشن من الرسالة
  const question = message.content.replace(`<@${client.user.id}>`, '').trim();

  if (!question) {
    message.reply('Please ask me a question about Axiom ID.');
    return;
  }

  console.log(`Discord bot received question: ${question}`);
  
  try {
    // إظهار علامة "يفكر..."
    await message.channel.sendTyping();

    // استدعاء السلسلة (Chain)
    const result = await chain.invoke(question);

    // إرسال الرد (مع تقسيم الرسائل الطويلة إذا لزم الأمر)
    if (result.length > 2000) {
      const chunks = result.match(/[\s\S]{1,2000}/g) || [];
      for (const chunk of chunks) {
        message.reply(chunk);
      }
    } else {
      message.reply(result);
    }
  } catch (error) {
    console.error('Error processing Discord message:', error);
    message.reply('Sorry, I encountered an error trying to answer your question.');
  }
});

// 6. Login to Discord
client.login(process.env.DISCORD_BOT_TOKEN);