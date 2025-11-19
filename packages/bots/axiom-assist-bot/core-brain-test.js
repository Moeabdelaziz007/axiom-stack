// Simple test to verify the core brain integration
require('dotenv').config();
const { AxiomBrain } = require('../../core/dist/brain');

async function testCoreBrain() {
  console.log('Testing Core Brain integration...');
  
  try {
    // Create an instance of AxiomBrain
    const brain = new AxiomBrain();
    
    console.log('Brain initialized with URL:', brain.cloudflareWorkerUrl);
    
    // Test processing a message
    console.log('\nTesting message processing...');
    const startTime = Date.now();
    const response = await brain.process('Hello, Axiom Brain!', 'test-user-123');
    const duration = Date.now() - startTime;
    
    console.log(`Processing time: ${duration}ms`);
    console.log('Response:', JSON.stringify(response, null, 2));
    
    if (response.text && response.text.length > 0) {
      console.log('✅ Core Brain integration working correctly');
    } else {
      console.log('❌ Core Brain integration failed - empty response');
    }
  } catch (error) {
    console.error('❌ Error testing Core Brain:', error);
  }
}

testCoreBrain();