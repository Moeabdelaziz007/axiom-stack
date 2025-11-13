#!/usr/bin/env node

// check-index.mjs - Check Pinecone index details
import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

async function checkIndex() {
  console.log('Checking Pinecone index details...');
  
  try {
    // Check if API key is provided
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }
    
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // List indexes
    const indexes = await pinecone.listIndexes();
    console.log('Available indexes:', indexes);
    
    // Get details of our index
    const indexName = 'axiom-id-brain';
    const indexDescription = await pinecone.describeIndex(indexName);
    console.log(`Index ${indexName} details:`, indexDescription);
    
  } catch (error) {
    console.error('❌ Error checking index:', error.message);
  }
}

checkIndex();