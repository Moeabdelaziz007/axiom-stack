#!/usr/bin/env node

// test-capability-detection.mjs - Test the orchestrator's capability detection
import AxiomOrchestrator from './orchestrator.mjs';

async function testCapabilityDetection() {
  try {
    console.log('Testing capability detection...');
    
    // Create an orchestrator instance
    const orchestrator = new AxiomOrchestrator();
    
    // Test cases
    const testCases = [
      {
        description: "Scrape the latest news from a website",
        expected: "web_scraping"
      },
      {
        description: "Analyze this document for key insights",
        expected: "text_analysis"
      },
      {
        description: "What's the weather like in New York today?",
        expected: "get_weather"
      },
      {
        description: "Calculate the sum of these numbers",
        expected: null
      }
    ];
    
    // Test each case
    for (const testCase of testCases) {
      const result = orchestrator.determineRequiredCapability(testCase.description);
      const status = result === testCase.expected ? "✅ PASS" : "❌ FAIL";
      console.log(`${status} "${testCase.description}" -> ${result || 'null'} (expected: ${testCase.expected || 'null'})`);
    }
    
    console.log('✅ Capability detection test completed');
  } catch (error) {
    console.error('❌ Failed to test capability detection:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCapabilityDetection();
}

export default testCapabilityDetection;