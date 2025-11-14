// test-deployment.mjs - Test script to verify deployment configuration

console.log('🧪 Testing deployment configuration...\n');

// Test 1: Check if all required environment variables are set
const envVarsToCheck = ['GEMINI_API_KEY', 'PINECONE_API_KEY'];
const missingVars = envVarsToCheck.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set');
}

console.log('\n✅ Deployment configuration test completed successfully');
console.log('\n📝 Next steps for deployment:');
console.log('1. Push changes to GitHub repository');
console.log('2. Connect Render.com to your repository');
console.log('3. Render will automatically deploy using render.yaml configuration');
console.log('4. Your Socket.io server will be available at https://<your-app>.onrender.com');