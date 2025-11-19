// verify-security-config.mjs - Script to verify security configuration before beta launch
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function verifySecurityConfiguration() {
  console.log('🔒 Axiom ID Security Configuration Verification');
  console.log('============================================');
  
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    console.log('🔍 Verifying security configuration...\n');
    
    // Check for placeholder values
    const hasDiscordPlaceholder = envContent.includes('your_discord_bot_token_here');
    const hasGoogleCloudPlaceholder = envContent.includes('your_google_cloud_access_token');
    
    let allChecksPassed = true;
    
    // Verify DISCORD_BOT_TOKEN
    if (hasDiscordPlaceholder) {
      console.log('❌ DISCORD_BOT_TOKEN: Placeholder value found - NOT CONFIGURED');
      allChecksPassed = false;
    } else {
      // Check if it looks like a real token
      const discordTokenLine = envContent.split('\n').find(line => line.startsWith('DISCORD_BOT_TOKEN='));
      if (discordTokenLine) {
        const token = discordTokenLine.split('=')[1];
        if (token && token.length > 20 && !token.includes('your_')) {
          console.log('✅ DISCORD_BOT_TOKEN: Configured with valid token format');
        } else {
          console.log('❌ DISCORD_BOT_TOKEN: Token format appears invalid');
          allChecksPassed = false;
        }
      }
    }
    
    // Verify GOOGLE_CLOUD_ACCESS_TOKEN
    if (hasGoogleCloudPlaceholder) {
      console.log('❌ GOOGLE_CLOUD_ACCESS_TOKEN: Placeholder value found - NOT CONFIGURED');
      allChecksPassed = false;
    } else {
      // Check if it looks like a real token or path
      const googleTokenLine = envContent.split('\n').find(line => line.startsWith('GOOGLE_CLOUD_ACCESS_TOKEN='));
      if (googleTokenLine) {
        const token = googleTokenLine.split('=')[1];
        if (token && token.length > 20 && !token.includes('your_')) {
          console.log('✅ GOOGLE_CLOUD_ACCESS_TOKEN: Configured with valid token format');
        } else if (token && (token.endsWith('.json') || token.includes('/'))) {
          console.log('✅ GOOGLE_CLOUD_ACCESS_TOKEN: Configured with service account key path');
        } else {
          console.log('❌ GOOGLE_CLOUD_ACCESS_TOKEN: Token/path format appears invalid');
          allChecksPassed = false;
        }
      }
    }
    
    // Additional security checks
    console.log('\n🔍 Additional Security Checks:');
    console.log('-----------------------------');
    
    // Check for other required environment variables
    const requiredVars = [
      'GEMINI_API_KEY',
      'PINECONE_API_KEY',
      'GOOGLE_CLOUD_PROJECT_ID',
      'GOOGLE_CLOUD_SERVICE_ACCOUNT',
      'AXIOM_PROGRAM_ID'
    ];
    
    for (const varName of requiredVars) {
      if (envContent.includes(`${varName}=`)) {
        const line = envContent.split('\n').find(l => l.startsWith(`${varName}=`));
        if (line) {
          const value = line.split('=')[1];
          if (value && value.length > 10 && !value.includes('your_')) {
            console.log(`✅ ${varName}: Configured`);
          } else if (!value || value.length === 0) {
            console.log(`❌ ${varName}: Empty value`);
            allChecksPassed = false;
          } else {
            console.log(`⚠️  ${varName}: Placeholder value found`);
            allChecksPassed = false;
          }
        }
      } else {
        console.log(`❌ ${varName}: Missing from .env file`);
        allChecksPassed = false;
      }
    }
    
    // Final verification
    console.log('\n📋 Final Verification:');
    console.log('--------------------');
    
    if (allChecksPassed) {
      console.log('🎉 ALL SECURITY CHECKS PASSED!');
      console.log('✅ System is ready for beta launch');
      console.log('\n🚀 Next steps:');
      console.log('1. Deploy monitoring: cd functions && ./deploy.sh');
      console.log('2. Register first agent: npm run agent:register');
      console.log('3. Start orchestrator: npm run orchestrator:start');
      console.log('4. Begin beta testing');
      return true;
    } else {
      console.log('❌ SECURITY CONFIGURATION INCOMPLETE');
      console.log('Please address the issues above before proceeding with the beta launch');
      console.log('\n🔧 Recommended actions:');
      console.log('1. Run node security-config-helper.mjs for detailed instructions');
      console.log('2. Update the .env file with actual credentials');
      console.log('3. Re-run this verification script to confirm');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    console.log('\n📝 Please ensure you have a .env file in the project root directory');
    return false;
  }
}

// Run the verification if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const result = verifySecurityConfiguration();
  process.exit(result ? 0 : 1);
}

export default verifySecurityConfiguration;