#!/usr/bin/env node

// setup-secrets.mjs - Script to set up Google Secret Manager for Axiom ID
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize the client
const client = new SecretManagerServiceClient();

async function setupSecrets() {
  try {
    console.log('🔐 Setting up Google Secret Manager for Axiom ID...');
    
    // Load environment variables from .env file
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    
    // Parse environment variables
    const envVars = {};
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim();
        }
      }
    }
    
    // Project ID from environment or default
    const projectId = envVars.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID || 'axiom-id-project';
    const parent = `projects/${projectId}`;
    
    // List of secrets to create
    const secrets = [
      {
        name: 'discord-bot-token',
        value: envVars.DISCORD_BOT_TOKEN,
        description: 'Discord bot authentication token'
      },
      {
        name: 'gemini-api-key',
        value: envVars.GEMINI_API_KEY,
        description: 'Google Gemini API key'
      },
      {
        name: 'pinecone-api-key',
        value: envVars.PINECONE_API_KEY,
        description: 'Pinecone vector database API key'
      },
      {
        name: 'solana-deploy-seed',
        value: envVars.SOLANA_DEPLOY_SEED,
        description: 'Solana wallet seed phrase for deployments'
      },
      {
        name: 'solana-wallet-keypair',
        value: envVars.SOLANA_WALLET_PATH ? readFileSync(envVars.SOLANA_WALLET_PATH, 'utf8') : null,
        description: 'Solana wallet keypair JSON'
      }
    ];
    
    console.log(`🔧 Setting up secrets in project: ${projectId}`);
    
    // Create secrets
    for (const secret of secrets) {
      if (!secret.value) {
        console.warn(`⚠️  Skipping ${secret.name} - no value provided`);
        continue;
      }
      
      try {
        // Check if secret already exists
        const [existing] = await client.getSecret({
          name: `${parent}/secrets/${secret.name}`
        }).catch(() => [null]);
        
        if (existing) {
          console.log(`✅ Secret ${secret.name} already exists`);
          // Add new version
          const [version] = await client.addSecretVersion({
            parent: `${parent}/secrets/${secret.name}`,
            payload: {
              data: Buffer.from(secret.value, 'utf8')
            }
          });
          console.log(`🆕 Added new version for ${secret.name}: ${version.name}`);
        } else {
          // Create new secret
          const [newSecret] = await client.createSecret({
            parent: parent,
            secretId: secret.name,
            secret: {
              replication: {
                automatic: {}
              },
              labels: {
                'axiom-id': 'true',
                'environment': 'production'
              }
            }
          });
          
          // Add first version
          const [version] = await client.addSecretVersion({
            parent: newSecret.name,
            payload: {
              data: Buffer.from(secret.value, 'utf8')
            }
          });
          
          console.log(`✅ Created secret ${secret.name}: ${version.name}`);
        }
      } catch (error) {
        console.error(`❌ Error setting up secret ${secret.name}:`, error.message);
      }
    }
    
    console.log('🎉 Secret setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your code to read secrets from Google Secret Manager');
    console.log('2. Remove sensitive values from .env file');
    console.log('3. Grant appropriate IAM permissions to your service accounts');
    
  } catch (error) {
    console.error('❌ Error setting up secrets:', error);
    process.exit(1);
  }
}

// Grant IAM permissions to service account
async function grantSecretAccess(projectId, serviceAccountEmail) {
  try {
    console.log(`🔐 Granting secret access to ${serviceAccountEmail}...`);
    
    // This would typically be done via gcloud command or Terraform
    console.log('Run the following gcloud command to grant access:');
    console.log(`gcloud projects add-iam-policy-binding ${projectId} \\`);
    console.log(`  --member="serviceAccount:${serviceAccountEmail}" \\`);
    console.log('  --role="roles/secretmanager.secretAccessor"');
    
  } catch (error) {
    console.error('❌ Error granting secret access:', error);
  }
}

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSecrets().catch(console.error);
}

export { setupSecrets, grantSecretAccess };