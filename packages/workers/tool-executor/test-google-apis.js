// Test script for Google Always Free APIs Integration
async function testGoogleApis() {
  const baseUrl = 'https://axiom-tool-executor.amrikyygmailcom.workers.dev';
  
  console.log('Testing Google Always Free APIs Integration...');
  
  // Test BigQuery analytics (this would require proper authentication in a real scenario)
  console.log('\n1. Testing BigQuery Analytics...');
  try {
    const analyticsResponse = await fetch(`${baseUrl}/run-analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sql: 'SELECT COUNT(*) FROM `bigquery-public-data.samples.shakespeare`'
      })
    });
    
    const analyticsResult = await analyticsResponse.json();
    console.log('BigQuery Analytics Result:', JSON.stringify(analyticsResult, null, 2));
  } catch (error) {
    console.error('Error in BigQuery analytics:', error);
  }
  
  // Test Translation
  console.log('\n2. Testing Translation...');
  try {
    const translationResponse = await fetch(`${baseUrl}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Hello, how are you today?',
        targetLang: 'es'
      })
    });
    
    const translationResult = await translationResponse.json();
    console.log('Translation Result:', JSON.stringify(translationResult, null, 2));
  } catch (error) {
    console.error('Error in translation:', error);
  }
  
  // Test Speech transcription (this would require base64 audio data in a real scenario)
  console.log('\n3. Testing Speech Transcription...');
  try {
    const speechResponse = await fetch(`${baseUrl}/transcribe-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: 'base64_audio_data_here'
      })
    });
    
    const speechResult = await speechResponse.json();
    console.log('Speech Transcription Result:', JSON.stringify(speechResult, null, 2));
  } catch (error) {
    console.error('Error in speech transcription:', error);
  }
  
  console.log('\nTesting completed.');
}

// Run the test
testGoogleApis();