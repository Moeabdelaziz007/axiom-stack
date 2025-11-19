#!/usr/bin/env node

// run-all-tests.mjs - Run all test suites for Axiom ID
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const execPromise = promisify(exec);

async function runAllTests() {
  console.log('🧪 Running all test suites for Axiom ID...\n');
  
  const testSuites = [
    {
      name: 'Unit Tests',
      command: 'npm run test:unit',
      description: 'Testing individual components in isolation'
    },
    {
      name: 'Security Tests',
      command: 'npm run test:security',
      description: 'Testing Model Armor security features'
    },
    {
      name: 'Integration Tests',
      command: 'npm run test:integration',
      description: 'Testing communication between services'
    },
    {
      name: 'Cloud Tasks Tests',
      command: 'npm run test:cloud-tasks',
      description: 'Testing Cloud Tasks integration'
    },
    {
      name: 'Model Armor Tests',
      command: 'npm run test:model-armor',
      description: 'Testing Model Armor service'
    },
    {
      name: 'ADK Agent Tests',
      command: 'npm run test:adk-agent',
      description: 'Testing ADK agent setup'
    }
  ];
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const suite of testSuites) {
    console.log(`🚀 Running ${suite.name}...`);
    console.log(`📝 ${suite.description}\n`);
    
    try {
      const { stdout, stderr } = await execPromise(suite.command, { 
        cwd: process.cwd(),
        timeout: 30000 // 30 second timeout
      });
      
      console.log('✅ PASSED');
      if (stdout) console.log(stdout);
      if (stderr) console.log(stderr);
      passedTests++;
    } catch (error) {
      console.log('❌ FAILED');
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.log(error.stderr);
      console.log(`Error: ${error.message}\n`);
      failedTests++;
    }
    
    console.log('─'.repeat(50) + '\n');
  }
  
  console.log(`\n📊 Test Results Summary:`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📊 Total: ${testSuites.length}`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All test suites completed successfully!');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${failedTests} test suite(s) failed.`);
    process.exit(1);
  }
}

// Run all tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(error => {
    console.error('❌ Error running tests:', error);
    process.exit(1);
  });
}

export default runAllTests;