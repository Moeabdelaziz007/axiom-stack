// test-gems-structure.mjs - Test script for Gems structure
import GemManager from './gems/GemManager.mjs';
import AxiomRustDebugger from './gems/AxiomRustDebugger.mjs';
import AxiomCodePlanner from './gems/AxiomCodePlanner.mjs';
import BaseGem from './gems/BaseGem.mjs';

async function testGemsStructure() {
  console.log('🧪 Testing Gems Structure...\n');
  
  try {
    // Test individual Gem instantiation
    console.log('Testing individual Gem instantiation...');
    const rustDebugger = new AxiomRustDebugger();
    const codePlanner = new AxiomCodePlanner();
    const baseGem = new BaseGem('TestGem');
    
    console.log('✅ All Gems instantiated successfully');
    console.log(`- AxiomRustDebugger: ${rustDebugger.name}`);
    console.log(`- AxiomCodePlanner: ${codePlanner.name}`);
    console.log(`- BaseGem: ${baseGem.name}`);
    console.log(`- Rust Debugger model: ${rustDebugger.modelName}`);
    console.log(`- Code Planner model: ${codePlanner.modelName}`);
    console.log(`- Base Gem model: ${baseGem.modelName}`);
    console.log('');
    
    // Test Gem Manager
    console.log('Testing Gem Manager...');
    const gemManager = new GemManager();
    
    console.log('Available Gems:');
    const gems = gemManager.listGems();
    gems.forEach(gem => console.log(`- ${gem}`));
    console.log('');
    
    // Test getting specific Gems
    console.log('Testing Gem retrieval...');
    const retrievedRustDebugger = gemManager.getGem('AxiomRustDebugger');
    const retrievedCodePlanner = gemManager.getGem('AxiomCodePlanner');
    
    if (retrievedRustDebugger && retrievedCodePlanner) {
      console.log('✅ All Gems retrieved successfully');
      console.log(`- Retrieved Rust Debugger: ${retrievedRustDebugger.name}`);
      console.log(`- Retrieved Code Planner: ${retrievedCodePlanner.name}`);
    } else {
      console.log('❌ Failed to retrieve Gems');
    }
    
    // Test keyword detection
    console.log('\nTesting keyword detection...');
    const rustKeywords = ['rust', 'cargo', 'compile', 'error'];
    const planKeywords = ['plan', 'implement', 'code', 'function', 'module'];
    
    console.log('Rust-related keywords:', rustKeywords);
    console.log('Planning-related keywords:', planKeywords);
    
    console.log('\n✅ Gems structure testing completed successfully!');
  } catch (error) {
    console.error('❌ Error during Gems structure testing:', error);
  }
}

// Run the test
testGemsStructure();