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
    const chatResponse = await fetch(`${brainUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: 'test123',
        message: 'Hello from the bot test!'
      })
    });
    
    const chatData = await chatResponse.json();
    console.log('Chat response:', chatData);
    
    if (chatData.response) {
      console.log('✅ Chat endpoint working correctly');
    } else {
      console.log('❌ Chat endpoint failed');
    }
    
  } catch (error) {
    console.error('Error testing brain connection:', error);
  }
}

testBrainConnection();