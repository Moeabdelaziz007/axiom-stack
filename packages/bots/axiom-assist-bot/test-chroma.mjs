// test-chroma.mjs - Test ChromaDB connection
import { ChromaClient } from 'chromadb';
import 'dotenv/config';

async function testChroma() {
  console.log('🧪 Testing ChromaDB connection...');
  
  try {
    // Initialize ChromaDB client
    const chromaClient = new ChromaClient();
    
    // Test connection by getting heartbeat
    const heartbeat = await chromaClient.heartbeat();
    console.log(`✅ ChromaDB connected successfully! Heartbeat: ${heartbeat}`);
    
    // List collections
    const collections = await chromaClient.listCollections();
    console.log(`📚 Collections: ${collections.length}`);
    
    for (const collection of collections) {
      console.log(`  - ${collection.name}`);
    }
    
    console.log('\n🎉 ChromaDB test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error connecting to ChromaDB:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure ChromaDB is running (docker run -p 8000:8000 chromadb/chroma:latest)');
    console.log('2. Check if the CHROMA_SERVER_HOST and CHROMA_SERVER_PORT are correctly set in .env');
    console.log('3. Verify network connectivity to the ChromaDB server');
  }
}

testChroma();// test-chroma.mjs - Test ChromaDB connection
import { ChromaClient } from 'chromadb';
import 'dotenv/config';

async function testChroma() {
  console.log('🧪 Testing ChromaDB connection...');
  
  try {
    // Initialize ChromaDB client
    const chromaClient = new ChromaClient();
    
    // Test connection by getting heartbeat
    const heartbeat = await chromaClient.heartbeat();
    console.log(`✅ ChromaDB connected successfully! Heartbeat: ${heartbeat}`);
    
    // List collections
    const collections = await chromaClient.listCollections();
    console.log(`📚 Collections: ${collections.length}`);
    
    for (const collection of collections) {
      console.log(`  - ${collection.name}`);
    }
    
    console.log('\n🎉 ChromaDB test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error connecting to ChromaDB:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure ChromaDB is running (docker run -p 8000:8000 chromadb/chroma:latest)');
    console.log('2. Check if the CHROMA_SERVER_HOST and CHROMA_SERVER_PORT are correctly set in .env');
    console.log('3. Verify network connectivity to the ChromaDB server');
  }
}

testChroma();