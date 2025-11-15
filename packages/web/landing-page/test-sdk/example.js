// example.js - Example usage of HoloCoreAgent
import Holocoreagent from './index.js';

async function main() {
  const agent = new Holocoreagent({
    name: 'HoloCoreAgent',
    description: 'A holographic AI agent',
    type: 'custom'
  });

  await agent.initialize();
  console.log('HoloCoreAgent is ready to use!');
  
  // Add your custom logic here
}

main().catch(console.error);
