#!/usr/bin/env node

// weekly-report.mjs - Generate weekly progress reports for Axiom ID implementation
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trackerPath = path.join(__dirname, 'progress-tracker.json');

function generateWeeklyReport(weekNumber) {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    // If no week number provided, use current week
    const targetWeek = weekNumber || trackerData.current_week;
    
    console.log('==========================================');
    console.log(`      WEEK ${targetWeek} PROGRESS REPORT`);
    console.log('==========================================');
    console.log(`Project: ${trackerData.project}`);
    console.log(`Report Date: ${new Date().toISOString().split('T')[0]}`);
    console.log('==========================================\n');
    
    // Find the phase for this week
    const currentPhase = trackerData.phases.find(phase => {
      if (phase.week_range.includes('-')) {
        const [start, end] = phase.week_range.split('-').map(Number);
        return targetWeek >= start && targetWeek <= end;
      } else {
        return parseInt(phase.week_range) === targetWeek;
      }
    });
    
    if (currentPhase) {
      console.log(`CURRENT PHASE: ${currentPhase.phase}`);
      console.log(`Responsible Team: ${currentPhase.responsible_team}`);
      console.log(`Completion: ${currentPhase.completion_percentage}%`);
      displayProgressBar(currentPhase.completion_percentage);
      console.log('\n');
      
      // Display task status
      if (currentPhase.completed_tasks.length > 0) {
        console.log('COMPLETED TASKS:');
        currentPhase.completed_tasks.forEach(task => console.log(`  ✓ ${task}`));
        console.log('');
      }
      
      if (currentPhase.in_progress_tasks.length > 0) {
        console.log('IN PROGRESS TASKS:');
        currentPhase.in_progress_tasks.forEach(task => console.log(`  ○ ${task}`));
        console.log('');
      }
      
      if (currentPhase.pending_tasks.length > 0) {
        console.log('PENDING TASKS:');
        currentPhase.pending_tasks.forEach(task => console.log(`  □ ${task}`));
        console.log('');
      }
    } else {
      console.log('No phase found for this week\n');
    }
    
    // Display KPI status
    console.log('KPI STATUS:');
    console.log('-----------');
    trackerData.kpis.forEach(kpi => {
      console.log(`${kpi.category} - ${kpi.kpi}`);
      console.log(`  Target: ${kpi.target}`);
      console.log(`  Current: ${kpi.current_value}`);
      console.log(`  Status: ${kpi.status}\n`);
    });
    
    // Display upcoming phases
    console.log('UPCOMING PHASES:');
    console.log('----------------');
    const futurePhases = trackerData.phases.filter(phase => {
      if (phase.week_range.includes('-')) {
        const start = parseInt(phase.week_range.split('-')[0]);
        return start > targetWeek;
      } else {
        return parseInt(phase.week_range) > targetWeek;
      }
    });
    
    if (futurePhases.length > 0) {
      futurePhases.slice(0, 3).forEach(phase => {
        console.log(`${phase.week_range} ${phase.phase}`);
        console.log(`  Team: ${phase.responsible_team}`);
        console.log(`  Key Tasks: ${phase.key_tasks.length} tasks\n`);
      });
    } else {
      console.log('No upcoming phases\n');
    }
    
    // Generate recommendations
    console.log('RECOMMENDATIONS:');
    console.log('----------------');
    if (currentPhase) {
      if (currentPhase.completion_percentage < 50) {
        console.log('• Consider allocating additional resources to accelerate current phase');
      } else if (currentPhase.completion_percentage > 80) {
        console.log('• Prepare for next phase transition');
      }
      
      if (currentPhase.pending_tasks.length > 0) {
        console.log(`• Focus on completing ${currentPhase.pending_tasks.length} pending tasks`);
      }
    }
    
    // Check KPIs that need attention
    const atRiskKPIs = trackerData.kpis.filter(kpi => kpi.status === 'below_target');
    if (atRiskKPIs.length > 0) {
      console.log(`• ${atRiskKPIs.length} KPIs are below target and require attention`);
    }
    
    console.log('');
    
  } catch (error) {
    console.error('Error generating weekly report:', error.message);
  }
}

