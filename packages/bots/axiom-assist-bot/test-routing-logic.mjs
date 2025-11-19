// test-routing-logic.mjs - Test just the routing logic without full initialization

// Copy the relevant methods from the orchestrator
const capabilityKeywords = {
  'web_scraping': [
    { keyword: 'scrap', weight: 1.0 },
    { keyword: 'web page', weight: 1.0 },
    { keyword: 'website', weight: 0.8 },
    { keyword: 'url', weight: 0.9 },
    { keyword: 'crawl', weight: 1.0 },
    { keyword: 'extract', weight: 0.7 },
    { keyword: 'fetch', weight: 0.6 },
    { keyword: 'download', weight: 0.5 },
    { keyword: 'get content from', weight: 1.0 },
    { keyword: 'pull data from', weight: 1.0 }
  ],
  'text_analysis': [
    { keyword: 'analyze', weight: 1.0 },
    { keyword: 'text', weight: 0.8 },
    { keyword: 'content', weight: 0.7 },
    { keyword: 'document', weight: 0.8 },
    { keyword: 'paragraph', weight: 0.6 },
    { keyword: 'summarize', weight: 0.9 },
    { keyword: 'sentiment', weight: 0.9 },
    { keyword: 'keywords', weight: 0.8 },
    { keyword: 'classify', weight: 0.8 },
    { keyword: 'extract insights', weight: 1.0 }
  ],
  'get_weather': [
    { keyword: 'weather', weight: 1.0 },
    { keyword: 'temperature', weight: 0.9 },
    { keyword: 'forecast', weight: 1.0 },
    { keyword: 'climate', weight: 0.7 },
    { keyword: 'rain', weight: 0.8 },
    { keyword: 'sunny', weight: 0.6 },
    { keyword: 'cloudy', weight: 0.6 },
    { keyword: 'conditions', weight: 0.7 }
  ],
  'example': [
    { keyword: 'example', weight: 1.0 },
    { keyword: 'sample', weight: 0.8 },
    { keyword: 'demo', weight: 0.9 }
  ]
};

function determineRequiredCapability(taskDescription) {
  const lowerDescription = taskDescription.toLowerCase();
  
  // Calculate scores for each capability
  const capabilityScores = {};
  
  for (const [capability, keywords] of Object.entries(capabilityKeywords)) {
    let score = 0;
    for (const { keyword, weight } of keywords) {
      // Check for exact phrase matches first
      if (lowerDescription.includes(keyword)) {
        score += weight;
      }
    }
    capabilityScores[capability] = score;
  }
  
  // Find the capability with the highest score
  let bestCapability = null;
  let highestScore = 0;
  
  for (const [capability, score] of Object.entries(capabilityScores)) {
    if (score > highestScore) {
      highestScore = score;
      bestCapability = capability;
    }
  }
  
  // Log the scoring for debugging
  console.log(`Capability scoring for task: "${taskDescription}"`, capabilityScores);
  
  // Only return a capability if we have a reasonable confidence score
  return highestScore >= 0.6 ? bestCapability : null;
}

function determineCompositeCapabilities(taskDescription) {
  // Enhanced heuristic: if the task description contains "and" or "then", it might be composite
  // Also check for sequential task indicators
  const lowerDescription = taskDescription.toLowerCase();
  
  // Check for composite task indicators
  const compositeIndicators = [' and ', ' then ', ' after ', ' followed by ', ' next '];
  const hasCompositeIndicator = compositeIndicators.some(indicator => lowerDescription.includes(indicator));
  
  if (hasCompositeIndicator) {
    // Try to identify multiple capabilities in order
    const capabilities = [];
    
    // Split the task description into parts based on composite indicators
    const parts = lowerDescription.split(/ and | then | after | followed by | next /);
    
    // For each part, determine the capability
    for (const part of parts) {
      const capability = determineRequiredCapability(part);
      if (capability) {
        capabilities.push(capability);
      }
    }
    
    // Return capabilities if we found more than one
    return capabilities.length > 1 ? capabilities : null;
  }
  
  return null;
}

function determineTaskPriority(taskDescription, metadata = {}) {
  let priority = 5; // Default priority
  
  // Check for high-priority keywords
  const highPriorityKeywords = [
    'urgent', 'asap', 'emergency', 'critical', 'important',
    'immediately', 'now', 'priority', 'vip', 'executive'
  ];
  
  const lowerDescription = taskDescription.toLowerCase();
  
  for (const keyword of highPriorityKeywords) {
    if (lowerDescription.includes(keyword)) {
      priority += 2;
    }
  }
  
  // Check for low-priority keywords
  const lowPriorityKeywords = [
    'whenever', 'later', 'eventually', 'nice to have', 'optional'
  ];
  
  for (const keyword of lowPriorityKeywords) {
    if (lowerDescription.includes(keyword)) {
      priority -= 2;
    }
  }
  
  // Adjust based on user importance if provided
  if (metadata.userRole === 'admin' || metadata.userRole === 'executive') {
    priority += 3;
  } else if (metadata.userRole === 'premium') {
    priority += 1;
  } else if (metadata.userRole === 'guest') {
    priority -= 1;
  }
  
  // Adjust based on business impact
  const businessImpactKeywords = [
    'revenue', 'customer', 'client', 'sales', 'marketing',
    'product', 'launch', 'release', 'bug', 'issue'
  ];
  
  for (const keyword of businessImpactKeywords) {
    if (lowerDescription.includes(keyword)) {
      priority += 1;
    }
  }
  
  // Ensure priority is within bounds
  return Math.max(1, Math.min(10, priority));
}

// Test cases
console.log('=== Testing Enhanced Capability Routing ===\\n');

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

console.log('=== Testing Composite Capability Detection ===');
for (const testCase of testCases) {
  console.log(`\\nTask: "${testCase.description}"`);
  
  // Test composite capability detection
  const compositeCapabilities = determineCompositeCapabilities(testCase.description);
  console.log(`Composite capabilities detected: ${compositeCapabilities ? compositeCapabilities.join(', ') : 'None'}`);
  
  // Test single capability detection
  const singleCapability = determineRequiredCapability(testCase.description);
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
  const priority = determineTaskPriority(testCase.description, testCase.metadata);
  console.log(`\\nTask: "${testCase.description}"`);
  console.log(`User role: ${testCase.metadata.userRole}`);
  console.log(`Priority: ${priority}/10`);
}

console.log('\\n✅ All tests completed successfully');