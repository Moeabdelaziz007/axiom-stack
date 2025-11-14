// gems/AxiomRustDebugger.mjs - Gem specialized for debugging Rust code
import BaseGem from './BaseGem.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AxiomRustDebugger extends BaseGem {
  constructor() {
    super("AxiomRustDebugger", "gemini-2.5-flash-preview-05-20");
    this.skill = "skill_debug_rust";
    this.promptTemplate = this.loadPrompt(path.join(__dirname, '../prompts/gem_rust_debugger.txt'));
  }

  /**
   * Process a Rust debugging request
   * @param {string} input - User input containing Rust code or error message
   * @returns {Promise<string>} - Debugging assistance
   */
  async process(input) {
    try {
      // Create the full prompt with context
      const prompt = `${this.promptTemplate}
      
User Input:
${input}

Recent Interaction History:
${this.getHistory().map(h => `Q: ${h.input}\nA: ${h.output}`).join('\n\n')}`;

      // Generate response
      const response = await this.generateContent(prompt);
      
      // Save to history
      this.saveToHistory(input, response);
      
      return response;
    } catch (error) {
      console.error('Error in AxiomRustDebugger:', error);
      return "Sorry, I encountered an error while debugging your Rust code. Please try again.";
    }
  }
}

export default AxiomRustDebugger;