#!/usr/bin/env node

// simulate-kpi-data.mjs - Simulate KPI data for testing the tracking system
import { updateKPI } from './update-progress.mjs';

function simulateKPIData() {
  console.log('Simulating KPI data for testing...\n');
  
  // Simulate AI Performance KPIs
  updateKPI('AI Performance', 'Task Completion Rate', '85%', 'below_target');
  updateKPI('AI Performance', 'Average Response Time (P95)', '2.1 seconds', 'on_target');
  
  // Simulate Security KPIs
  updateKPI('Security', 'Attacks Detected and Blocked', '98%', 'on_target');
  
  // Simulate User Experience KPIs
  updateKPI('User Experience', 'Customer Satisfaction (CSAT)', '4.2/5', 'below_target');
  
  // Simulate Operations KPIs
  updateKPI('Operations', 'Mean Time to Detect Error (MTTD)', '12 minutes', 'on_target');
  updateKPI('Operations', 'Developer Velocity', '+25% (reduction in maintenance task time)', 'on_target');
  
  console.log('\nKPI data simulation completed!');
}

// Run the simulation
if (import.meta.url === `file://${process.argv[1]}`) {
  simulateKPIData();
}

export default simulateKPIData;