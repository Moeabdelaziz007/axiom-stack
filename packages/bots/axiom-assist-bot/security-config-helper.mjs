// security-config-helper.mjs - Helper script to configure security credentials
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function helpConfigureSecurity() {
  console.log('🔐 Axiom ID Security Configuration Helper');
  console.log('========================================');
  
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    console.log('Current security configuration status:');
    console.log('------------------------------------');
    
    // Check for placeholder values
    const hasDiscordPlaceholder = envContent.includes('your_discord_bot_token_here');
    const hasGoogleCloudPlaceholder = envContent.includes('your_google_cloud_access_token');
    
    if (hasDiscordPlaceholder) {
      console.log('❌ DISCORD_BOT_TOKEN: Placeholder value found');
    } else {
      console.log('✅ DISCORD_BOT_TOKEN: Configured');
    }
    
    if (hasGoogleCloudPlaceholder) {
      console.log('❌ GOOGLE_CLOUD_ACCESS_TOKEN: Placeholder value found');
    } else {
      console.log('✅ GOOGLE_CLOUD_ACCESS_TOKEN: Configured');
    }
    
    console.log('\n📝 Instructions to complete security configuration:');
    console.log('--------------------------------------------------');
    
    if (hasDiscordPlaceholder) {
      console.log('1. DISCORD_BOT_TOKEN:');
      console.log('   - Go to Discord Developer Portal (https://discord.com/developers/applications)');
      console.log('   - Select your application or create a new one');
      console.log('   - Go to the "Bot" section');
      console.log('   - Click "Reset Token" and copy the new token');
      console.log('   - Replace "your_discord_bot_token_here" with the actual token');
    }
    
    if (hasGoogleCloudPlaceholder) {
      console.log('\n2. GOOGLE_CLOUD_ACCESS_TOKEN:');
      console.log('   Option A - Service Account Key (Recommended):');
      console.log('   - Go to Google Cloud Console');
      console.log('   - Navigate to IAM & Admin > Service Accounts');
      console.log('   - Select or create a service account with required permissions');
      console.log('   - Create a key and download the JSON file');
      console.log('   - Set GOOGLE_APPLICATION_CREDENTIALS environment variable to point to this file');
      console.log('   - Or replace "your_google_cloud_access_token" with the path to the JSON file');
      console.log('\n   Option B - Access Token:');
      console.log('   - Generate an access token using gcloud CLI:');
      console.log('     gcloud auth application-default print-access-token');
      console.log('   - Replace "your_google_cloud_access_token" with the generated token');
    }
    
    console.log('\n🔧 Manual Configuration Steps:');
    console.log('------------------------------');
    console.log('1. Open the .env file in a text editor:');
    console.log('   nano .env');
    console.log('   or');
    console.log('   code .env');
    console.log('\n2. Replace the placeholder values with your actual credentials');
    console.log('\n3. Save the file and close the editor');
    console.log('\n4. Verify the configuration by running:');
    console.log('   node security-config-helper.mjs');
    
    console.log('\n⚠️  Security Best Practices:');
    console.log('---------------------------');
    console.log('- Never commit actual credentials to version control');
    console.log('- Use environment variables or secret management systems');
    console.log('- Rotate credentials regularly');
    console.log('- Restrict permissions to the minimum required');
    console.log('- Monitor access logs for unauthorized usage');
    
    // Check if configuration is complete
    if (!hasDiscordPlaceholder && !hasGoogleCloudPlaceholder) {
      console.log('\n🎉 Security configuration is complete!');
      console.log('✅ You are ready to proceed with the beta launch');
    } else {
      console.log('\n⏳ Security configuration is incomplete');
      console.log('Please follow the instructions above to complete the setup');
    }
    
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    console.log('\n📝 Please ensure you have a .env file in the project root directory');
  }
}

// Run the helper if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  helpConfigureSecurity();
}

export default helpConfigureSecurity;