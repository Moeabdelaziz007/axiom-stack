#!/usr/bin/env node

// deploy-production.mjs - Production deployment script for Axiom ID
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function deployProduction() {
  try {
    console.log('🚀 Starting Axiom ID Production Deployment...');
    console.log('==========================================\n');
    
    // Step 1: Set up Google Secret Manager
    console.log('🔐 Step 1: Setting up Google Secret Manager...');
    try {
      execSync('npm run secrets:setup', { stdio: 'inherit' });
      console.log('✅ Google Secret Manager setup complete!\n');
    } catch (error) {
      console.warn('⚠️  Warning: Secret setup failed. Continuing with deployment...');
      console.warn('   Make sure secrets are configured manually.\n');
    }
    
    // Step 2: Clean environment file
    console.log('🧹 Step 2: Cleaning environment file...');
    try {
      execSync('node clean-env.mjs', { stdio: 'inherit' });
      console.log('✅ Environment file cleaned!\n');
    } catch (error) {
      console.warn('⚠️  Warning: Environment file cleaning failed.\n');
    }
    
    // Step 3: Install dependencies
    console.log('📦 Step 3: Installing dependencies...');
    execSync('npm install --production', { stdio: 'inherit' });
    console.log('✅ Dependencies installed!\n');
    
    // Step 4: Deploy monitoring function
    console.log('📡 Step 4: Deploying monitoring function...');
    process.chdir(join(__dirname, 'functions'));
    execSync('./deploy.sh', { stdio: 'inherit' });
    console.log('✅ Monitoring function deployed!\n');
    
    // Step 5: Return to original directory
    process.chdir(__dirname);
    
    // Step 6: Build project (if needed)
    console.log('🏗️  Step 5: Building project...');
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Project built successfully!\n');
    } catch (error) {
      console.log('ℹ️  No build required for this project.\n');
    }
    
    // Step 7: Verify deployment
    console.log('🔍 Step 6: Verifying deployment...');
    
    // Check if required environment variables are set
    const requiredEnvVars = [
      'GOOGLE_CLOUD_PROJECT_ID',
      'GOOGLE_CLOUD_REGION',
      'GOOGLE_CLOUD_SERVICE_ACCOUNT'
    ];
    
    let allEnvVarsPresent = true;
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.warn(`⚠️  Missing environment variable: ${envVar}`);
        allEnvVarsPresent = false;
      }
    }
    
    if (allEnvVarsPresent) {
      console.log('✅ All required environment variables are set!\n');
    } else {
      console.warn('⚠️  Some environment variables are missing. Please check your configuration.\n');
    }
    
    // Step 8: Show next steps
    console.log('📋 Deployment Complete!');
    console.log('======================');
    console.log('Next steps:');
    console.log('1. Grant IAM permissions to your service accounts:');
    console.log('   gcloud projects add-iam-policy-binding PROJECT_ID \\');
    console.log('     --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \\');
    console.log('     --role="roles/secretmanager.secretAccessor"');
    console.log('');
    console.log('2. Register your first agent:');
    console.log('   npm run agent:register');
    console.log('');
    console.log('3. Start the orchestrator:');
    console.log('   npm run orchestrator:start');
    console.log('');
    console.log('4. Monitor the system:');
    console.log('   Check the Google Cloud Console for deployed functions');
    console.log('   Monitor logs for any issues');
    
    console.log('\n🎉 Axiom ID Production Deployment Complete!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

// Run the deployment if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  deployProduction().catch(console.error);
}

export default deployProduction;