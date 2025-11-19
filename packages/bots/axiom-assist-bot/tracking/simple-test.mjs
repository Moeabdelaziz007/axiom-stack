#!/usr/bin/env node

// simple-test.mjs - Simple test for the tracking system
import { updateTaskStatus } from './update-progress.mjs';
import { updateKPI } from './update-kpi.mjs';

async function simpleTest() {
  console.log('Running simple test...\n');
  
  // Test updating a task status
  console.log('1. Testing task status update...');
  const result1 = await updateTaskStatus(1, "Setup GCP project, service accounts, and IAM roles", "completed");
  console.log('Result:', result1 ? '✅ Success' : '❌ Failed');
  
  // Test updating a KPI
  console.log('\n2. Testing KPI update...');
  const result2 = await updateKPI("Task Completion Rate", "80%");
  console.log('Result:', result2 ? '✅ Success' : '❌ Failed');
  
  console.log('\n✅ Simple test completed!');
}

// Run the test
simpleTest().catch(console.error);