#!/usr/bin/env node

// debug-embeddings.mjs - Debug script to check embedding dimensions
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import 'dotenv/config';

async function debugEmbeddings() {
  console.log('Debugging embeddings...');
  
  try {
    // Check if API key is provided
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    // Initialize Gemini Embeddings with different configurations
    console.log('Testing embedding model "embedding-001"');
    const embeddings1 = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "embedding-001"
    });
    
    const testText = "This is a test document for Axiom ID";
    console.log(`Testing with text: ${testText}`);
    
    const embedding1 = await embeddings1.embedQuery(testText);
    console.log(`Model embedding-001 dimension: ${embedding1.length}`);
    
    // Try with taskType
    console.log('\nTesting embedding model "embedding-001" with taskType');
    const embeddings2 = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "embedding-001",
      taskType: "RETRIEVAL_DOCUMENT"
    });
    
    const embedding2 = await embeddings2.embedQuery(testText);
    console.log(`Model embedding-001 with taskType dimension: ${embedding2.length}`);
    
  } catch (error) {
    console.error('❌ Error debugging embeddings:', error.message);
    // Let's check if it's a quota error
    if (error.message.includes('quota') || error.message.includes('429')) {
      console.log('This is a quota error. You may need to wait for your quota to reset or upgrade your plan.');
    }
  }
}

debugEmbeddings();