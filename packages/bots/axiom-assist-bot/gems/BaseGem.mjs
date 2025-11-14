// gems/BaseGem.mjs - Base class for all Gems
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BaseGem {
  constructor(name, modelName = "gemini-2.5-flash-preview-05-20") {
    this.name = name;
    this.modelName = modelName;
    this.interactionHistory = [];
    
    // Initialize Gemini
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: this.modelName });
  }

  /**
   * Load a prompt template from a file
   * @param {string} promptPath - Path to the prompt file
   * @returns {string} - The prompt content
   */
  loadPrompt(promptPath) {
    try {
      return fs.readFileSync(promptPath, 'utf-8');
    } catch (error) {
      console.error(`Error loading prompt from ${promptPath}:`, error);
      return "";
    }
  }

  /**
   * Save interaction to history
   * @param {string} input - User input
   * @param {string} output - Gem output
   */
  saveToHistory(input, output) {
    this.interactionHistory.push({
      timestamp: new Date().toISOString(),
      input,
      output
    });
    
    // Keep only the last 10 interactions to prevent memory bloat
    if (this.interactionHistory.length > 10) {
      this.interactionHistory.shift();
    }
  }

  /**
   * Get recent interaction history
   * @param {number} count - Number of recent interactions to retrieve
   * @returns {Array} - Recent interactions
   */
  getHistory(count = 5) {
    return this.interactionHistory.slice(-count);
  }

  /**
   * Abstract method to be implemented by subclasses
   * @param {string} input - User input
   * @returns {Promise<string>} - Gem response
   */
  async process(input) {
    throw new Error("Process method must be implemented by subclass");
  }

  /**
   * Generate content using the Gemini model with retry logic
   * @param {string} prompt - The prompt to send to the model
   * @param {number} maxRetries - Maximum number of retry attempts
   * @param {number} retryDelay - Delay between retries in milliseconds
   * @returns {Promise<string>} - Model response
   */
  async generateContent(prompt, maxRetries = 3, retryDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for gem ${this.name}:`, error.message);
        
        // If this is the last attempt, don't wait
        if (attempt < maxRetries) {
          console.log(`Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          
          // Exponential backoff for subsequent attempts
          retryDelay *= 2;
        }
      }
    }
    
    console.error(`All ${maxRetries} attempts failed for gem ${this.name}:`, lastError);
    throw lastError;
  }
}

export default BaseGem;