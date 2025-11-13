import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

async function testPineconeConnection() {
  console.log('Testing Pinecone connection...');
  
  try {
    // Initialize Pinecone Client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    console.log('Pinecone client initialized successfully');
    
    // List indexes
    const indexes = await pinecone.listIndexes();
    console.log('Available indexes:', indexes);
    
    // Try to access our index
    const pineconeIndex = pinecone.Index('axiom-id-brain');
    console.log('Successfully accessed axiom-id-brain index');
    
    // Try a simple operation
    const stats = await pineconeIndex.describeIndexStats();
    console.log('Index stats:', stats);
    
    console.log('✅ Pinecone connection test completed successfully!');
  } catch (error) {
    console.error('❌ Pinecone connection test failed:', error.message);
    console.error('Error details:', error);
  }
}

testPineconeConnection();