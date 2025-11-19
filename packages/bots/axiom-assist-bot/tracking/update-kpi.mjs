#!/usr/bin/env node

// update-kpi.mjs - Script to update KPI tracking
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kpiTrackerPath = path.join(__dirname, 'kpi-tracker.json');

/**
 * Update KPI value
 * @param {string} kpiName - Name of the KPI to update
 * @param {string} newValue - New value for the KPI
 */
export async function updateKPI(kpiName, newValue) {
  try {
    // Read the current KPI tracker
    const kpiData = JSON.parse(fs.readFileSync(kpiTrackerPath, 'utf8'));
    
    // Find the KPI
    const kpi = kpiData.kpis.find(k => k.name === kpiName);
    if (!kpi) {
      console.error(`KPI "${kpiName}" not found in KPI tracker`);
      return false;
    }
    
    // Update the KPI value
    kpi.current = newValue;
    kpi.last_updated = new Date().toISOString();
    
    // Write the updated data back to the file
    fs.writeFileSync(kpiTrackerPath, JSON.stringify(kpiData, null, 2));
    
    console.log(`✅ Updated KPI "${kpiName}" to: ${newValue}`);
    return true;
  } catch (error) {
    console.error('Error updating KPI:', error);
    return false;
  }
}

/**
 * Get KPI summary
 */
export async function getKPISummary() {
  try {
    // Read the current KPI tracker
    const kpiData = JSON.parse(fs.readFileSync(kpiTrackerPath, 'utf8'));
    
    console.log('\n=== Axiom ID Project KPI Summary ===');
    console.log(`Project: ${kpiData.project}`);
    console.log(`Tracking Start Date: ${kpiData.tracking_start_date}`);
    
    console.log('\nKPIs:');
    kpiData.kpis.forEach(kpi => {
      const achieved = checkTargetAchieved(kpi);
      console.log(`\n  ${kpi.name} (${kpi.category})`);
      console.log(`    Target: ${kpi.target}`);
      console.log(`    Current: ${kpi.current}`);
      console.log(`    Measurement Tool: ${kpi.measurement_tool}`);
      console.log(`    Last Updated: ${kpi.last_updated}`);
      console.log(`    Status: ${achieved ? '✅ Target Achieved' : '❌ Target Not Achieved'}`);
    });
    
    return kpiData.kpis;
  } catch (error) {
    console.error('Error getting KPI summary:', error);
    return null;
  }
}

/**
 * Check if a KPI target has been achieved
 * @param {object} kpi - KPI object
 * @returns {boolean} - Whether target is achieved
 */
function checkTargetAchieved(kpi) {
  try {
    // For percentage targets like "> 90%"
    if (kpi.target.startsWith('>')) {
      const targetValue = parseFloat(kpi.target.replace(/[^\d.]/g, ''));
      const currentValue = parseFloat(kpi.current.replace(/[^\d.]/g, ''));
      return currentValue > targetValue;
    }
    
    // For time targets like "< 3 seconds"
    if (kpi.target.startsWith('<')) {
      const targetValue = parseFloat(kpi.target.replace(/[^\d.]/g, ''));
      const currentValue = parseFloat(kpi.current.replace(/[^\d.]/g, ''));
      return currentValue < targetValue;
    }
    
    // For ratio targets like "> 4.5/5"
    if (kpi.target.includes('/')) {
      const targetParts = kpi.target.replace(/[^\d./]/g, '').split('/');
      const currentParts = kpi.current.replace(/[^\d./]/g, '').split('/');
      
      if (targetParts.length === 2 && currentParts.length === 2) {
        const targetRatio = parseFloat(targetParts[0]) / parseFloat(targetParts[1]);
        const currentRatio = parseFloat(currentParts[0]) / parseFloat(currentParts[1]);
        return currentRatio > targetRatio;
      }
    }
    
    // For simple equality checks
    return kpi.current === kpi.target;
  } catch (error) {
    console.warn(`Could not evaluate target for KPI "${kpi.name}":`, error);
    return false;
  }
}

/**
 * Generate KPI report
 */
export async function generateKPIReport() {
  try {
    const kpiData = JSON.parse(fs.readFileSync(kpiTrackerPath, 'utf8'));
    
    const totalKPIs = kpiData.kpis.length;
    const achievedKPIs = kpiData.kpis.filter(kpi => checkTargetAchieved(kpi)).length;
    
    console.log('\n=== Axiom ID Project KPI Report ===');
    console.log(`Project: ${kpiData.project}`);
    console.log(`Report Date: ${new Date().toISOString()}`);
    console.log(`Total KPIs: ${totalKPIs}`);
    console.log(`Achieved KPIs: ${achievedKPIs}`);
    console.log(`Success Rate: ${Math.round((achievedKPIs / totalKPIs) * 100)}%`);
    
    return {
      totalKPIs,
      achievedKPIs,
      successRate: Math.round((achievedKPIs / totalKPIs) * 100)
    };
  } catch (error) {
    console.error('Error generating KPI report:', error);
    return null;
  }
}

// If run directly, show KPI summary
if (import.meta.url === `file://${process.argv[1]}`) {
  await getKPISummary();
}