#!/usr/bin/env node

// update-progress.mjs - Script to update the implementation progress tracker
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trackerPath = path.join(__dirname, 'progress-tracker.json');

function updateProgress() {
  try {
    // Read the current progress tracker
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    console.log(`Project: ${trackerData.project}`);
    console.log(`Current Week: ${trackerData.current_week}`);
    console.log(`Timeline: ${trackerData.timeline}`);
    console.log('\n--- PHASE PROGRESS ---');
    
    // Display current phase progress
    trackerData.phases.forEach((phase, index) => {
      console.log(`\nWeek ${phase.week_range} - ${phase.phase}`);
      console.log(`Responsible Team: ${phase.responsible_team}`);
      console.log(`Status: ${phase.status}`);
      console.log(`Completion: ${phase.completion_percentage}%`);
      
      if (phase.completed_tasks.length > 0) {
        console.log('Completed Tasks:');
        phase.completed_tasks.forEach(task => console.log(`  ✓ ${task}`));
      }
      
      if (phase.in_progress_tasks.length > 0) {
        console.log('In Progress Tasks:');
        phase.in_progress_tasks.forEach(task => console.log(`  ○ ${task}`));
      }
      
      if (phase.pending_tasks.length > 0) {
        console.log('Pending Tasks:');
        phase.pending_tasks.forEach(task => console.log(`  □ ${task}`));
      }
    });
    
    console.log('\n--- KPI TRACKING ---');
    
    // Display KPI tracking
    trackerData.kpis.forEach(kpi => {
      console.log(`\n${kpi.category} - ${kpi.kpi}`);
      console.log(`Target: ${kpi.target}`);
      console.log(`Measurement Tool: ${kpi.measurement_tool}`);
      console.log(`Current Value: ${kpi.current_value}`);
      console.log(`Status: ${kpi.status}`);
    });
    
  } catch (error) {
    console.error('Error reading progress tracker:', error.message);
  }
}

function updatePhaseCompletion(weekRange, completionPercentage, completedTasks = [], inProgressTasks = []) {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    const phase = trackerData.phases.find(p => p.week_range === weekRange);
    if (phase) {
      phase.completion_percentage = completionPercentage;
      phase.completed_tasks = completedTasks;
      phase.in_progress_tasks = inProgressTasks;
      phase.pending_tasks = phase.key_tasks.filter(task => 
        !completedTasks.includes(task) && !inProgressTasks.includes(task)
      );
      
      if (completionPercentage === 100) {
        phase.status = 'completed';
      } else if (completionPercentage > 0) {
        phase.status = 'in_progress';
      }
      
      fs.writeFileSync(trackerPath, JSON.stringify(trackerData, null, 2));
      console.log(`Updated phase ${weekRange} completion to ${completionPercentage}%`);
    } else {
      console.error(`Phase with week range ${weekRange} not found`);
    }
  } catch (error) {
    console.error('Error updating phase completion:', error.message);
  }
}

function updateKPI(category, kpiName, currentValue, status) {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    const kpi = trackerData.kpis.find(k => k.category === category && k.kpi === kpiName);
    if (kpi) {
      kpi.current_value = currentValue;
      kpi.status = status;
      
      fs.writeFileSync(trackerPath, JSON.stringify(trackerData, null, 2));
      console.log(`Updated KPI ${category} - ${kpiName} to ${currentValue}`);
    } else {
      console.error(`KPI ${category} - ${kpiName} not found`);
    }
  } catch (error) {
    console.error('Error updating KPI:', error.message);
  }
}

function advanceWeek() {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    trackerData.current_week++;
    
    fs.writeFileSync(trackerPath, JSON.stringify(trackerData, null, 2));
    console.log(`Advanced to week ${trackerData.current_week}`);
  } catch (error) {
    console.error('Error advancing week:', error.message);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    updateProgress();
  } else if (args[0] === 'update-phase') {
    const weekRange = args[1];
    const completionPercentage = parseInt(args[2]);
    const completedTasks = args[3] ? args[3].split('|') : [];
    const inProgressTasks = args[4] ? args[4].split('|') : [];
    
    updatePhaseCompletion(weekRange, completionPercentage, completedTasks, inProgressTasks);
  } else if (args[0] === 'update-kpi') {
    const category = args[1];
    const kpiName = args[2];
    const currentValue = args[3];
    const status = args[4];
    
    updateKPI(category, kpiName, currentValue, status);
  } else if (args[0] === 'advance-week') {
    advanceWeek();
  } else {
    console.log('Usage:');
    console.log('  node update-progress.mjs                          # Display current progress');
    console.log('  node update-progress.mjs update-phase <week> <completion%> [completedTasks] [inProgressTasks]');
    console.log('  node update-progress.mjs update-kpi <category> <kpi> <value> <status>');
    console.log('  node update-progress.mjs advance-week');
  }
}

export { updateProgress, updatePhaseCompletion, updateKPI, advanceWeek };