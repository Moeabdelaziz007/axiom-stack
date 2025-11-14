// gems/GemManager.mjs - Manager for coordinating different Gems
import AxiomRustDebugger from './AxiomRustDebugger.mjs';
import AxiomCodePlanner from './AxiomCodePlanner.mjs';

class GemManager {
  constructor() {
    this.gems = new Map();
    this.initializeGems();
  }

  /**
   * Initialize all available Gems
   */
  initializeGems() {
    // Register our specialized Gems
    this.gems.set('AxiomRustDebugger', new AxiomRustDebugger());
    this.gems.set('AxiomCodePlanner', new AxiomCodePlanner());
    
    console.log('✅ Gem Manager initialized with', this.gems.size, 'Gems');
  }

  /**
   * Get a specific Gem by name
   * @param {string} gemName - Name of the Gem to retrieve
   * @returns {BaseGem|null} - The requested Gem or null if not found
   */
  getGem(gemName) {
    return this.gems.get(gemName) || null;
  }

  /**
   * List all available Gems
   * @returns {Array} - Array of available Gem names
   */
  listGems() {
    return Array.from(this.gems.keys());
  }

  /**
   * Route a request to the appropriate Gem based on content
   * @param {string} input - User input
   * @returns {Promise<string>} - Response from the appropriate Gem
   */
  async routeRequest(input) {
    // Simple routing logic based on keywords
    if (this.containsKeywords(input, ['rust', 'cargo', 'compile', 'error'])) {
      return await this.processWithGem('AxiomRustDebugger', input);
    } else if (this.containsKeywords(input, ['plan', 'implement', 'code', 'function', 'module'])) {
      return await this.processWithGem('AxiomCodePlanner', input);
    } else {
      // Default to Code Planner for general development questions
      return await this.processWithGem('AxiomCodePlanner', input);
    }
  }

  /**
   * Process input with a specific Gem
   * @param {string} gemName - Name of the Gem to use
   * @param {string} input - User input
   * @returns {Promise<string>} - Response from the Gem
   */
  async processWithGem(gemName, input) {
    const gem = this.getGem(gemName);
    if (!gem) {
      return `Sorry, the Gem "${gemName}" is not available.`;
    }
    
    try {
      console.log(`🔮 Processing with Gem: ${gemName}`);
      return await gem.process(input);
    } catch (error) {
      console.error(`Error processing with Gem ${gemName}:`, error);
      return `Sorry, I encountered an error while processing your request with the ${gemName} Gem.`;
    }
  }

  /**
   * Check if input contains any of the specified keywords
   * @param {string} input - Input text to check
   * @param {Array} keywords - Keywords to look for
   * @returns {boolean} - True if any keyword is found
   */
  containsKeywords(input, keywords) {
    const lowerInput = input.toLowerCase();
    return keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()));
  }
}

export default GemManager;