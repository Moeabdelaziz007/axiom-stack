// demo-gems.mjs - Demonstration of the Gems system
import GemManager from './gems/GemManager.mjs';
import 'dotenv/config';

async function demoGems() {
  console.log('🔮 Axiom ID Gems System Demonstration\n');
  console.log('=====================================\n');
  
  try {
    // Initialize Gem Manager
    const gemManager = new GemManager();
    
    // Show available Gems
    console.log('Available Gems in the Axiom ID System:');
    const gems = gemManager.listGems();
    gems.forEach((gem, index) => {
      console.log(`${index + 1}. ${gem}`);
    });
    console.log('');
    
    // Demonstrate AxiomRustDebugger
    console.log('💎 Gem 1: AxiomRustDebugger');
    console.log('   Specialized for debugging Rust code in the Axiom ID ecosystem');
    console.log('   Skills: skill_debug_rust\n');
    
    // Demonstrate AxiomCodePlanner
    console.log('💎 Gem 2: AxiomCodePlanner');
    console.log('   Specialized for planning code implementations in the Axiom ID ecosystem');
    console.log('   Skills: skill_write_plan\n');
    
    console.log('🔮 How the Gems System Works:');
    console.log('1. User queries are automatically routed to the most appropriate Gem');
    console.log('2. Each Gem has specialized knowledge and capabilities');
    console.log('3. Gems maintain conversation history for context');
    console.log('4. If no Gem is suitable, the system falls back to the general System Body\n');
    
    console.log('🎯 Example Use Cases:');
    console.log('- "I\'m getting a borrow checker error in my Rust code" → Routed to AxiomRustDebugger');
    console.log('- "I need to implement a new feature for attestation templates" → Routed to AxiomCodePlanner');
    console.log('- "How does the Axiom ID reputation system work?" → Routed to System Body\n');
    
    console.log('✅ The Gems system provides a Google-like architecture where:');
    console.log('- The Orchestrator acts like Google Workspace Flow (central coordination)');
    console.log('- Each Gem acts like a Google Gem (specialized AI assistant)');
    console.log('- The System Body acts like Google Actions (general processing layer)\n');
    
    console.log('🚀 This implementation aligns with Google\'s official architecture pattern!');
  } catch (error) {
    console.error('❌ Error during Gems demonstration:', error);
  }
}

// Run the demonstration
demoGems();