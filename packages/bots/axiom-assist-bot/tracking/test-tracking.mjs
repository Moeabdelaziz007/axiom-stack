#!/usr/bin/env node

// test-tracking.mjs - Test the tracking system
import { updateTaskStatus, addTask, getProgressSummary } from './update-progress.mjs';
import { updateKPI, getKPISummary, generateKPIReport } from './update-kpi.mjs';
import { generateWeeklyReport, generateStakeholderReport } from './weekly-report.mjs';

async function testTrackingSystem() {
  console.log('Testing the Axiom ID tracking system...\n');
  
  // Test updating a task status
  console.log('1. Testing task status update...');
  await updateTaskStatus(1, "Setup GCP project, service accounts, and IAM roles", "completed");
  
  // Test adding a new task
  console.log('\n2. Testing adding a new task...');
  await addTask(1, "Configure Cloud Run service permissions", "Cloud Ops");
  
  // Test updating a KPI
  console.log('\n3. Testing KPI update...');
  await updateKPI("Task Completion Rate", "75%");
  
  // Test getting progress summary
  console.log('\n4. Testing progress summary...');
  await getProgressSummary();
  
  // Test getting KPI summary
  console.log('\n5. Testing KPI summary...');
  await getKPISummary();
  
  // Test generating KPI report
  console.log('\n6. Testing KPI report generation...');
  await generateKPIReport();
  
  // Test generating weekly report
  console.log('\n7. Testing weekly report generation...');
  await generateWeeklyReport(1);
  
  // Test generating stakeholder report
  console.log('\n8. Testing stakeholder report generation...');
  await generateStakeholderReport();
  
  console.log('\n✅ All tracking system tests completed successfully!');
}

// Run the tests
testTrackingSystem().catch(console.error);