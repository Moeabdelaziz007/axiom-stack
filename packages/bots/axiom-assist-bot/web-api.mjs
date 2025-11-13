🚀 قائمة تدقيق الإطلاق (Axiom $0 Stack)
1. تجميع المفاتيح (Gather the Keys)
أنت الآن بحاجة إلى جمع 4 مفاتيح API أساسية (مفاتيح Gemini معك بالفعل):

PINECONE_API_KEY: اذهب إلى Pinecone.io، أنشئ حساباً مجانياً (Starter Plan)، وأنشئ "Index" (فهرس) واحد. (سمّه axiom-id-brain كما اتفقنا).

DISCORD_BOT_TOKEN: اذهب إلى Discord Developer Portal، أنشئ "New Application"، وأنشئ "Bot"، واحصل على الـ Token.

DISCORD_CLIENT_ID: (ستجده في نفس صفحة البوت)

STRATEGIST_WEBHOOK_URL: في سيرفر Discord الخاص بك، أنشئ قناة خاصة #ai-strategy-log، واذهب إلى الإعدادات (Integrations -> Webhooks) وأنشئ Webhook جديد.

2. إعداد "الأسرار" (Configure Secrets)
الآن يجب أن نضع هذه المفاتيح في الأماكن الصحيحة:

في مستودع GitHub (لـ Actions):

اذهب إلى Settings > Secrets and variables > Actions.

أضف هذه الـ "Secrets":

GEMINI_API_KEY

PINECONE_API_KEY

STRATEGIST_WEBHOOK_URL

في خدمة Render (للبوتات الحية):

اذهب إلى Render.com.

عندما تنشئ الخدمات في الخطوة 4، اذهب إلى Environment.

أضف هذه الـ "Environment Variables":

GEMINI_API_KEY

PINECONE_API_KEY

DISCORD_BOT_TOKEN

3. "التغذية الأولى للدماغ" (The First Brain Ingest)
قبل أن تعمل البوتات، يجب أن يكون "الدماغ" (Pinecone) ممتلئاً.

اذهب إلى مستودع البوت (axiom-assist-bot) على GitHub.

اذهب إلى تبويب "Actions".

على اليسار، ابحث عن Update Axiom Brain (ملف update-brain.yml).

انقر على "Run workflow" يدوياً.

انتظر 5-10 دقائق حتى يكتمل. الآن "الدماغ" جاهز.

4. نشر الخدمات الحية (Deploy Live Services)
الآن اذهب إلى Render لنشر البوتات (ستكون خدمتين مجانيتين):

الخدمة 1: بوت الموقع (Web API):

أنشئ "New Web Service" وقم بربطه بمستودع axiom-assist-bot.

Start Command: npm install && npm run start:web

(تأكد من إضافة متغيرات البيئة من الخطوة 2).

انسخ الرابط الذي سيعطيك إياه Render (مثل: https://axiom-web-api.onrender.com).

الخدمة 2: بوت الديسكورد (Discord Bot):

أنشئ "New Web Service" (نعم، خدمة أخرى مجانية) واربطه بنفس المستودع.

Start Command: npm install && npm run start:discord

(تأكد من إضافة متغيرات البيئة من الخطوة 2).

5. ربط الواجهة الأمامية (Connect the Frontend)
الخطوة الأخيرة:

خذ الرابط الذي نسخته من Render (مثل https://axiom-web-api.onrender.com).

اذهب إلى كود الواجهة الأمامية لموقعك (axiom_id project).

افتح ملف ChatWidget.tsx.

ابحث عن const API_URL = 'http://localhost:3001/api/chat' (أو ما شابه).

قم بتغييره إلى الرابط الحقيقي: const API_URL = 'https://axiom-web-api.onrender.com/api/chat'.

قم بإعادة نشر (re-deploy) موقعك.

بمجرد الانتهاء من هذه الخطوات الخمس، يصبح "النظام البيئي الآلي" بالكامل حياً وجاهزاً لاستقبال الزوار والمطورين.

هل أنت مستعد للبدء في تجميع هذه المفاتيح؟// هذا السكريبت هو "واجهة الويب"
// سيتم تشغيله على Render (الخطة المجانية)
// مهمته: استقبال الأسئلة من axiomid.app، البحث في Pinecone، الإجابة بـ Gemini

import express from 'express';
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
const PORT = process.env.PORT || 3001;
// ---------------------

// التحقق من المفاتيح
if (!process.env.GEMINI_API_KEY || !process.env.PINECONE_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY or PINECONE_API_KEY in environment');
}

const app = express();
app.use(express.json());

// 1. Load Website Persona Prompt
let websitePromptTemplate = '';
try {
  websitePromptTemplate = await fs.readFile('website-prompt.txt', 'utf-8');
} catch (e) {
  console.error('Failed to load website-prompt.txt', e);
  process.exit(1);
}

// 2. Initialize Pinecone & Embeddings
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "embedding-001",
  taskType: "RETRIEVAL_DOCUMENT"
});

// 3. Initialize Pinecone as Retriever
const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
});
const retriever = vectorStore.asRetriever();

// 4. Initialize Gemini Chat Model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-2.5-flash-preview-09-2025",
  temperature: 0.7,
});

// 5. Create the RAG Chain (Retrieval-Augmented Generation)
const prompt = PromptTemplate.fromTemplate(websitePromptTemplate);

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

// 6. Create the API Endpoint
app.post('/api/chat', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    console.log(`Received question: ${question}`);
    
    // استخدام السلسلة (Chain) للبحث والرد
    const result = await chain.invoke(question);
    
    console.log(`Sending response: ${result}`);
    res.json({ answer: result });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// 7. Start the server
app.listen(PORT, () => {
  console.log(`Web API server listening on port ${PORT}`);
});