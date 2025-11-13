console.log('Testing module loading...');

try {
  await import('@pinecone-database/pinecone');
  console.log('✅ Pinecone module loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Pinecone module:', error.message);
}

try {
  await import('dotenv');
  console.log('✅ dotenv module loaded successfully');
} catch (error) {
  console.error('❌ Failed to load dotenv module:', error.message);
}

console.log('Module test completed');