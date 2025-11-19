// install-jules.mjs - Script to install Jules extension for autonomous development
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execPromise = promisify(exec);

async function installJules() {
  try {
    console.log('🚀 Installing Jules extension for autonomous development...');
    
    // Check if npm is available
    await execPromise('npm --version');
    console.log('✅ npm is available');
    
    // Install Gemini CLI globally if not already installed
    console.log('Installing Gemini CLI...');
    try {
      await execPromise('npm list -g @gemini/cli', { stdio: 'pipe' });
      console.log('✅ Gemini CLI already installed');
    } catch (error) {
      console.log('Installing Gemini CLI globally...');
      await execPromise('npm install -g @gemini/cli');
      console.log('✅ Gemini CLI installed successfully');
    }
    
    // Install Jules extension
    console.log('Installing Jules extension...');
    await execPromise('gemini extensions install https://github.com/gemini-cli-extensions/jules --auto-update');
    console.log('✅ Jules extension installed successfully');
    
    // Verify installation
    console.log('Verifying Jules installation...');
    const { stdout } = await execPromise('gemini extensions list');
    if (stdout.includes('jules')) {
      console.log('✅ Jules extension verified');
    } else {
      console.warn('⚠️ Jules extension may not be properly installed');
    }
    
    console.log('\n🎉 Jules installation completed!');
    console.log('\nTo use Jules:');
    console.log('1. Run: /jules [task description] in your terminal');
    console.log('2. Example: /jules update all pip packages in ./axiom-agent-service/requirements.txt');
    console.log('3. Example: /jules add pytest unit tests for the new Firestore MCP tool');
    
  } catch (error) {
    console.error('❌ Error installing Jules:', error.message);
    
    // Provide manual installation instructions
    console.log('\n📝 Manual installation instructions:');
    console.log('1. Install Gemini CLI: npm install -g @gemini/cli');
    console.log('2. Install Jules extension: gemini extensions install https://github.com/gemini-cli-extensions/jules --auto-update');
    console.log('3. Verify installation: gemini extensions list');
    
    throw error;
  }
}

// Run the installation if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  installJules()
    .then(() => {
      console.log('\n✅ Jules installation script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Jules installation failed:', error);
      process.exit(1);
    });
}

export default installJules;