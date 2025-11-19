#!/usr/bin/env node

// cost-analysis.mjs - Cost analysis and tracking for new GCP services
import fs from 'fs';

class CostAnalysisManager {
  constructor() {
    this.costData = {
      "project": "axiom-id-project",
      "services": [
        {
          "name": "Cloud Run",
          "description": "ADK and MCP services",
          "cost_components": [
            {
              "component": "vCPU-seconds",
              "unit_cost": 0.0000240,
              "projected_monthly_usage": 500000,
              "projected_cost": 12.00
            },
            {
              "component": "Memory-seconds",
              "unit_cost": 0.0000031,
              "projected_monthly_usage": 1000000,
              "projected_cost": 3.10
            }
          ],
          "total_projected_cost": 15.10
        },
        {
          "name": "Cloud Tasks",
          "description": "Task queue for async processing",
          "cost_components": [
            {
              "component": "Tasks",
              "unit_cost": 0.0000004,
              "projected_monthly_usage": 100000,
              "projected_cost": 4.00
            }
          ],
          "total_projected_cost": 4.00
        },
        {
          "name": "Model Armor",
          "description": "Security for prompts/responses",
          "cost_components": [
            {
              "component": "SanitizeUserPrompt Requests",
              "unit_cost": 0.000015,
              "projected_monthly_usage": 50000,
              "projected_cost": 7.50
            },
            {
              "component": "SanitizeModelResponse Requests",
              "unit_cost": 0.000015,
              "projected_monthly_usage": 50000,
              "projected_cost": 7.50
            }
          ],
          "total_projected_cost": 15.00
        },
        {
          "name": "BigQuery AI",
          "description": "AI.CLASSIFY/AI.SCORE calls",
          "cost_components": [
            {
              "component": "AI.SCORE calls",
              "unit_cost": 0.00025,
              "projected_monthly_usage": 2000,
              "projected_cost": 5.00
            },
            {
              "component": "AI.CLASSIFY calls",
              "unit_cost": 0.00025,
              "projected_monthly_usage": 1000,
              "projected_cost": 2.50
            }
          ],
          "total_projected_cost": 7.50
        },
        {
          "name": "Jules",
          "description": "Development automation tool",
          "cost_components": [
            {
              "component": "Pro Plan Subscription",
              "unit_cost": 29.00,
              "projected_monthly_usage": 1,
              "projected_cost": 29.00
            }
          ],
          "total_projected_cost": 29.00
        },
        {
          "name": "Cloud Logging/Pub/Sub",
          "description": "Log ingestion and message delivery",
          "cost_components": [
            {
              "component": "Log ingestion",
              "unit_cost": 0.0000005,
              "projected_monthly_usage": 1000000,
              "projected_cost": 5.00
            },
            {
              "component": "Message Delivery",
              "unit_cost": 0.0000004,
              "projected_monthly_usage": 100000,
              "projected_cost": 4.00
            }
          ],
          "total_projected_cost": 9.00
        }
      ],
      "total_projected_monthly_cost": 83.60
    };
  }

  /**
   * Display cost analysis report
   */
  displayCostAnalysis() {
    console.log('=== Axiom ID Projected Cost Analysis ===\n');
    
    console.log(`Project: ${this.costData.project}`);
    console.log(`Total Projected Monthly Cost: $${this.costData.total_projected_monthly_cost.toFixed(2)}\n`);
    
    console.log('Service Breakdown:');
    this.costData.services.forEach((service, index) => {
      console.log(`\n${index + 1}. ${service.name}`);
      console.log(`   Description: ${service.description}`);
      console.log(`   Projected Cost: $${service.total_projected_cost.toFixed(2)}`);
      
      if (service.cost_components.length > 1) {
        console.log('   Cost Components:');
        service.cost_components.forEach(component => {
          console.log(`     - ${component.component}`);
          console.log(`       Unit Cost: $${component.unit_cost.toFixed(7)}`);
          console.log(`       Projected Usage: ${component.projected_monthly_usage.toLocaleString()}`);
          console.log(`       Projected Cost: $${component.projected_cost.toFixed(2)}`);
        });
      }
    });
  }

  /**
   * Get cost breakdown by service
   */
  getServiceCostBreakdown() {
    const breakdown = {};
    this.costData.services.forEach(service => {
      breakdown[service.name] = service.total_projected_cost;
    });
    return breakdown;
  }

  /**
   * Generate billing report template
   */
  generateBillingReportTemplate() {
    console.log('=== GCP Billing Report Template ===\n');
    
    console.log('Recommended GCP Billing Report Configuration:');
    console.log('Group by: Project, Service, and SKU');
    console.log('Filters: Current billing period');
    console.log('Metrics to track:');
    console.log('  - Total cost by service');
    console.log('  - Daily cost trends');
    console.log('  - Cost anomalies');
    console.log('  - Budget vs. actual spending');
    
    console.log('\nTable Format:');
    console.log('| Project | Service | SKU | Projected Cost | Notes |');
    console.log('|---------|---------|-----|----------------|-------|');
    
    this.costData.services.forEach(service => {
      service.cost_components.forEach(component => {
        console.log(`| ${this.costData.project} | ${service.name} | ${component.component} | $${component.projected_cost.toFixed(2)} | |`);
      });
    });
  }
}

// If run directly, display cost analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  const costManager = new CostAnalysisManager();
  
  // Check for command line arguments
  if (process.argv.includes('--breakdown')) {
    console.log(JSON.stringify(costManager.getServiceCostBreakdown(), null, 2));
  } else if (process.argv.includes('--report')) {
    costManager.generateBillingReportTemplate();
  } else {
    costManager.displayCostAnalysis();
  }
}

export default CostAnalysisManager;