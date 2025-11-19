#!/usr/bin/env node

// simple-capability-test.mjs - Simple test for capability detection logic

/**
 * Determine the required capability for a given task
 * @param {string} taskDescription - Description of the task
 * @returns {string|null} The required capability or null if not determined
 */
function determineRequiredCapability(taskDescription) {
  // Simple keyword-based capability detection
  // In a real implementation, this would be more sophisticated, possibly using AI
  const capabilityKeywords = {
    'web_scraping': ['scrap', 'web page', 'website', 'url', 'crawl'],
    'text_analysis': ['analyze', 'text', 'content', 'document', 'paragraph'],
    'get_weather': ['weather', 'temperature', 'forecast', 'climate']
  };
  
  const lowerDescription = taskDescription.toLowerCase();
  
  for (const [capability, keywords] of Object.entries(capabilityKeywords)) {
    if (keywords.some(keyword => lowerDescription.includes(keyword))) {
      return capability;
    }
  }
  
  // Return null if no specific capability is determined
  return null;
}

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

console.log('Testing capability detection...');

// Test each case
for (const testCase of testCases) {
  const result = determineRequiredCapability(testCase.description);
  const status = result === testCase.expected ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} "${testCase.description}" -> ${result || 'null'} (expected: ${testCase.expected || 'null'})`);
}

console.log('✅ Capability detection test completed');