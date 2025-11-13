#!/usr/bin/env node

// test-pinecone-store.mjs - Test script to verify PineconeStore is working
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from '@langchain/core/documents';
import 'dotenv/config';

async function testPineconeStore() {
  console.log('Testing PineconeStore...');
  
  try {
    // Check if API keys are provided
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }
    
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // Get the index
    const pineconeIndex = pinecone.Index('axiom-id-brain');
    
    // Initialize Gemini Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "embedding-001"
    });
    
    // Test creating PineconeStore with a simple document
    const docs = [
      new Document({
        pageContent: "This is a test document for Axiom ID",
        metadata: { source: "test" }
      })
    ];
    
    console.log('Creating PineconeStore with documents...');
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
    });
    
    console.log('✅ PineconeStore creation successful!');
    
  } catch (error) {
    console.error('❌ Error testing PineconeStore:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

testPineconeStore();