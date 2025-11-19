// Test script for Gemini integration
async function testGeminiIntegration() {
  try {
    console.log('Testing Gemini integration...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8787/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    if (healthData.status === 'ok') {
      console.log('✅ Health check passed');
    } else {
      console.log('❌ Health check failed');
      return;
    }
    
    console.log('✅ Gemini integration test completed');
  } catch (error) {
    console.error('❌ Error testing Gemini integration:', error);
  }
}

testGeminiIntegration();