function displayProgressBar(percentage) {
  const barLength = 20;
  const filledLength = Math.round((percentage / 100) * barLength);
  const emptyLength = barLength - filledLength;
  
  const filledBar = '█'.repeat(filledLength);
  const emptyBar = '░'.repeat(emptyLength);
  
  process.stdout.write(`[${filledBar}${emptyBar}] ${percentage}%`);
}

function addWeeklyNotes(weekNumber, notes) {
  try {
    const notesDir = path.join(__dirname, 'weekly-notes');
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir);
    }
    
    const notesFile = path.join(notesDir, `week-${weekNumber}.txt`);
    fs.writeFileSync(notesFile, notes);
    console.log(`Notes saved for week ${weekNumber}`);
  } catch (error) {
    console.error('Error saving weekly notes:', error.message);
  }
}

function readWeeklyNotes(weekNumber) {
  try {
    const notesFile = path.join(__dirname, 'weekly-notes', `week-${weekNumber}.txt`);
    if (fs.existsSync(notesFile)) {
      const notes = fs.readFileSync(notesFile, 'utf8');
      console.log(`\nWEEK ${weekNumber} NOTES:`);
      console.log('==================');
      console.log(notes);
    } else {
      console.log(`No notes found for week ${weekNumber}`);
    }
  } catch (error) {
    console.error('Error reading weekly notes:', error.message);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    generateWeeklyReport();
  } else if (args[0] === 'generate') {
    const weekNumber = args[1] ? parseInt(args[1]) : null;
    generateWeeklyReport(weekNumber);
  } else if (args[0] === 'add-notes') {
    const weekNumber = parseInt(args[1]);
    const notes = args.slice(2).join(' ');
    addWeeklyNotes(weekNumber, notes);
  } else if (args[0] === 'read-notes') {
    const weekNumber = parseInt(args[1]);
    readWeeklyNotes(weekNumber);
  } else {
    console.log('Usage:');
    console.log('  node weekly-report.mjs              # Generate report for current week');
    console.log('  node weekly-report.mjs generate [week]  # Generate report for specific week');
    console.log('  node weekly-report.mjs add-notes <week> <notes>  # Add notes for a week');
    console.log('  node weekly-report.mjs read-notes <week>  # Read notes for a week');
  }
}

export { generateWeeklyReport, addWeeklyNotes, readWeeklyNotes };#!/usr/bin/env node

// weekly-report.mjs - Generate weekly progress reports for Axiom ID implementation
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trackerPath = path.join(__dirname, 'progress-tracker.json');

function generateWeeklyReport(weekNumber) {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    // If no week number provided, use current week
    const targetWeek = weekNumber || trackerData.current_week;
    
    console.log('==========================================');
    console.log(`      WEEK ${targetWeek} PROGRESS REPORT`);
    console.log('==========================================');
    console.log(`Project: ${trackerData.project}`);
    console.log(`Report Date: ${new Date().toISOString().split('T')[0]}`);
    console.log('==========================================\n');
    
    // Find the phase for this week
    const currentPhase = trackerData.phases.find(phase => {
      if (phase.week_range.includes('-')) {
        const [start, end] = phase.week_range.split('-').map(Number);
        return targetWeek >= start && targetWeek <= end;
      } else {
        return parseInt(phase.week_range) === targetWeek;
      }
    });
    
    if (currentPhase) {
      console.log(`CURRENT PHASE: ${currentPhase.phase}`);
      console.log(`Responsible Team: ${currentPhase.responsible_team}`);
      console.log(`Completion: ${currentPhase.completion_percentage}%`);
      displayProgressBar(currentPhase.completion_percentage);
      console.log('\n');
      
      // Display task status
      if (currentPhase.completed_tasks.length > 0) {
        console.log('COMPLETED TASKS:');
        currentPhase.completed_tasks.forEach(task => console.log(`  ✓ ${task}`));
        console.log('');
      }
      
      if (currentPhase.in_progress_tasks.length > 0) {
        console.log('IN PROGRESS TASKS:');
        currentPhase.in_progress_tasks.forEach(task => console.log(`  ○ ${task}`));
        console.log('');
      }
      
      if (currentPhase.pending_tasks.length > 0) {
        console.log('PENDING TASKS:');
        currentPhase.pending_tasks.forEach(task => console.log(`  □ ${task}`));
        console.log('');
      }
    } else {
      console.log('No phase found for this week\n');
    }
    
    // Display KPI status
    console.log('KPI STATUS:');
    console.log('-----------');
    trackerData.kpis.forEach(kpi => {
      console.log(`${kpi.category} - ${kpi.kpi}`);
      console.log(`  Target: ${kpi.target}`);
      console.log(`  Current: ${kpi.current_value}`);
      console.log(`  Status: ${kpi.status}\n`);
    });
    
    // Display upcoming phases
    console.log('UPCOMING PHASES:');
    console.log('----------------');
    const futurePhases = trackerData.phases.filter(phase => {
      if (phase.week_range.includes('-')) {
        const start = parseInt(phase.week_range.split('-')[0]);
        return start > targetWeek;
      } else {
        return parseInt(phase.week_range) > targetWeek;
      }
    });
    
    if (futurePhases.length > 0) {
      futurePhases.slice(0, 3).forEach(phase => {
        console.log(`${phase.week_range} ${phase.phase}`);
        console.log(`  Team: ${phase.responsible_team}`);
        console.log(`  Key Tasks: ${phase.key_tasks.length} tasks\n`);
      });
    } else {
      console.log('No upcoming phases\n');
    }
    
    // Generate recommendations
    console.log('RECOMMENDATIONS:');
    console.log('----------------');
    if (currentPhase) {
      if (currentPhase.completion_percentage < 50) {
        console.log('• Consider allocating additional resources to accelerate current phase');
      } else if (currentPhase.completion_percentage > 80) {
        console.log('• Prepare for next phase transition');
      }
      
      if (currentPhase.pending_tasks.length > 0) {
        console.log(`• Focus on completing ${currentPhase.pending_tasks.length} pending tasks`);
      }
    }
    
    // Check KPIs that need attention
    const atRiskKPIs = trackerData.kpis.filter(kpi => kpi.status === 'below_target');
    if (atRiskKPIs.length > 0) {
      console.log(`• ${atRiskKPIs.length} KPIs are below target and require attention`);
    }
    
    console.log('');
    
  } catch (error) {
    console.error('Error generating weekly report:', error.message);
  }
}

