// test-pinecone.mjs - Test Pinecone connection
import { Pinecone } from '@pinecone-database/pinecone';
import 'dotenv/config';

async function testPinecone() {
  console.log('🧪 Testing Pinecone connection...');
  
  try {
    // Check if API key is provided
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables');
    }
    
    // Initialize Pinecone client
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    
    // Test connection by listing indexes
    const indexes = await pinecone.listIndexes();
    console.log(`✅ Pinecone connected successfully!`);
    
    if (indexes.indexes && indexes.indexes.length > 0) {
      console.log(`📚 Indexes found: ${indexes.indexes.length}`);
      for (const index of indexes.indexes) {
        console.log(`  - ${index.name} (${index.dimension} dimensions)`);
      }
    } else {
      console.log('📝 No indexes found. The API key is valid but no indexes exist yet.');
    }
    
    console.log('\n🎉 Pinecone test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error connecting to Pinecone:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure PINECONE_API_KEY is correctly set in .env');
    console.log('2. Verify the API key has the correct permissions');
    console.log('3. Check your network connectivity');
  }
}

testPinecone();