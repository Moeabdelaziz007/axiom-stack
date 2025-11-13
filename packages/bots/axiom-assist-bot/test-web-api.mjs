// test-web-api.mjs - Simple test script for the web API
import 'dotenv/config';

async function testWebAPI() {
  try {
    console.log('Testing Axiom ID Web API...');
    
    const response = await fetch('http://localhost:3001/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    console.log('Health check response:', data);
    
    // Test chat endpoint
    console.log('\nTesting chat endpoint...');
    const chatResponse = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'What is Axiom ID?'
      })
    });
    
    const chatData = await chatResponse.json();
    console.log('Chat response:', chatData);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testWebAPI();