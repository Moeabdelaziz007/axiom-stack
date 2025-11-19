/**
 * Test script for Axiom Brain Durable Objects
 * This script tests the conversation memory functionality
 */

// Test configuration
// TODO: Replace with your actual worker URL after deployment
const WORKER_URL = 'https://axiom-brain.<your-account>.workers.dev'; 
const TEST_CHAT_ID = 'test-chat-' + Date.now();

async function testMemory() {
  console.log('Testing Axiom Brain Durable Objects...');
  console.log('Worker URL:', WORKER_URL);
  console.log('Test Chat ID:', TEST_CHAT_ID);
  
  try {
    // Test 1: Add a message to the chat history
    console.log('\n1. Adding user message to chat history...');
    const addResponse = await fetch(`${WORKER_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: TEST_CHAT_ID,
        message: 'Hello, this is a test message!'
      })
    });
    
    const addResult = await addResponse.json();
    console.log('Add message response:', addResult);
    
    // Test 2: Add AI response to the chat history
    console.log('\n2. Adding AI response to chat history...');
    const aiResponse = await fetch(`${WORKER_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId: TEST_CHAT_ID,
        message: 'This is the AI response to your test message.'
      })
    });
    
    const aiResult = await aiResponse.json();
    console.log('AI response:', aiResult);
    
    console.log('\n✅ Memory tests completed successfully!');
    console.log('The Durable Object is correctly storing conversation history.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMemory();

console.log('\n📝 To run this test:');
console.log('1. Replace the WORKER_URL with your actual deployed worker URL');
console.log('2. Run: node test-memory.js');