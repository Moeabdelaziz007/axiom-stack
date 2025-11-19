// test-adk-agent.mjs - Test script for ADK agent
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

async function testADKAgent() {
  try {
    console.log('🚀 Testing ADK Agent setup...');
    
    // Check if Python is available
    const pythonVersion = await execPromise('python3 --version');
    console.log(`✅ Python available: ${pythonVersion.stdout.trim()}`);
    
    // Check if pip is available
    const pipVersion = await execPromise('pip --version');
    console.log(`✅ Pip available: ${pipVersion.stdout.trim()}`);
    
    // Check if required packages are installed
    const installedPackages = await execPromise('pip list');
    
    const requiredPackages = [
      'google-adk',
      'google-cloud-firestore',
      'google-cloud-storage',
      'pinecone-client',
      'aiohttp',
      'fastapi',
      'uvicorn'
    ];
    
    console.log('\nChecking required packages:');
    for (const pkg of requiredPackages) {
      if (installedPackages.stdout.includes(pkg)) {
        console.log(`✅ ${pkg} is installed`);
      } else {
        console.log(`❌ ${pkg} is not installed`);
      }
    }
    
    // Check if ADK agent files exist
    const adkAgentPath = path.join(process.cwd(), 'adk-agents');
    const mainPyPath = path.join(adkAgentPath, 'main.py');
    const requirementsPath = path.join(adkAgentPath, 'requirements.txt');
    
    console.log('\nChecking ADK agent files:');
    
    // Check if adk-agents directory exists
    try {
      await execPromise(`test -d ${adkAgentPath}`);
      console.log(`✅ ADK agents directory exists: ${adkAgentPath}`);
    } catch (error) {
      console.log(`❌ ADK agents directory does not exist: ${adkAgentPath}`);
    }
    
    // Check if main.py exists
    try {
      await execPromise(`test -f ${mainPyPath}`);
      console.log(`✅ ADK agent main.py exists: ${mainPyPath}`);
    } catch (error) {
      console.log(`❌ ADK agent main.py does not exist: ${mainPyPath}`);
    }
    
    // Check if requirements.txt exists
    try {
      await execPromise(`test -f ${requirementsPath}`);
      console.log(`✅ ADK agent requirements.txt exists: ${requirementsPath}`);
    } catch (error) {
      console.log(`❌ ADK agent requirements.txt does not exist: ${requirementsPath}`);
    }
    
    console.log('\n🎉 ADK Agent setup verification completed!');
    console.log('\nTo run the ADK agent:');
    console.log(`1. cd ${adkAgentPath}`);
    console.log('2. pip install -r requirements.txt');
    console.log('3. python main.py');
    console.log('4. The agent will start on http://localhost:8080');
    
  } catch (error) {
    console.error('❌ Error testing ADK Agent setup:', error.message);
    throw error;
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testADKAgent()
    .then(() => {
      console.log('\n✅ ADK Agent test completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ ADK Agent test failed:', error);
      process.exit(1);
    });
}

export default testADKAgent;