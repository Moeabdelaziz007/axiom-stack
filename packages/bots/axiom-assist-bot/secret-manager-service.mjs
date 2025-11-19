// secret-manager-service.mjs
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import 'dotenv/config';

const client = new SecretManagerServiceClient();
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'axiom-id-production-12345';

class SecretManagerService {
    async getSecret(secretName) {
        const name = `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`;
        
        try {
            const [version] = await client.accessSecretVersion({ name });
            const payload = version.payload.data.toString('utf8');
            return payload;
        } catch (error) {
            console.error(`ERROR: Could not access secret ${secretName}. Check IAM permissions.`);
            throw new Error(`Secret access failed: ${secretName}`);
        }
    }
    
    // Function to load all necessary secrets into process.env
    async loadSecrets() {
        console.log('🔐 Loading critical secrets from Google Cloud Secret Manager...');
        
        try {
            // This is the core secure loading logic
            process.env.DISCORD_BOT_TOKEN = await this.getSecret('DISCORD_BOT_TOKEN');
            
            // Add more secrets here (e.g., SOLANA_DEPLOY_SEED, API keys)
            process.env.GEMINI_API_KEY = await this.getSecret('GEMINI_API_KEY');
            process.env.PINECONE_API_KEY = await this.getSecret('PINECONE_API_KEY');
            process.env.SOLANA_DEPLOY_SEED = await this.getSecret('SOLANA_DEPLOY_SEED');
            
            console.log('✅ All critical secrets loaded securely.');
        } catch (error) {
            console.error('❌ Failed to load secrets:', error.message);
            throw error;
        }
    }
}

export default SecretManagerService;