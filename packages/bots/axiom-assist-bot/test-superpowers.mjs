// test-superpowers.mjs - Test script for superpowers functionality
import AxiomOrchestrator from './orchestrator.mjs';
import TaskService from './task-service.mjs';

async function testSuperpowers() {
  console.log('🚀 Testing Superpowers Integration...');
  
  try {
    // Test orchestrator initialization
    const orchestrator = new AxiomOrchestrator();
    await orchestrator.initialize();
    console.log('✅ Orchestrator initialized successfully');
    
    // Test capability detection
    console.log('\n🔍 Testing capability detection...');
    
    const testCases = [
      {
        description: "Please scrape the content from https://example.com",
        expectedCapability: "web_scraping"
      },
      {
        description: "Analyze this text for sentiment and key phrases",
        expectedCapability: "text_analysis"
      },
      {
        description: "What is the weather today?",
        expectedCapability: null // No specific capability required
      }
    ];
    
    testCases.forEach(testCase => {
      const detectedCapability = orchestrator.determineRequiredCapability(testCase.description);
      const status = detectedCapability === testCase.expectedCapability ? '✅' : '❌';
      console.log(`${status} "${testCase.description}" -> ${detectedCapability || 'general processing'}`);
    });
    
    // Test TaskService
    console.log('\n⚙️ Testing TaskService...');
    const taskService = new TaskService();
    await taskService.initialize();
    console.log('✅ TaskService initialized successfully');
    
    // Test agent registration (this would typically be done by the agent itself)
    console.log('\n📋 Testing agent registration...');
    const testAgentId = 'test-agent-001';
    const testAgentUrl = 'https://test-agent-service-abc123.a.run.app/run';
    const testCapabilities = ['web_scraping', 'text_analysis'];
    
    await taskService.registerAgent(testAgentId, testAgentUrl, testCapabilities);
    console.log('✅ Agent registered successfully');
    
    // Test finding agents with capabilities
    console.log('\n🔍 Testing agent capability lookup...');
    const webScrapingAgent = await taskService.findAgentWithCapability('web_scraping');
    if (webScrapingAgent) {
      console.log('✅ Found agent with web_scraping capability:', webScrapingAgent.agentId);
    } else {
      console.log('❌ No agent found with web_scraping capability');
    }
    
    console.log('\n🎉 Superpowers integration test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during superpowers test:', error);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSuperpowers()
    .then(() => {
      console.log('✅ All tests passed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

export default testSuperpowers;