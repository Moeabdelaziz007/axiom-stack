// update-env.mjs - Script to update environment variables
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function updateEnvironmentVariables() {
  console.log('🔄 Axiom ID Environment Variable Updater');
  console.log('=====================================');
  
  try {
    const envPath = join(__dirname, '.env');
    let envContent = readFileSync(envPath, 'utf8');
    
    console.log('Current environment variables with placeholders:');
    console.log('-------------------------------------------');
    
    // Display current placeholder values
    const lines = envContent.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('your_')) {
        console.log(`Line ${index + 1}: ${line}`);
      }
    });
    
    console.log('\n📝 To update the environment variables:');
    console.log('-------------------------------------');
    console.log('1. Edit the .env file directly:');
    console.log('   nano .env');
    console.log('   or');
    console.log('   code .env');
    console.log('\n2. Replace the placeholder values:');
    console.log('   - DISCORD_BOT_TOKEN=your_discord_bot_token_here');
    console.log('   - GOOGLE_CLOUD_ACCESS_TOKEN=your_google_cloud_access_token');
    console.log('\n3. Save the file and exit the editor');
    console.log('\n4. Run the security config helper to verify:');
    console.log('   node security-config-helper.mjs');
    
    console.log('\n💡 Pro Tips:');
    console.log('-----------');
    console.log('- Use a password manager to store and retrieve credentials securely');
    console.log('- Consider using Google Secret Manager for production deployments');
    console.log('- Set up environment-specific .env files (.env.development, .env.production)');
    console.log('- Use dotenv-cli for environment variable management in development');
    
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
  }
}

// Run the updater if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateEnvironmentVariables();
}

export default updateEnvironmentVariables;