// mind/human-mind.mjs - The conscious decision-making layer
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the human mind prompt
const HUMAN_MIND_PROMPT = fs.readFileSync(path.join(__dirname, '../prompts/human-mind.txt'), 'utf-8');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

class HumanMind {
  constructor() {
    this.thoughtProcess = [];
    this.currentStrategy = null;
    this.goals = [];
  }

  async think(externalContext = {}) {
    try {
      // Formulate the thinking prompt
      const prompt = `${HUMAN_MIND_PROMPT}
      
Current Context:
${JSON.stringify(externalContext, null, 2)}

Recent Thought Process:
${this.thoughtProcess.slice(-5).map(t => `- ${t}`).join('\n')}`;

      console.log('🧠 Human Mind is thinking...');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const thoughts = response.text();
      
      // Store the thought
      this.thoughtProcess.push(thoughts);
      
      return thoughts;
    } catch (error) {
      console.error('Error in human thinking process:', error);
      return "Error in thinking process";
    }
  }

  async makeDecision(options) {
    try {
      const decisionPrompt = `As the conscious mind of the Axiom ID system, evaluate these options and make a decision:

Options:
${options.map((opt, i) => `${i+1}. ${opt}`).join('\n')}

Consider:
1. Long-term impact on the Axiom ID ecosystem
2. Alignment with core values and vision
3. Resource requirements
4. Risk assessment

Provide your decision with explanation:`;

      const result = await model.generateContent(decisionPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error in decision making:', error);
      return "Error in decision making process";
    }
  }

  setGoals(goals) {
    this.goals = goals;
  }

  getGoals() {
    return this.goals;
  }
}

export default HumanMind;