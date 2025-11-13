#!/usr/bin/env node

// create-index.mjs - Script to create Pinecone index
import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

async function createIndex() {
  console.log('Creating Pinecone index...');
  
  try {
    // Check if API key is provided
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }
    
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // Create the index
    const indexName = 'axiom-id-brain';
    console.log(`Creating index: ${indexName}`);
    
    await pinecone.createIndex({
      name: indexName,
      dimension: 768, // Gemini embedding dimension
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-west-2'
        }
      }
    });
    
    console.log(`✅ Index ${indexName} created successfully!`);
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Index already exists, continuing...');
    } else {
      console.error('❌ Error creating Pinecone index:', error.message);
      process.exit(1);
    }
  }
}

createIndex();