// model-armor-service.mjs - Model Armor integration for Axiom ID security
import { ModelArmorClient } from '@google-cloud/modelarmor';
import axios from 'axios';

class ModelArmorService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'axiom-id-project';
    this.location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
    this.templateId = process.env.MODEL_ARMOR_TEMPLATE_ID || 'axiom-security-template';
  }

  async initialize() {
    try {
      // Initialize Model Armor client
      this.client = new ModelArmorClient();
      this.isInitialized = true;
      console.log('✅ Model Armor client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Model Armor client:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Sanitize user prompt using Model Armor REST API
   * @param {string} text - User input text to sanitize
   * @returns {Object} - Sanitization result with safety status
   */
  async sanitizeUserPrompt(text) {
    if (!this.isInitialized) {
      throw new Error('Model Armor client not initialized. Call initialize() first.');
    }

    try {
      // Use REST API approach as described in the plan
      const endpoint = `https://modelarmor.${this.location}.rep.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/templates/${this.templateId}:sanitizeUserPrompt`;
      
      // Get access token (in production, use proper authentication)
      const accessToken = await this.getAccessToken();
      
      const data = {
        userPromptData: {
          text: text
        }
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(endpoint, data, config);
      const result = response.data.sanitizationResult;
      
      // Check for attack flags
      if (result.promptInjectionDetected || result.jailbreakDetected) {
        return { safe: false, error: 'Request blocked due to security policy.' };
      }
      
      return { safe: true, sanitizedText: result.sanitizedText || text };
    } catch (error) {
      console.error('Model Armor API Error:', error.response?.data || error.message);
      return { safe: false, error: 'Error processing security check.' };
    }
  }

  /**
   * Sanitize model response using Model Armor REST API
   * @param {string} text - Model response text to sanitize
   * @returns {Object} - Sanitization result with safety status
   */
  async sanitizeModelResponse(text) {
    if (!this.isInitialized) {
      throw new Error('Model Armor client not initialized. Call initialize() first.');
    }

    try {
      // Use REST API approach for model response sanitization
      const endpoint = `https://modelarmor.${this.location}.rep.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/templates/${this.templateId}:sanitizeModelResponse`;
      
      // Get access token (in production, use proper authentication)
      const accessToken = await this.getAccessToken();
      
      const data = {
        modelResponseData: {
          text: text
        }
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(endpoint, data, config);
      const result = response.data.sanitizationResult;
      
      // Check for sensitive data or harmful content
      if (result.containsSensitiveData || result.containsHarmfulContent) {
        return { safe: false, error: 'Response blocked due to security policy.' };
      }
      
      return { safe: true, sanitizedText: result.sanitizedText || text };
    } catch (error) {
      console.error('Model Armor API Error:', error.response?.data || error.message);
      return { safe: false, error: 'Error processing security check.' };
    }
  }

  /**
   * Get access token for authentication
   * In production, this should use proper Google Cloud authentication
   * @returns {string} - Access token
   */
  async getAccessToken() {
    // For now, we'll return a placeholder
    // In production, use Google Auth library to get proper token
    return process.env.GOOGLE_CLOUD_ACCESS_TOKEN || 'placeholder-token';
  }
}

export default ModelArmorService;