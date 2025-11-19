#!/usr/bin/env node

// kpi-dashboard.mjs - KPI tracking dashboard for Axiom ID implementation
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trackerPath = path.join(__dirname, 'progress-tracker.json');

function displayKPIDashboard() {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    console.log('==========================================');
    console.log('        AXIOM ID KPI DASHBOARD');
    console.log('==========================================');
    console.log(`Project: ${trackerData.project}`);
    console.log(`Current Week: ${trackerData.current_week}/${trackerData.timeline}`);
    console.log(`Date: ${new Date().toISOString().split('T')[0]}`);
    console.log('==========================================\n');
    
    // Calculate overall progress
    let totalCompletion = 0;
    let phaseCount = 0;
    
    trackerData.phases.forEach(phase => {
      totalCompletion += phase.completion_percentage;
      phaseCount++;
    });
    
    const overallCompletion = Math.round(totalCompletion / phaseCount);
    
    console.log(`Overall Progress: ${overallCompletion}%`);
    displayProgressBar(overallCompletion);
    console.log('\n');
    
    // Display phases progress
    console.log('PHASE PROGRESS:');
    console.log('---------------');
    trackerData.phases.forEach(phase => {
      console.log(`${phase.week_range} ${phase.phase}: ${phase.completion_percentage}%`);
      displayProgressBar(phase.completion_percentage);
      console.log(`  Team: ${phase.responsible_team}`);
      console.log(`  Status: ${phase.status}\n`);
    });
    
    // Display KPIs
    console.log('KEY PERFORMANCE INDICATORS:');
    console.log('---------------------------');
    trackerData.kpis.forEach(kpi => {
      console.log(`${kpi.category} - ${kpi.kpi}`);
      console.log(`  Target: ${kpi.target}`);
      console.log(`  Current: ${kpi.current_value}`);
      console.log(`  Status: ${kpi.status}`);
      console.log(`  Tool: ${kpi.measurement_tool}\n`);
    });
    
    // Display next milestones
    console.log('UPCOMING MILESTONES:');
    console.log('--------------------');
    const upcomingPhases = trackerData.phases.filter(phase => phase.status === 'pending');
    if (upcomingPhases.length > 0) {
      upcomingPhases.slice(0, 3).forEach(phase => {
        console.log(`Week ${phase.week_range}: ${phase.phase}`);
        console.log(`  Key Tasks: ${phase.key_tasks.length} tasks`);
        console.log(`  Team: ${phase.responsible_team}\n`);
      });
    } else {
      console.log('No upcoming milestones');
    }
    
  } catch (error) {
    console.error('Error displaying KPI dashboard:', error.message);
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

function updateKPIValue(category, kpiName, newValue) {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    const kpi = trackerData.kpis.find(k => k.category === category && k.kpi === kpiName);
    if (kpi) {
      const oldValue = kpi.current_value;
      kpi.current_value = newValue;
      
      // Update status based on target
      if (kpi.target.includes('>')) {
        const targetValue = parseFloat(kpi.target.replace('>', ''));
        const currentValue = parseFloat(newValue);
        kpi.status = currentValue >= targetValue ? 'on_target' : 'below_target';
      } else if (kpi.target.includes('<')) {
        const targetValue = parseFloat(kpi.target.replace('<', ''));
        const currentValue = parseFloat(newValue);
        kpi.status = currentValue <= targetValue ? 'on_target' : 'above_target';
      }
      
      fs.writeFileSync(trackerPath, JSON.stringify(trackerData, null, 2));
      console.log(`Updated KPI ${category} - ${kpiName} from ${oldValue} to ${newValue}`);
      console.log(`Status: ${kpi.status}`);
    } else {
      console.error(`KPI ${category} - ${kpiName} not found`);
    }
  } catch (error) {
    console.error('Error updating KPI value:', error.message);
  }
}

function generateKPIReport() {
  try {
    const trackerData = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
    
    const report = {
      timestamp: new Date().toISOString(),
      project: trackerData.project,
      current_week: trackerData.current_week,
      overall_progress: 0,
      kpi_summary: {
        on_target: 0,
        below_target: 0,
        above_target: 0,
        pending: 0
      },
      phase_summary: {
        completed: 0,
        in_progress: 0,
        pending: 0
      }
    };
    
    // Calculate overall progress
    let totalCompletion = 0;
    trackerData.phases.forEach(phase => {
      totalCompletion += phase.completion_percentage;
      if (phase.status === 'completed') {
        report.phase_summary.completed++;
      } else if (phase.status === 'in_progress') {
        report.phase_summary.in_progress++;
      } else {
        report.phase_summary.pending++;
      }
    });
    
    report.overall_progress = Math.round(totalCompletion / trackerData.phases.length);
    
    // Summarize KPI statuses
    trackerData.kpis.forEach(kpi => {
      if (kpi.status === 'on_target') {
        report.kpi_summary.on_target++;
      } else if (kpi.status === 'below_target') {
        report.kpi_summary.below_target++;
      } else if (kpi.status === 'above_target') {
        report.kpi_summary.above_target++;
      } else {
        report.kpi_summary.pending++;
      }
    });
    
    return report;
  } catch (error) {
    console.error('Error generating KPI report:', error.message);
    return null;
  }
}

function displayKPIReport() {
  const report = generateKPIReport();
  if (report) {
    console.log('\n==========================================');
    console.log('           KPI SUMMARY REPORT');
    console.log('==========================================');
    console.log(`Generated: ${report.timestamp}`);
    console.log(`Project: ${report.project}`);
    console.log(`Week: ${report.current_week}`);
    console.log(`Overall Progress: ${report.overall_progress}%`);
    
    console.log('\nPHASE SUMMARY:');
    console.log(`  Completed: ${report.phase_summary.completed}`);
    console.log(`  In Progress: ${report.phase_summary.in_progress}`);
    console.log(`  Pending: ${report.phase_summary.pending}`);
    
    console.log('\nKPI SUMMARY:');
    console.log(`  On Target: ${report.kpi_summary.on_target}`);
    console.log(`  Below Target: ${report.kpi_summary.below_target}`);
    console.log(`  Above Target: ${report.kpi_summary.above_target}`);
    console.log(`  Pending: ${report.kpi_summary.pending}`);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    displayKPIDashboard();
  } else if (args[0] === 'update-kpi') {
    const category = args[1];
    const kpiName = args[2];
    const newValue = args[3];
    
    updateKPIValue(category, kpiName, newValue);
  } else if (args[0] === 'report') {
    displayKPIReport();
  } else {
    console.log('Usage:');
    console.log('  node kpi-dashboard.mjs              # Display KPI dashboard');
    console.log('  node kpi-dashboard.mjs update-kpi <category> <kpi> <value>');
    console.log('  node kpi-dashboard.mjs report       # Generate KPI summary report');
  }
}

export { displayKPIDashboard, updateKPIValue, generateKPIReport, displayKPIReport };