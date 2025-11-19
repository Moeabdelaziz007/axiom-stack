// secret-loader.mjs - Module to load secrets from Google Secret Manager at runtime
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

class SecretLoader {
  constructor() {
    this.client = new SecretManagerServiceClient();
    this.secrets = new Map();
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'axiom-id-project';
  }

  /**
   * Load a secret from Google Secret Manager
   * @param {string} secretName - Name of the secret to load
   * @returns {Promise<string>} The secret value
   */
  async loadSecret(secretName) {
    try {
      // Check if we have the secret cached
      if (this.secrets.has(secretName)) {
        return this.secrets.get(secretName);
      }

      // Build the resource name
      const name = `projects/${this.projectId}/secrets/${secretName}/versions/latest`;
      
      // Access the secret
      const [version] = await this.client.accessSecretVersion({
        name: name,
      });
      
      // Extract the payload as UTF-8 string
      const payload = version.payload.data.toString('utf8');
      
      // Cache the secret
      this.secrets.set(secretName, payload);
      
      console.log(`✅ Loaded secret: ${secretName}`);
      return payload;
    } catch (error) {
      console.error(`❌ Error loading secret ${secretName}:`, error.message);
      throw new Error(`Failed to load secret ${secretName}: ${error.message}`);
    }
  }

  /**
   * Load all Axiom ID secrets
   * @returns {Promise<Object>} Object containing all loaded secrets
   */
  async loadAllSecrets() {
    try {
      console.log('🔐 Loading all Axiom ID secrets from Google Secret Manager...');
      
      const secretNames = [
        'discord-bot-token',
        'gemini-api-key',
        'pinecone-api-key',
        'solana-deploy-seed',
        'solana-wallet-keypair'
      ];
      
      const secrets = {};
      
      // Load each secret
      for (const secretName of secretNames) {
        try {
          secrets[secretName] = await this.loadSecret(secretName);
        } catch (error) {
          console.warn(`⚠️  Could not load secret ${secretName}:`, error.message);
          secrets[secretName] = null;
        }
      }
      
      console.log('✅ All secrets loaded successfully');
      return secrets;
    } catch (error) {
      console.error('❌ Error loading all secrets:', error);
      throw error;
    }
  }

  /**
   * Get a secret from cache (non-blocking)
   * @param {string} secretName - Name of the secret to get
   * @returns {string|null} The secret value or null if not found
   */
  getSecret(secretName) {
    return this.secrets.get(secretName) || null;
  }

  /**
   * Clear the secret cache
   * @returns {void}
   */
  clearCache() {
    this.secrets.clear();
    console.log('🧹 Secret cache cleared');
  }
}

// Create a singleton instance
const secretLoader = new SecretLoader();

export default secretLoader;
export { SecretLoader };