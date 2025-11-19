// Test script to verify the connection between the bot and the Cloudflare brain
require('dotenv').config();

async function testBrainConnection() {
  try {
    console.log('Testing connection to Cloudflare Brain...');
    
    // Test the brain URL
    const brainUrl = process.env.AXIOM_BRAIN_URL || process.env.CLOUDFLARE_WORKER_URL || 'https://axiom-brain.your-subdomain.workers.dev';
    console.log('Using brain URL:', brainUrl);
    
    // Test health endpoint
    const healthResponse = await fetch(`${brainUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('Health check response:', healthData);
    
    if (healthData.status === 'ok') {
      console.log('✅ Brain health check passed');
    } else {
      console.log('❌ Brain health check failed');
      return;
    }
    
    // Test chat endpoint
    console.log('\nTesting chat endpoint...');
    const startTime = Date.now();
    const chatResponse = await fetch(`${brainUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: 'test123',
        message: 'Hello, Axiom Brain!'
      })
    });
    
    const duration = Date.now() - startTime;
    console.log(`Chat endpoint response time: ${duration}ms`);
    
    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('Chat endpoint response:', JSON.stringify(chatData, null, 2));
      console.log('✅ Brain chat endpoint working correctly');
    } else {
      console.log(`❌ Brain chat endpoint failed with status: ${chatResponse.status}`);
      const errorText = await chatResponse.text();
      console.log('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Error testing brain connection:', error);
  }
}

testBrainConnection();