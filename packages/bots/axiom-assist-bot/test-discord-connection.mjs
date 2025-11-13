#!/usr/bin/env node

// test-discord-connection.mjs - Test script to verify Discord bot can connect to Pinecone
import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

async function testDiscordConnection() {
  console.log('Testing Discord bot Pinecone connection...');
  
  try {
    // Check if API key is provided
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }
    
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // Get the index
    const pineconeIndex = pinecone.Index('axiom-id-brain');
    
    // Test a simple query (this won't return any results since we haven't ingested data yet)
    const queryRequest = {
      vector: Array(768).fill(0), // Empty vector with correct dimension
      topK: 1,
      includeMetadata: true
    };
    
    console.log('Testing query to Pinecone index...');
    const response = await pineconeIndex.query(queryRequest);
    console.log('✅ Pinecone query successful!');
    console.log('Response:', response);
    
  } catch (error) {
    console.error('❌ Error testing Discord connection:', error.message);
  }
}

testDiscordConnection();