#!/usr/bin/env node

// test-backup-system.mjs - Test the backup and rollback system
import FirestoreBackupManager from './firestore-backup.mjs';
import CloudRunRollbackManager from './cloud-run-rollback.mjs';
import ContingencyPlanManager from './contingency-plans.mjs';
import CostAnalysisManager from './cost-analysis.mjs';

async function testBackupSystem() {
  console.log('Testing the Axiom ID backup and rollback system...\n');
  
  // Test Firestore backup manager
  console.log('1. Testing Firestore Backup Manager...');
  const backupManager = new FirestoreBackupManager();
  await backupManager.executeBackupStrategy();
  
  // Test Cloud Run rollback manager
  console.log('\n2. Testing Cloud Run Rollback Manager...');
  const rollbackManager = new CloudRunRollbackManager();
  await rollbackManager.deployWithCanary('axiom-adk-service', 'gcr.io/axiom-id-project/axiom-adk-service:latest', 10);
  
  // Test contingency plan manager
  console.log('\n3. Testing Contingency Plan Manager...');
  const contingencyManager = new ContingencyPlanManager();
  contingencyManager.displayAllContingencyPlans();
  
  // Test cost analysis manager
  console.log('\n4. Testing Cost Analysis Manager...');
  const costManager = new CostAnalysisManager();
  costManager.displayCostAnalysis();
  
  console.log('\n✅ All backup and rollback system tests completed successfully!');
}

// Run the tests
testBackupSystem().catch(console.error);