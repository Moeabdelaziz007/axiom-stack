import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

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
    
    // List indexes to verify connection
    const indexes = await pinecone.listIndexes();
    console.log('Pinecone connection successful!');
    console.log('Available indexes:', indexes);
    
    // Try to access our specific index
    const index = pinecone.Index('axiom-id-brain');
    console.log('Successfully accessed axiom-id-brain index');
    
  } catch (error) {
    console.error('Pinecone connection failed:', error.message);
  }
}

testPinecone().catch(console.error);