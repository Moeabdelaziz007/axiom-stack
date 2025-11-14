// body/system-body.mjs - The automatic execution layer
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
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SystemBody {
  constructor() {
    this.pineconeIndexName = 'axiom-id-brain';
    this.initialized = false;
    this.vectorStore = null;
    this.retriever = null;
    this.model = null;
    this.chain = null;
  }

  async initialize() {
    try {
      // Initialize Pinecone & Embeddings
      const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
      const pineconeIndex = pinecone.Index(this.pineconeIndexName);
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "embedding-001",
        taskType: "RETRIEVAL_DOCUMENT"
      });

      // Initialize Pinecone as Retriever
      this.vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
      });
      this.retriever = this.vectorStore.asRetriever();

      // Initialize Gemini Chat Model
      this.model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        modelName: "gemini-2.5-flash-preview-05-20",
        temperature: 0.7,
      });

      // Load prompt template
      const systemPrompt = fs.readFileSync(path.join(__dirname, '../prompts/system-body.txt'), 'utf-8');
      const prompt = PromptTemplate.fromTemplate(systemPrompt);

      // Create the RAG Chain
      this.chain = RunnableSequence.from([
        {
          context: this.retriever.pipe(formatDocumentsAsString),
          question: new RunnablePassthrough(),
        },
        prompt,
        this.model,
        new StringOutputParser(),
      ]);

      this.initialized = true;
      console.log('✅ System Body initialized successfully');
    } catch (error) {
      console.error('Error initializing System Body:', error);
      throw error;
    }
  }

  async processQuery(question) {
    if (!this.initialized) {
      throw new Error('System Body not initialized. Call initialize() first.');
    }

    try {
      console.log(`Processing query: ${question}`);
      
      // Use the chain to search and respond
      const result = await this.chain.invoke(question);
      
      return result;
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }

  async performTask(taskDescription) {
    // Execute automated tasks based on instructions from the Human Mind
    console.log(`Performing automated task: ${taskDescription}`);
    
    // This would contain various automated functions like:
    // - Data ingestion
    // - Index updates
    // - Routine maintenance
    // - Monitoring tasks
    
    return { status: 'completed', task: taskDescription };
  }
}

export default SystemBody;