function displayProgressBar(percentage) {
  const barLength = 20;
  const filledLength = Math.round((percentage / 100) * barLength);
  const emptyLength = barLength - filledLength;
  
  const filledBar = '█'.repeat(filledLength);
  const emptyBar = '░'.repeat(emptyLength);
  
  process.stdout.write(`[${filledBar}${emptyBar}] ${percentage}%`);
}

function addWeeklyNotes(weekNumber, notes) {
  try {
    const notesDir = path.join(__dirname, 'weekly-notes');
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir);
    }
    
    const notesFile = path.join(notesDir, `week-${weekNumber}.txt`);
    fs.writeFileSync(notesFile, notes);
    console.log(`Notes saved for week ${weekNumber}`);
  } catch (error) {
    console.error('Error saving weekly notes:', error.message);
  }
}

function readWeeklyNotes(weekNumber) {
  try {
    const notesFile = path.join(__dirname, 'weekly-notes', `week-${weekNumber}.txt`);
    if (fs.existsSync(notesFile)) {
      const notes = fs.readFileSync(notesFile, 'utf8');
      console.log(`\nWEEK ${weekNumber} NOTES:`);
      console.log('==================');
      console.log(notes);
    } else {
      console.log(`No notes found for week ${weekNumber}`);
    }
  } catch (error) {
    console.error('Error reading weekly notes:', error.message);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    generateWeeklyReport();
  } else if (args[0] === 'generate') {
    const weekNumber = args[1] ? parseInt(args[1]) : null;
    generateWeeklyReport(weekNumber);
  } else if (args[0] === 'add-notes') {
    const weekNumber = parseInt(args[1]);
    const notes = args.slice(2).join(' ');
    addWeeklyNotes(weekNumber, notes);
  } else if (args[0] === 'read-notes') {
    const weekNumber = parseInt(args[1]);
    readWeeklyNotes(weekNumber);
  } else {
    console.log('Usage:');
    console.log('  node weekly-report.mjs              # Generate report for current week');
    console.log('  node weekly-report.mjs generate [week]  # Generate report for specific week');
    console.log('  node weekly-report.mjs add-notes <week> <notes>  # Add notes for a week');
    console.log('  node weekly-report.mjs read-notes <week>  # Read notes for a week');
  }
}

export { generateWeeklyReport, addWeeklyNotes, readWeeklyNotes };