// index.mjs - Main entry point for Axiom ID Proof of Concept
import Agent from './Agent.mjs';
import TaskManager from './TaskManager.mjs';
import PaymentSystem from './PaymentSystem.mjs';
import VerificationService from './VerificationService.mjs';

// Initialize the POC
async function initializePOC() {
  console.log('Initializing Axiom ID Proof of Concept...');
  
  // Create task manager
  const taskManager = new TaskManager();
  
  // Create payment system
  const paymentSystem = new PaymentSystem();
  
  // Create verification service
  const verificationService = new VerificationService();
  
  // Create sample agents
  const agent1 = new Agent('Data Analyzer', ['data-analysis', 'pattern-recognition']);
  const agent2 = new Agent('Content Generator', ['text-generation', 'creative-writing']);
  const agent3 = new Agent('Image Processor', ['image-recognition', 'computer-vision']);
  
  console.log('Created agents:');
  console.log('- Data Analyzer:', agent1.getInfo().publicKey);
  console.log('- Content Generator:', agent2.getInfo().publicKey);
  console.log('- Image Processor:', agent3.getInfo().publicKey);
  
  // Create on-chain identities for agents
  console.log('\nCreating on-chain identities...');
  const identity1 = await agent1.createIdentity();
  const identity2 = await agent2.createIdentity();
  const identity3 = await agent3.createIdentity();
  
  console.log('Agent identities created:');
  console.log('- Data Analyzer Identity:', identity1.identityAccount);
  console.log('- Content Generator Identity:', identity2.identityAccount);
  console.log('- Image Processor Identity:', identity3.identityAccount);
  
  // Initialize agent balances
  paymentSystem.initializeBalance(agent1.publicKey.toString(), 1000);
  paymentSystem.initializeBalance(agent2.publicKey.toString(), 1000);
  paymentSystem.initializeBalance(agent3.publicKey.toString(), 1000);
  
  // Get initial reputation scores
  console.log('\nFetching initial reputation scores...');
  const rep1 = await agent1.getReputationScore();
  const rep2 = await agent2.getReputationScore();
  const rep3 = await agent3.getReputationScore();
  
  console.log('Initial Reputation Scores:');
  console.log('- Data Analyzer:', rep1);
  console.log('- Content Generator:', rep2);
  console.log('- Image Processor:', rep3);
  
  // Create sample tasks
  const task1 = taskManager.createTask(
    'Analyze Sales Data',
    'Analyze quarterly sales data and identify trends',
    ['data-analysis']
  );
  
  const task2 = taskManager.createTask(
    'Generate Marketing Copy',
    'Create compelling marketing copy for new product launch',
    ['text-generation']
  );
  
  const task3 = taskManager.createTask(
    'Process Customer Images',
    'Analyze customer uploaded images for product categorization',
    ['image-recognition']
  );
  
  console.log('\nCreated tasks:');
  console.log('- Task 1:', task1.title);
  console.log('- Task 2:', task2.title);
  console.log('- Task 3:', task3.title);
  
  // Assign tasks to agents
  taskManager.assignTask(task1.id, agent1);
  taskManager.assignTask(task2.id, agent2);
  taskManager.assignTask(task3.id, agent3);
  
  console.log('\nAssigned tasks to agents');
  
  // Execute tasks
  console.log('\nExecuting tasks...');
  
  const result1 = await agent1.executeTask(task1);
  taskManager.completeTask(task1.id, result1);
  
  const result2 = await agent2.executeTask(task2);
  taskManager.completeTask(task2.id, result2);
  
  const result3 = await agent3.executeTask(task3);
  taskManager.completeTask(task3.id, result3);
  
  // Present credentials for verification
  console.log('\nPresenting credentials for verification...');
  const cred1 = await agent1.presentCredentials({
    task: 'Analyze Sales Data',
    result: result1,
    timestamp: new Date()
  });
  
  const cred2 = await agent2.presentCredentials({
    task: 'Generate Marketing Copy',
    result: result2,
    timestamp: new Date()
  });
  
  const cred3 = await agent3.presentCredentials({
    task: 'Process Customer Images',
    result: result3,
    timestamp: new Date()
  });
  
  console.log('Credential Verification Results:');
  console.log('- Data Analyzer:', cred1 ? 'VERIFIED' : 'NOT VERIFIED');
  console.log('- Content Generator:', cred2 ? 'VERIFIED' : 'NOT VERIFIED');
  console.log('- Image Processor:', cred3 ? 'VERIFIED' : 'NOT VERIFIED');
  
  // Stake tokens for successful agents
  console.log('\nStaking tokens for successful agents...');
  if (result1.success) {
    const stake1 = await agent1.stakeTokens(100);
    console.log('Data Analyzer staking result:', stake1.success ? 'SUCCESS' : 'FAILED');
  }
  
  if (result2.success) {
    const stake2 = await agent2.stakeTokens(100);
    console.log('Content Generator staking result:', stake2.success ? 'SUCCESS' : 'FAILED');
  }
  
  if (result3.success) {
    const stake3 = await agent3.stakeTokens(100);
    console.log('Image Processor staking result:', stake3.success ? 'SUCCESS' : 'FAILED');
  }
  
  // Execute payment transactions for completed tasks
  console.log('\nExecuting payment transactions...');
  
  // Data Analyzer pays Content Generator for marketing copy
  const payment1 = await paymentSystem.executeAtomicTransaction(
    agent1.publicKey.toString(),
    agent2.publicKey.toString(),
    50,
    {
      taskId: task2.id,
      taskTitle: task2.title,
      description: 'Payment for marketing copy generation'
    }
  );
  
  console.log('Payment 1 result:', payment1.success ? 'SUCCESS' : 'FAILED');
  if (!payment1.success) {
    console.log('Payment 1 error:', payment1.error);
  }
  
  // Image Processor pays Data Analyzer for sales data analysis
  const payment2 = await paymentSystem.executeAtomicTransaction(
    agent3.publicKey.toString(),
    agent1.publicKey.toString(),
    75,
    {
      taskId: task1.id,
      taskTitle: task1.title,
      description: 'Payment for sales data analysis'
    }
  );
  
  console.log('Payment 2 result:', payment2.success ? 'SUCCESS' : 'FAILED');
  if (!payment2.success) {
    console.log('Payment 2 error:', payment2.error);
  }
  
  // Display results
  console.log('\nTask Results:');
  console.log('- Task 1 Result:', result1);
  console.log('- Task 2 Result:', result2);
  console.log('- Task 3 Result:', result3);
  
  // Display updated agent information
  console.log('\nUpdated Agent Information:');
  console.log('- Data Analyzer Reputation:', agent1.getInfo().reputation);
  console.log('- Content Generator Reputation:', agent2.getInfo().reputation);
  console.log('- Image Processor Reputation:', agent3.getInfo().reputation);
  
  // Get final reputation scores
  console.log('\nFetching final reputation scores...');
  const finalRep1 = await agent1.getReputationScore();
  const finalRep2 = await agent2.getReputationScore();
  const finalRep3 = await agent3.getReputationScore();
  
  console.log('Final Reputation Scores:');
  console.log('- Data Analyzer:', finalRep1);
  console.log('- Content Generator:', finalRep2);
  console.log('- Image Processor:', finalRep3);
  
  // Display final balances
  console.log('\nFinal Balances:');
  console.log('- Data Analyzer:', paymentSystem.getBalance(agent1.publicKey.toString()));
  console.log('- Content Generator:', paymentSystem.getBalance(agent2.publicKey.toString()));
  console.log('- Image Processor:', paymentSystem.getBalance(agent3.publicKey.toString()));
  
  // NEW: Demonstrate verification functionality (B-4)
  console.log('\n=== VERIFICATION FUNCTION DEMONSTRATION (B-4) ===');
  
  // Verify individual agents
  console.log('\nVerifying individual agents...');
  const verification1 = await verificationService.verifyAgentEndpoint(agent1.publicKey.toString());
  console.log('Data Analyzer Verification:', verification1);
  
  const verification2 = await verificationService.verifyAgentEndpoint(agent2.publicKey.toString());
  console.log('Content Generator Verification:', verification2);
  
  const verification3 = await verificationService.verifyAgentEndpoint(agent3.publicKey.toString());
  console.log('Image Processor Verification:', verification3);
  
  // Verify a transaction if successful
  if (payment1.success) {
    console.log('\nVerifying transaction...');
    const transactionVerification = await verificationService.verifyTransactionEndpoint(
      payment1.transactionSignature,
      payment1.sender,
      payment1.receiver,
      payment1.amount
    );
    console.log('Transaction Verification:', transactionVerification);
  }
  
  // Batch verify all agents
  console.log('\nBatch verifying all agents...');
  const batchVerification = await verificationService.batchVerifyAgents([
    agent1.publicKey.toString(),
    agent2.publicKey.toString(),
    agent3.publicKey.toString()
  ]);
  console.log('Batch Verification Results:', batchVerification);
  
  console.log('\nPOC execution completed successfully!');
}

// Run the POC
initializePOC().catch(console.error);