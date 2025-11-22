// Test script for NLP Agent
async function testNlpAgent() {
  const baseUrl = 'https://axiom-nlp-agent.amrikyygmailcom.workers.dev';
  
  console.log('Testing NLP Agent...');
  
  // Test sentiment analysis
  console.log('\n1. Testing Sentiment Analysis...');
  try {
    const sentimentResponse = await fetch(`${baseUrl}/analyze-sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'I love this new technology! It\'s amazing and revolutionary.'
      })
    });
    
    const sentimentResult = await sentimentResponse.json();
    console.log('Sentiment Analysis Result:', JSON.stringify(sentimentResult, null, 2));
  } catch (error) {
    console.error('Error in sentiment analysis:', error);
  }
  
  // Test entity extraction
  console.log('\n2. Testing Entity Extraction...');
  try {
    const entityResponse = await fetch(`${baseUrl}/extract-entities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Google Cloud and Microsoft Azure are leading cloud platforms in 2025.'
      })
    });
    
    const entityResult = await entityResponse.json();
    console.log('Entity Extraction Result:', JSON.stringify(entityResult, null, 2));
  } catch (error) {
    console.error('Error in entity extraction:', error);
  }
  
  // Test text classification
  console.log('\n3. Testing Text Classification...');
  try {
    const classificationResponse = await fetch(`${baseUrl}/classify-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'The stock market showed significant growth today with tech stocks leading the rally.'
      })
    });
    
    const classificationResult = await classificationResponse.json();
    console.log('Text Classification Result:', JSON.stringify(classificationResult, null, 2));
  } catch (error) {
    console.error('Error in text classification:', error);
  }
  
  console.log('\nTesting completed.');
}

// Run the test
testNlpAgent();