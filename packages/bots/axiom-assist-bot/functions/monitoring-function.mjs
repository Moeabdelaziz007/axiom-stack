// functions/monitoring-function.mjs - Google Cloud Function for automated agent monitoring
import TaskService from '../task-service.mjs';
import FirestoreClient from '../firestore-client.mjs';
import AxiomChainInterface from '../axiom-chain-interface.mjs';

/**
 * Google Cloud Function to monitor agent discrepancies every 6 hours
 * This function is triggered by Cloud Scheduler
 * 
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
export async function monitorAgents(req, res) {
  try {
    console.log('🔍 Starting automated agent monitoring...');
    
    // Initialize required services
    const firestoreClient = new FirestoreClient();
    await firestoreClient.initialize();
    
    const axiomChainInterface = new AxiomChainInterface();
    const taskService = new TaskService();
    
    // Manually set the dependencies since we're not using the full initialization
    taskService.firestoreClient = firestoreClient;
    taskService.axiomChainInterface = axiomChainInterface;
    
    // Run the monitoring process
    const reports = await taskService.monitorAllAgentsForDiscrepancies();
    
    // Filter to only inconsistent reports
    const inconsistentReports = reports.filter(report => !report.isConsistent);
    
    console.log(`✅ Monitoring completed. Found ${inconsistentReports.length} agents with discrepancies.`);
    
    // Return success response
    res.status(200).json({
      success: true,
      message: `Monitoring completed. Found ${inconsistentReports.length} agents with discrepancies.`,
      timestamp: new Date().toISOString(),
      inconsistentAgents: inconsistentReports.length,
      totalAgents: reports.length
    });
  } catch (error) {
    console.error('❌ Error in monitoring function:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: 'Error occurred during monitoring',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// For local testing
if (import.meta.url === `file://${process.argv[1]}`) {
  // Simulate a request/response for local testing
  const req = {};
  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log(`Response [${this.statusCode}]:`, JSON.stringify(data, null, 2));
    }
  };
  
  monitorAgents(req, res);
}