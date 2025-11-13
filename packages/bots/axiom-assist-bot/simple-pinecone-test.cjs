const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

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
    console.log('Available indexes:', indexes.indexes ? indexes.indexes.map(idx => idx.name) : 'No indexes found');
    
    // Try to access our specific index
    const index = pinecone.Index('axiom-id-brain');
    console.log('Successfully created reference to axiom-id-brain index');
    
    console.log('✅ Pinecone test completed successfully!');
    
  } catch (error) {
    console.error('❌ Pinecone connection failed:', error.message);
    console.error('Error details:', error);
  }
}

testPinecone().catch(console.error);