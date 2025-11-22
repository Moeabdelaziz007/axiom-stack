// Test script to check Vectorize binding
async function testVectorize() {
  try {
    // This would normally be run in the Cloudflare Worker environment
    // For now, we'll just check if we can make a simple request to the worker
    const response = await fetch('https://axiom-brain.amrikyy.workers.dev/health');
    const data = await response.json();
    console.log('Health check response:', data);
    
    if (data.services.vectorize) {
      console.log('✅ Vectorize binding is active');
    } else {
      console.log('❌ Vectorize binding is not active');
    }
  } catch (error) {
    console.error('Error testing Vectorize:', error);
  }
}

testVectorize();