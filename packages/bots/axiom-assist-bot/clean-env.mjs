#!/usr/bin/env node

// clean-env.mjs - Script to clean sensitive values from .env file
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function cleanEnvFile() {
  try {
    console.log('🧹 Cleaning sensitive values from .env file...');
    
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    // List of sensitive environment variables to remove
    const sensitiveVars = [
      'DISCORD_BOT_TOKEN',
      'GEMINI_API_KEY',
      'PINECONE_API_KEY',
      'SOLANA_DEPLOY_SEED',
      'GOOGLE_CLOUD_ACCESS_TOKEN'
    ];
    
    // Split content into lines
    const lines = envContent.split('\n');
    const cleanedLines = [];
    
    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.startsWith('#')) {
        cleanedLines.push(line);
        continue;
      }
      
      // Check if line contains sensitive variable
      let isSensitive = false;
      for (const sensitiveVar of sensitiveVars) {
        if (line.startsWith(`${sensitiveVar}=`)) {
          isSensitive = true;
          break;
        }
      }
      
      if (isSensitive) {
        // Replace sensitive value with placeholder
        const [key] = line.split('=');
        cleanedLines.push(`${key}=***SECRET_STORED_IN_GOOGLE_SECRET_MANAGER***`);
        console.log(`  🔒 Cleaned: ${key}`);
      } else {
        cleanedLines.push(line);
      }
    }
    
    // Write cleaned content back to file
    const cleanedContent = cleanedLines.join('\n');
    writeFileSync(envPath, cleanedContent);
    
    console.log('✅ .env file cleaned successfully!');
    console.log('\n📝 The .env file now contains placeholders for sensitive values.');
    console.log('   Actual values are stored securely in Google Secret Manager.');
    
  } catch (error) {
    console.error('❌ Error cleaning .env file:', error);
    process.exit(1);
  }
}

// Run the cleaner if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanEnvFile();
}

export default cleanEnvFile;