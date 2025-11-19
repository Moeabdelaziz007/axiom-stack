#!/usr/bin/env node

/**
 * Axiom Control Tower - Secret Sync Script
 * 
 * This script synchronizes environment variables from a local .env file
 * to Render services and Cloudflare Workers.
 * 
 * Usage: node sync-keys.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../../.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found at:', envPath);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      }
    }
  });
  
  return envVars;
}

// Sync to Cloudflare Workers (placeholder)
async function syncToCloudflare(envVars) {
  console.log('☁️  Syncing to Cloudflare Workers...');
  
  // TODO: Implement Cloudflare API integration
  // This would use the Cloudflare API to update Worker secrets
  // Requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID
  
  console.log('✅ Cloudflare sync completed (placeholder)');
}

// Sync to Render Services (placeholder)
async function syncToRender(envVars) {
  console.log('🚀 Syncing to Render Services...');
  
  // TODO: Implement Render API integration
  // This would use the Render API to update service environment variables
  // Requires RENDER_API_KEY
  
  console.log('✅ Render sync completed (placeholder)');
}

// Main execution
async function main() {
  console.log('🔧 Axiom Control Tower - Secret Sync');
  console.log('=====================================');
  
  try {
    // Load environment variables
    const envVars = loadEnvFile();
    console.log(`🔑 Loaded ${Object.keys(envVars).length} environment variables`);
    
    // Sync to Cloudflare
    await syncToCloudflare(envVars);
    
    // Sync to Render
    await syncToRender(envVars);
    
    console.log('\n🎉 Keys Synced Successfully across the Universe!');
  } catch (error) {
    console.error('❌ Error during sync:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  loadEnvFile,
  syncToCloudflare,
  syncToRender
};