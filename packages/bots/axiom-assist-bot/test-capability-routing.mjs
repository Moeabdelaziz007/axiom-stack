#!/usr/bin/env node

// test-capability-routing.mjs - Test the enhanced capability routing functionality
import AxiomOrchestrator from './orchestrator.mjs';

async function testCapabilityRouting() {
  try {
    console.log('Testing enhanced capability routing...');
    
    const orchestrator = new AxiomOrchestrator();
    
    // Test cases for capability detection
    const testCases = [
      {
        description: "Scrape the content from https://example.com and analyze the text",
        expectedCapabilities: ['web_scraping', 'text_analysis']
      },
      {
        description: "What is the weather forecast for tomorrow?",
        expectedCapabilities: ['get_weather']
      },
      {
        description: "Analyze this document for sentiment",
        expectedCapabilities: ['text_analysis']
      },
      {
        description: "Get the content from this website and extract keywords",
        expectedCapabilities: ['web_scraping', 'text_analysis']
      },
      {
        description: "Show me an example of how this works",
        expectedCapabilities: ['example']
      }
    ];
    
    console.log('\\n=== Testing Composite Capability Detection ===');
    for (const testCase of testCases) {
      console.log(`\\nTask: "${testCase.description}"`);
      
      // Test composite capability detection
      const compositeCapabilities = orchestrator.determineCompositeCapabilities(testCase.description);
      console.log(`Composite capabilities detected: ${compositeCapabilities ? compositeCapabilities.join(', ') : 'None'}`);
      
      // Test single capability detection
      const singleCapability = orchestrator.determineRequiredCapability(testCase.description);
      console.log(`Single capability detected: ${singleCapability || 'None'}`);
    }
    
    console.log('\\n=== Testing Task Priority Determination ===');
    const priorityTestCases = [
      {
        description: "This is an urgent request that needs immediate attention",
        metadata: { userRole: "admin" }
      },
      {
        description: "This can be done whenever you have time",
        metadata: { userRole: "guest" }
      },
      {
        description: "Please analyze this customer feedback for our product launch",
        metadata: { userRole: "premium" }
      }
    ];
    
    for (const testCase of priorityTestCases) {
      const priority = orchestrator.determineTaskPriority(testCase.description, testCase.metadata);
      console.log(`\\nTask: "${testCase.description}"`);
      console.log(`User role: ${testCase.metadata.userRole}`);
      console.log(`Priority: ${priority}/10`);
    }
    
    console.log('\\n✅ All tests completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCapabilityRouting();
}

export default testCapabilityRouting;