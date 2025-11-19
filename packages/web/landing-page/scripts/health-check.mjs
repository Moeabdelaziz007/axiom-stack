#!/usr/bin/env node

/**
 * Axiom ID Health Check Script
 * Verifies that the deployed service is working correctly
 */

import fetch from 'node-fetch';

// Allow overriding the base URL via environment variable
const API_BASE_URL = process.env.AXIOM_API_URL || 'https://www.axiomid.app';
const HEALTH_CHECK_TIMEOUT = 15000; // 15 seconds

console.log('🔍 Axiom ID Health Check');
console.log('========================\n');

async function checkApiEndpoint() {
  console.log(`📡 Checking API Endpoint: ${API_BASE_URL}/api/agents`);
  console.log(`⏱️  Timeout set to ${HEALTH_CHECK_TIMEOUT}ms\n`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timeout reached');
      controller.abort();
    }, HEALTH_CHECK_TIMEOUT);
    
    console.log('🔗 Attempting to connect...');
    const response = await fetch(`${API_BASE_URL}/api/agents`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    console.log(`✅ Content-Type: ${contentType}`);
    
    // Check if response is JSON
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response, got ${contentType}`);
    }
    
    const data = await response.json();
    console.log(`✅ Response received with ${Array.isArray(data) ? data.length : 'unknown'} items\n`);
    
    return data;
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server may be unreachable');
    }
    throw new Error(`Connection failed: ${error.message}`);
  }
}

function validateAIXStructure(agents) {
  console.log('📋 Validating AIX Data Structure');
  
  if (!Array.isArray(agents)) {
    throw new Error('Expected array of agents');
  }
  
  if (agents.length === 0) {
    console.log('⚠️  No agents found in response');
    return;
  }
  
  // Check first agent for AIX standard structure
  const agent = agents[0];
  const requiredFields = [
    'id',
    'name',
    'description',
    'status',
    'createdAt',
    'lastActive',
    'capabilities',
    'reputation',
    'loadFactor'
  ];
  
  const missingFields = requiredFields.filter(field => !(field in agent));
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Validate data types
  if (typeof agent.id !== 'string') {
    throw new Error('Agent ID should be a string');
  }
  
  if (typeof agent.name !== 'string') {
    throw new Error('Agent name should be a string');
  }
  
  if (!Array.isArray(agent.capabilities)) {
    throw new Error('Agent capabilities should be an array');
  }
  
  if (typeof agent.reputation !== 'number') {
    throw new Error('Agent reputation should be a number');
  }
  
  if (typeof agent.loadFactor !== 'number') {
    throw new Error('Agent loadFactor should be a number');
  }
  
  console.log('✅ AIX structure validation passed\n');
}

async function checkServerResponse() {
  console.log('⏱️  Checking Server Response Time');
  
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);
    
    await fetch(`${API_BASE_URL}/api/agents`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    const responseTime = Date.now() - startTime;
    console.log(`✅ Response time: ${responseTime}ms\n`);
    
    return responseTime;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

async function runHealthCheck() {
  console.log(`📍 Target URL: ${API_BASE_URL}`);
  
  try {
    // Check API endpoint
    const agentsData = await checkApiEndpoint();
    
    // Validate AIX structure
    validateAIXStructure(agentsData);
    
    // Check server response
    const responseTime = await checkServerResponse();
    
    console.log('🎉 All Health Checks Passed!');
    console.log('==========================');
    console.log('✅ API endpoint is accessible');
    console.log('✅ Data structure matches AIX standard');
    console.log(`✅ Server response time: ${responseTime}ms`);
    console.log('\n🚀 Axiom ID is ready for launch!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Health Check Failed!');
    console.error('======================');
    console.error(error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('  1. Check if the deployment is complete');
    console.log('  2. Verify the domain is correctly configured');
    console.log('  3. Ensure the API service is running');
    console.log('  4. Try setting AXIOM_API_URL environment variable to test a different endpoint');
    console.log('\n📝 Example: AXIOM_API_URL=http://localhost:3000 npm run health-check');
    
    process.exit(1);
  }
}

// Run the health check
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthCheck();
}

export { checkApiEndpoint, validateAIXStructure, checkServerResponse, runHealthCheck };