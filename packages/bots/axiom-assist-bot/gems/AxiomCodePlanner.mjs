// gems/AxiomCodePlanner.mjs - Gem specialized for planning code implementations
import BaseGem from './BaseGem.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AxiomCodePlanner extends BaseGem {
  constructor() {
    super("AxiomCodePlanner", "gemini-2.5-flash-preview-05-20");
    this.skill = "skill_write_plan";
    this.promptTemplate = this.loadPrompt(path.join(__dirname, '../prompts/gem_code_planner.txt'));
  }

  /**
   * Process a code planning request
   * @param {string} input - User input containing requirements or goals
   * @returns {Promise<string>} - Code implementation plan
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
      console.error('Error in AxiomCodePlanner:', error);
      return "Sorry, I encountered an error while creating your code plan. Please try again.";
    }
  }
}

export default AxiomCodePlanner;