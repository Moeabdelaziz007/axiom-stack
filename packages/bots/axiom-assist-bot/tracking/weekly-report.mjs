#!/usr/bin/env node

// weekly-report.mjs - Generate weekly progress reports
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProgressSummary } from './update-progress.mjs';
import { getKPISummary } from './update-kpi.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const progressTrackerPath = path.join(__dirname, 'progress-tracker.json');
const kpiTrackerPath = path.join(__dirname, 'kpi-tracker.json');

/**
 * Generate a weekly progress report
 * @param {number} weekNumber - Week number (1-12)
 */
export async function generateWeeklyReport(weekNumber = null) {
  try {
    console.log('Generating weekly progress report...\n');
    
    // Read the progress tracker
    const progressData = JSON.parse(fs.readFileSync(progressTrackerPath, 'utf8'));
    
    // Determine which week to report on
    let weekData;
    if (weekNumber) {
      weekData = progressData.weeks.find(w => w.week === weekNumber);
      if (!weekData) {
        console.error(`Week ${weekNumber} not found in progress tracker`);
        return;
      }
    } else {
      // Find the current week based on date
      const currentDate = new Date();
      const projectStartDate = new Date(progressData.start_date);
      const weeksSinceStart = Math.ceil((currentDate - projectStartDate) / (7 * 24 * 60 * 60 * 1000));
      weekData = progressData.weeks.find(w => w.week === Math.min(weeksSinceStart, progressData.weeks.length));
      
      if (!weekData) {
        console.error('Could not determine current week');
        return;
      }
    }
    
    // Generate report header
    console.log(`=== Axiom ID Weekly Progress Report - Week ${weekData.week} ===`);
    console.log(`Phase: ${weekData.phase}`);
    console.log(`Status: ${weekData.status}`);
    console.log(`Report Date: ${new Date().toISOString()}\n`);
    
    // Show tasks for this week
    console.log('Tasks:');
    if (weekData.tasks.length === 0) {
      console.log('  No tasks defined for this week');
    } else {
      weekData.tasks.forEach((task, index) => {
        console.log(`  ${index + 1}. ${task.name}`);
        console.log(`     Status: ${task.status}`);
        console.log(`     Responsible Team: ${task.responsible_team}`);
        if (task.updated_at) {
          console.log(`     Last Updated: ${task.updated_at}`);
        }
        console.log('');
      });
    }
    
    // Show overall project progress
    const progressSummary = await getProgressSummary();
    
    // Show KPI status
    console.log('Key Performance Indicators:');
    const kpiData = JSON.parse(fs.readFileSync(kpiTrackerPath, 'utf8'));
    kpiData.kpis.forEach(kpi => {
      console.log(`  ${kpi.name}: ${kpi.current} (Target: ${kpi.target})`);
    });
    
    // Generate recommendations
    console.log('\nRecommendations:');
    const pendingTasks = weekData.tasks.filter(t => t.status === 'pending');
    const inProgressTasks = weekData.tasks.filter(t => t.status === 'in-progress');
    
    if (pendingTasks.length > 0) {
      console.log(`  - Start work on ${pendingTasks.length} pending tasks`);
    }
    
    if (inProgressTasks.length > 0) {
      console.log(`  - Continue work on ${inProgressTasks.length} in-progress tasks`);
    }
    
    // Check if any KPIs are at risk
    const atRiskKPIs = kpiData.kpis.filter(kpi => {
      // Simple check for KPIs that are significantly below target
      if (kpi.target.startsWith('>')) {
        const targetValue = parseFloat(kpi.target.replace(/[^\d.]/g, ''));
        const currentValue = parseFloat(kpi.current.replace(/[^\d.]/g, ''));
        return currentValue < (targetValue * 0.7); // 30% below target is at risk
      }
      return false;
    });
    
    if (atRiskKPIs.length > 0) {
      console.log(`  - At risk KPIs: ${atRiskKPIs.map(k => k.name).join(', ')}`);
    }
    
    console.log('\n=== End of Report ===\n');
    
    return {
      week: weekData.week,
      phase: weekData.phase,
      status: weekData.status,
      tasks: weekData.tasks,
      progressSummary,
      atRiskKPIs: atRiskKPIs.map(k => k.name)
    };
  } catch (error) {
    console.error('Error generating weekly report:', error);
    return null;
  }
}

/**
 * Generate a summary report for stakeholders
 */
export async function generateStakeholderReport() {
  try {
    console.log('Generating stakeholder summary report...\n');
    
    // Get project progress
    const progressSummary = await getProgressSummary();
    
    // Get KPI summary
    const kpiData = JSON.parse(fs.readFileSync(kpiTrackerPath, 'utf8'));
    
    // Generate executive summary
    console.log('=== Axiom ID Project - Executive Summary ===');
    console.log(`Project: ${kpiData.project}`);
    console.log(`Timeline: 12 weeks`);
    console.log(`Start Date: ${kpiData.tracking_start_date}\n`);
    
    console.log('Progress:');
    console.log(`  Weeks Completed: ${progressSummary.completedWeeks}/${progressSummary.totalWeeks}`);
    console.log(`  Tasks Completed: ${progressSummary.completedTasks}/${progressSummary.totalTasks}`);
    console.log(`  Overall Progress: ${progressSummary.progressPercentage}%\n`);
    
    console.log('Key Performance Indicators:');
    let achievedKPIs = 0;
    kpiData.kpis.forEach(kpi => {
      // Simple target checking
      let achieved = false;
      if (kpi.target.startsWith('>')) {
        const targetValue = parseFloat(kpi.target.replace(/[^\d.]/g, ''));
        const currentValue = parseFloat(kpi.current.replace(/[^\d.]/g, ''));
        achieved = currentValue >= targetValue;
      } else if (kpi.target.startsWith('<')) {
        const targetValue = parseFloat(kpi.target.replace(/[^\d.]/g, ''));
        const currentValue = parseFloat(kpi.current.replace(/[^\d.]/g, ''));
        achieved = currentValue <= targetValue;
      }
      
      if (achieved) achievedKPIs++;
      
      console.log(`  ${kpi.name}: ${kpi.current} ${achieved ? '✅' : '❌'} (Target: ${kpi.target})`);
    });
    
    console.log(`\nKPI Achievement: ${achievedKPIs}/${kpiData.kpis.length}\n`);
    
    // Milestones
    console.log('Upcoming Milestones:');
    const progressData = JSON.parse(fs.readFileSync(progressTrackerPath, 'utf8'));
    const upcomingWeeks = progressData.weeks.filter(w => 
      w.status === 'pending' || w.status === 'in-progress'
    ).slice(0, 3);
    
    upcomingWeeks.forEach(week => {
      console.log(`  Week ${week.week} (${week.phase}): ${week.tasks.length} tasks`);
    });
    
    console.log('\n=== End of Report ===\n');
    
    return {
      project: kpiData.project,
      progress: progressSummary,
      kpiAchievement: {
        achieved: achievedKPIs,
        total: kpiData.kpis.length
      },
      upcomingMilestones: upcomingWeeks.map(w => ({
        week: w.week,
        phase: w.phase,
        tasks: w.tasks.length
      }))
    };
  } catch (error) {
    console.error('Error generating stakeholder report:', error);
    return null;
  }
}

// If run directly, generate current week report
if (import.meta.url === `file://${process.argv[1]}`) {
  const weekNumber = process.argv[2] ? parseInt(process.argv[2]) : null;
  if (process.argv.includes('--stakeholder')) {
    await generateStakeholderReport();
  } else {
    await generateWeeklyReport(weekNumber);
  }
}