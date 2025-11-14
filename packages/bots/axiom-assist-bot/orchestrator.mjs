// orchestrator.mjs - The central nervous system coordinating Human and Body
import HumanMind from './mind/human-mind.mjs';
import SystemBody from './body/system-body.mjs';
import GemManager from './gems/GemManager.mjs';
import 'dotenv/config';

class AxiomOrchestrator {
  constructor() {
    this.humanMind = new HumanMind();
    this.systemBody = new SystemBody();
    this.gemManager = new GemManager();
    this.running = false;
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Axiom Orchestrator...');
      
      // Initialize the System Body
      await this.systemBody.initialize();
      
      // Set initial goals for the Human Mind
      this.humanMind.setGoals([
        "Enhance developer experience with Axiom ID",
        "Expand the Axiom ID ecosystem with new use cases",
        "Improve system reliability and performance",
        "Foster community growth and contributions"
      ]);
      
      console.log('✅ Axiom Orchestrator initialized successfully');
    } catch (error) {
      console.error('Error initializing Axiom Orchestrator:', error);
      throw error;
    }
  }

  async runCycle() {
    try {
      console.log('🔄 Starting orchestration cycle...');
      
      // Get current system status
      const systemStatus = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        // Add more status metrics as needed
      };
      
      // Have the Human Mind think about current situation
      const thoughts = await this.humanMind.think({
        systemStatus,
        currentTime: new Date().toISOString()
      });
      
      console.log('💭 Human Mind Thoughts:');
      console.log(thoughts);
      
      // Based on thoughts, determine actions
      // This is a simplified example - in practice, you'd parse the thoughts
      // and extract actionable items
      
      // Perform routine body functions
      await this.performRoutineTasks();
      
      console.log('✅ Orchestration cycle completed');
    } catch (error) {
      console.error('Error in orchestration cycle:', error);
    }
  }

  async performRoutineTasks() {
    // Example routine tasks
    console.log('⚙️ Performing routine system tasks...');
    
    // In a real implementation, this would call various automated functions
    // on the System Body based on instructions from the Human Mind
  }

  async handleUserQuery(question) {
    try {
      console.log(`💬 Handling user query: ${question}`);
      
      // First, try to route to a specialized Gem
      const gemResponse = await this.gemManager.routeRequest(question);
      
      // If the Gem provides a useful response, return it
      if (gemResponse && !gemResponse.includes('Sorry, I encountered an error')) {
        return gemResponse;
      }
      
      // Fallback to the System Body for general queries
      console.log('🔮 No suitable Gem found, falling back to System Body');
      const response = await this.systemBody.processQuery(question);
      
      return response;
    } catch (error) {
      console.error('Error handling user query:', error);
      throw error;
    }
  }

  start() {
    if (this.running) {
      console.log('Orchestrator is already running');
      return;
    }
    
    this.running = true;
    console.log('▶️ Axiom Orchestrator started');
    
    // Run cycles periodically
    setInterval(async () => {
      await this.runCycle();
    }, 30000); // Run every 30 seconds
  }

  stop() {
    this.running = false;
    console.log('⏹️ Axiom Orchestrator stopped');
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new AxiomOrchestrator();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    orchestrator.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    orchestrator.stop();
    process.exit(0);
  });
  
  // Initialize and start
  orchestrator.initialize()
    .then(() => {
      orchestrator.start();
    })
    .catch(error => {
      console.error('Failed to start orchestrator:', error);
      process.exit(1);
    });
}

export default AxiomOrchestrator;