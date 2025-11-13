import { Pinecone } from '@pinecone-database/pinecone';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

async function testPinecone() {
  console.log('Testing Pinecone connection...');
  
  if (!process.env.PINECONE_API_KEY) {
    console.error('Missing PINECONE_API_KEY in .env file or environment');
    return;
  }

  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    console.log('Pinecone client created successfully');
    
    // List indexes to verify connection
    console.log('Fetching indexes...');
    const indexes = await pinecone.listIndexes();
    console.log('Pinecone connection successful!');
    console.log('Available indexes:', indexes.indexes ? indexes.indexes.map(idx => idx.name) : 'No indexes found');
    
    console.log('✅ Pinecone test completed successfully!');
    
  } catch (error) {
    console.error('❌ Pinecone connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testPinecone().catch(console.error);