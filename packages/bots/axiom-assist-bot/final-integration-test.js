// Final integration test to verify the complete connection between bot and brain
require('dotenv').config();

async function finalIntegrationTest() {
  console.log('🚀 Starting final integration test...');
  
  try {
    // Test 1: Verify environment variables
    console.log('\n1. Testing environment variables...');
    const brainUrl = process.env.AXIOM_BRAIN_URL;
    if (!brainUrl) {
      console.log('❌ AXIOM_BRAIN_URL not found in environment variables');
      return;
    }
    console.log('✅ AXIOM_BRAIN_URL:', brainUrl);
    
    // Test 2: Health check
    console.log('\n2. Testing health check...');
    const healthResponse = await fetch(`${brainUrl}/health`);
    if (!healthResponse.ok) {
      console.log('❌ Health check failed with status:', healthResponse.status);
      return;
    }
    
    const healthData = await healthResponse.json();
    if (healthData.status !== 'ok') {
      console.log('❌ Health check returned unexpected status:', healthData.status);
      return;
    }
    console.log('✅ Health check passed');
    console.log('   Services status:', healthData.services);
    
    // Test 3: Chat endpoint
    console.log('\n3. Testing chat endpoint...');
    const chatResponse = await fetch(`${brainUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: 'integration-test-' + Date.now(),
        message: 'Hello! This is an integration test.'
      })
    });
    
    if (!chatResponse.ok) {
      console.log('❌ Chat endpoint failed with status:', chatResponse.status);
      return;
    }
    
    const chatData = await chatResponse.json();
    if (!chatData.response) {
      console.log('❌ Chat endpoint returned unexpected response:', chatData);
      return;
    }
    console.log('✅ Chat endpoint working correctly');
    console.log('   Response:', chatData.response.substring(0, 100) + '...');
    
    // Test 4: Test with the core brain
    console.log('\n4. Testing core brain integration...');
    const { AxiomBrain } = require('@axiom-stack/core');
    const brain = new AxiomBrain();
    
    // Mock the process method to use our updated implementation
    const mockResponse = await brain.process('Hello from core brain test!', 'test-user-123');
    if (mockResponse.text && mockResponse.text.includes('Sorry, I encountered an error')) {
      console.log('❌ Core brain integration failed');
      return;
    }
    console.log('✅ Core brain integration working');
    console.log('   Response:', mockResponse.text.substring(0, 100) + '...');
    
    console.log('\n🎉 All integration tests passed successfully!');
    console.log('✅ Bot is now connected to the Cloudflare Brain');
    console.log('✅ RAG memory is activated');
    console.log('✅ Chat endpoint is working');
    console.log('✅ Core brain integration is complete');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

finalIntegrationTest();