import fetch from 'node-fetch';

const API_BASE_URL = process.env.AXIOM_API_URL || 'http://localhost:3000';

console.log('🔍 Simple Axiom ID Health Check');
console.log('==============================');
console.log(`📍 Target URL: ${API_BASE_URL}/api/agents`);

async function checkApiEndpoint() {
  try {
    console.log('\n📡 Checking API Endpoint...');
    const response = await fetch(`${API_BASE_URL}/api/agents`);
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    
    if (response.status === 200) {
      const data = await response.json();
      console.log(`✅ Received ${data.length} agents`);
      console.log('✅ Health check passed!');
      return true;
    } else {
      console.log('❌ Health check failed!');
      return false;
    }
  } catch (error) {
    console.log('❌ Health check failed!');
    console.log(`Error: ${error.message}`);
    return false;
  }
}

checkApiEndpoint();