#!/usr/bin/env node

// test-embeddings.mjs - Test script to verify embeddings are working
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import 'dotenv/config';

async function testEmbeddings() {
  console.log('Testing embeddings...');
  
  try {
    // Check if API key is provided
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    // Initialize Gemini Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "embedding-001"
    });
    
    // Test embedding a simple string
    const testText = "This is a test document for Axiom ID";
    console.log(`Testing with text: ${testText}`);
    
    const embedding = await embeddings.embedQuery(testText);
    console.log(`✅ Embedding successful!`);
    console.log(`Embedding dimension: ${embedding.length}`);
    console.log(`First 5 values: ${embedding.slice(0, 5)}`);
    
  } catch (error) {
    console.error('❌ Error testing embeddings:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testEmbeddings();