#!/usr/bin/env node

// update-progress.mjs - Script to update project progress tracking
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const progressTrackerPath = path.join(__dirname, 'progress-tracker.json');

/**
 * Update task status in the progress tracker
 * @param {number} week - Week number (1-12)
 * @param {string} taskName - Name of the task to update
 * @param {string} status - New status (pending, in-progress, completed)
 */
export async function updateTaskStatus(week, taskName, status) {
  try {
    // Read the current progress tracker
    const progressData = JSON.parse(fs.readFileSync(progressTrackerPath, 'utf8'));
    
    // Find the week
    const weekData = progressData.weeks.find(w => w.week === week);
    if (!weekData) {
      console.error(`Week ${week} not found in progress tracker`);
      return false;
    }
    
    // Find the task
    const task = weekData.tasks.find(t => t.name === taskName);
    if (!task) {
      console.error(`Task "${taskName}" not found in week ${week}`);
      return false;
    }
    
    // Update the task status
    task.status = status;
    task.updated_at = new Date().toISOString();
    
    // Update week status if all tasks are completed
    const allTasksCompleted = weekData.tasks.every(t => t.status === 'completed');
    if (allTasksCompleted) {
      weekData.status = 'completed';
    } else if (weekData.tasks.some(t => t.status === 'in-progress')) {
      weekData.status = 'in-progress';
    }
    
    // Write the updated data back to the file
    fs.writeFileSync(progressTrackerPath, JSON.stringify(progressData, null, 2));
    
    console.log(`✅ Updated task "${taskName}" in week ${week} to status: ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating task status:', error);
    return false;
  }
}

/**
 * Add a new task to a specific week
 * @param {number} week - Week number (1-12)
 * @param {string} taskName - Name of the task to add
 * @param {string} responsibleTeam - Team responsible for the task
 */
export async function addTask(week, taskName, responsibleTeam) {
  try {
    // Read the current progress tracker
    const progressData = JSON.parse(fs.readFileSync(progressTrackerPath, 'utf8'));
    
    // Find the week
    const weekData = progressData.weeks.find(w => w.week === week);
    if (!weekData) {
      console.error(`Week ${week} not found in progress tracker`);
      return false;
    }
    
    // Check if task already exists
    const existingTask = weekData.tasks.find(t => t.name === taskName);
    if (existingTask) {
      console.error(`Task "${taskName}" already exists in week ${week}`);
      return false;
    }
    
    // Add the new task
    const newTask = {
      name: taskName,
      status: 'pending',
      responsible_team: responsibleTeam,
      created_at: new Date().toISOString()
    };
    
    weekData.tasks.push(newTask);
    
    // Write the updated data back to the file
    fs.writeFileSync(progressTrackerPath, JSON.stringify(progressData, null, 2));
    
    console.log(`✅ Added task "${taskName}" to week ${week}`);
    return true;
  } catch (error) {
    console.error('Error adding task:', error);
    return false;
  }
}

/**
 * Get progress summary
 */
export async function getProgressSummary() {
  try {
    // Read the current progress tracker
    const progressData = JSON.parse(fs.readFileSync(progressTrackerPath, 'utf8'));
    
    const totalWeeks = progressData.weeks.length;
    const completedWeeks = progressData.weeks.filter(w => w.status === 'completed').length;
    const inProgressWeeks = progressData.weeks.filter(w => w.status === 'in-progress').length;
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    progressData.weeks.forEach(week => {
      totalTasks += week.tasks.length;
      completedTasks += week.tasks.filter(t => t.status === 'completed').length;
    });
    
    console.log('\n=== Axiom ID Project Progress Summary ===');
    console.log(`Project: ${progressData.project}`);
    console.log(`Timeline: ${progressData.timeline}`);
    console.log(`Start Date: ${progressData.start_date}`);
    console.log(`\nWeeks Progress:`);
    console.log(`  Total Weeks: ${totalWeeks}`);
    console.log(`  Completed Weeks: ${completedWeeks}`);
    console.log(`  In Progress Weeks: ${inProgressWeeks}`);
    console.log(`\nTasks Progress:`);
    console.log(`  Total Tasks: ${totalTasks}`);
    console.log(`  Completed Tasks: ${completedTasks}`);
    console.log(`  Progress: ${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`);
    
    // Show current week status
    const currentDate = new Date();
    const projectStartDate = new Date(progressData.start_date);
    const weeksSinceStart = Math.ceil((currentDate - projectStartDate) / (7 * 24 * 60 * 60 * 1000));
    const currentWeek = Math.min(weeksSinceStart, totalWeeks);
    
    if (currentWeek > 0 && currentWeek <= totalWeeks) {
      const currentWeekData = progressData.weeks.find(w => w.week === currentWeek);
      if (currentWeekData) {
        console.log(`\nCurrent Week (Week ${currentWeek}): ${currentWeekData.phase}`);
        console.log(`  Status: ${currentWeekData.status}`);
        console.log(`  Tasks:`);
        currentWeekData.tasks.forEach(task => {
          console.log(`    - ${task.name} (${task.status}) - ${task.responsible_team}`);
        });
      }
    }
    
    return {
      totalWeeks,
      completedWeeks,
      inProgressWeeks,
      totalTasks,
      completedTasks,
      progressPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  } catch (error) {
    console.error('Error getting progress summary:', error);
    return null;
  }
}

// If run directly, show progress summary
if (import.meta.url === `file://${process.argv[1]}`) {
  await getProgressSummary();
}