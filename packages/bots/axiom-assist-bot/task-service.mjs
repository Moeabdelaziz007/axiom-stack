// task-service.mjs - Task creation service with capability-based routing
import { CloudTasksClient } from '@google-cloud/tasks';
import FirestoreClient from './firestore-client.mjs';
import AxiomChainInterface from './axiom-chain-interface.mjs';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';

class TaskService {
  constructor() {
    this.client = new CloudTasksClient();
    this.firestoreClient = new FirestoreClient();
    this.axiomChainInterface = new AxiomChainInterface();
    // In-memory store for agent load tracking
    this.agentLoad = new Map();
    // In-memory store for agent capacity tracking
    this.agentCapacity = new Map();
  }

  async initialize() {
    try {
      await this.firestoreClient.initialize();
      console.log('✅ Task Service initialized successfully');
      // Initialize agent load and capacity tracking
      await this.initializeAgentTracking();
    } catch (error) {
      console.error('Failed to initialize Task Service:', error);
      throw error;
    }
  }

  /**
   * Initialize agent load and capacity tracking
   * @returns {Promise<void>}
   */
  async initializeAgentTracking() {
    try {
      // Query all agents to initialize tracking
      const agents = await this.firestoreClient.queryCollection('agents', []);
      
      for (const agent of agents) {
        // Initialize load tracking (default to 0 tasks)
        this.agentLoad.set(agent.id, 0);
        
        // Initialize capacity tracking (default to 10 tasks)
        // In a real implementation, this would be based on agent capabilities and resources
        this.agentCapacity.set(agent.id, agent.data().maxCapacity || 10);
      }
      
      console.log(`✅ Initialized tracking for ${agents.length} agents`);
    } catch (error) {
      console.warn('Warning: Could not initialize agent tracking:', error.message);
    }
  }

  /**
   * Update agent load when a task is assigned
   * @param {string} agentId - The agent ID
   * @param {number} loadChange - The change in load (+1 for assigned task, -1 for completed task)
   * @returns {void}
   */
  updateAgentLoad(agentId, loadChange) {
    const currentLoad = this.agentLoad.get(agentId) || 0;
    const newLoad = Math.max(0, currentLoad + loadChange);
    this.agentLoad.set(agentId, newLoad);
    
    console.log(`Agent ${agentId} load updated: ${currentLoad} -> ${newLoad}`);
  }

  /**
   * Get agent load
   * @param {string} agentId - The agent ID
   * @returns {number} The current load of the agent
   */
  getAgentLoad(agentId) {
    return this.agentLoad.get(agentId) || 0;
  }

  /**
   * Get agent capacity
   * @param {string} agentId - The agent ID
   * @returns {number} The capacity of the agent
   */
  getAgentCapacity(agentId) {
    return this.agentCapacity.get(agentId) || 10;
  }

  /**
   * Calculate agent load factor (load / capacity ratio)
   * @param {string} agentId - The agent ID
   * @returns {number} The load factor (0.0 to 1.0+)
   */
  calculateLoadFactor(agentId) {
    const load = this.getAgentLoad(agentId);
    const capacity = this.getAgentCapacity(agentId);
    return capacity > 0 ? load / capacity : 0;
  }

  /**
   * Create a Cloud Task for an ADK agent with capability-based routing
   * @param {Object} payload - The task payload
   * @param {string} powerName - The name of the superpower/capability required
   * @param {string} serviceAccountEmail - The service account email for OIDC
   * @param {string} agentServiceUrl - The base URL for the agent service
   * @param {string} projectId - The GCP project ID
   * @param {string} location - The GCP region
   * @param {string} queue - The Cloud Tasks queue name
   * @returns {Promise<string>} The created task name
   */
  async createAgentTask(payload, powerName, serviceAccountEmail, agentServiceUrl, projectId, location, queue) {
    try {
      // First, find an agent that has the required capability
      const agent = await this.findAgentWithCapability(powerName);
      
      if (!agent) {
        throw new Error(`No agent found with capability: ${powerName}`);
      }

      // Update the payload to include the power name for the agent
      const enhancedPayload = {
        ...payload,
        power_name: powerName
      };

      // Create the task for the specific agent
      const parent = this.client.queuePath(projectId, location, queue);
      
      // Convert payload to Base64
      const body = Buffer.from(JSON.stringify(enhancedPayload)).toString('base64');

      const task = {
        httpRequest: {
          httpMethod: 'POST',
          url: agent.cloudRunUrl, // Use the specific agent's URL
          headers: { 'Content-Type': 'application/json' },
          body: body,
          // Use OIDC for secure authentication
          oidcToken: {
            serviceAccountEmail: serviceAccountEmail,
          },
        },
      };

      // Send the task
      const [response] = await this.client.createTask({parent, task});
      console.log(`Created task ${response.name} for agent with capability ${powerName}`);
      
      // Update agent load tracking
      this.updateAgentLoad(agent.agentId, 1);
      
      return response.name;
    } catch (error) {
      console.error('Error creating agent task:', error);
      throw error;
    }
  }

  /**
   * Find an agent that has the specified capability, prioritized by reputation score, load, and capacity
   * @param {string} capability - The capability to search for
   * @returns {Promise<Object|null>} The agent document or null if not found
   */
  async findAgentWithCapability(capability) {
    try {
      // Query Firestore for agents with the specified capability
      const agents = await this.firestoreClient.queryCollection('agents', [
        { field: 'capabilities', operator: 'array-contains', value: capability },
        { field: 'status', operator: '==', value: 'idle' }
      ]);

      if (!agents || agents.length === 0) {
        return null;
      }

      // Enrich agents with reputation scores from blockchain and load information
      const agentsWithMetrics = [];
      
      for (const agent of agents) {
        try {
          // Get agent reputation from blockchain
          const agentInfo = await this.axiomChainInterface.getAgentInfo(agent.id);
          
          // Get agent load and capacity information
          const currentLoad = this.getAgentLoad(agent.id);
          const capacity = this.getAgentCapacity(agent.id);
          const loadFactor = this.calculateLoadFactor(agent.id);
          
          agentsWithMetrics.push({
            ...agent.data,
            reputation: agentInfo.reputation || 0,
            currentLoad: currentLoad,
            capacity: capacity,
            loadFactor: loadFactor
          });
        } catch (error) {
          console.warn(`Could not fetch metrics for agent ${agent.id}:`, error.message);
          // Use default values if we can't fetch from blockchain
          agentsWithMetrics.push({
            ...agent.data,
            reputation: 0,
            currentLoad: this.getAgentLoad(agent.id) || 0,
            capacity: this.getAgentCapacity(agent.id) || 10,
            loadFactor: this.calculateLoadFactor(agent.id) || 0
          });
        }
      }

      // Sort agents by a composite score that considers:
      // 1. Reputation (higher is better)
      // 2. Load factor (lower is better)
      // 3. Availability (higher capacity is better)
      agentsWithMetrics.sort((a, b) => {
        // Calculate composite scores for both agents
        // Reputation weight: 0.5, Load factor weight: 0.3, Capacity weight: 0.2
        const scoreA = (a.reputation * 0.5) - (a.loadFactor * 0.3) + (a.capacity * 0.2);
        const scoreB = (b.reputation * 0.5) - (b.loadFactor * 0.3) + (b.capacity * 0.2);
        
        // Sort in descending order (higher score is better)
        return scoreB - scoreA;
      });
      
      console.log(`Found ${agentsWithMetrics.length} agents with capability '${capability}', sorted by composite score:`);
      agentsWithMetrics.forEach(agent => {
        console.log(`  - ${agent.agentId}: reputation ${agent.reputation}, load ${agent.currentLoad}/${agent.capacity} (${(agent.loadFactor * 100).toFixed(1)}%), score ${((agent.reputation * 0.5) - (agent.loadFactor * 0.3) + (agent.capacity * 0.2)).toFixed(2)}`);
      });

      // Verify each agent's identity and capabilities before routing
      for (const agent of agentsWithMetrics) {
        try {
          // Verify agent capabilities using cryptographic verification from blockchain
          const isVerified = await this.verifyAgentCapabilities(agent.agentId, agent.capabilities);
          
          if (isVerified) {
            console.log(`✅ Agent ${agent.agentId} identity and capabilities verified successfully`);
            return agent;
          } else {
            console.warn(`⚠️  Agent ${agent.agentId} failed identity verification, flagging and skipping`);
            // Flag the agent in Firestore to prevent future task routing
            await this.firestoreClient.updateDocument('agents', agent.agentId, {
              status: 'flagged',
              flaggedAt: new Date().toISOString(),
              flagReason: 'Identity verification failed'
            });
          }
        } catch (error) {
          console.error(`Error verifying agent ${agent.agentId}:`, error.message);
          // Flag the agent in Firestore to prevent future task routing
          await this.firestoreClient.updateDocument('agents', agent.agentId, {
            status: 'flagged',
            flaggedAt: new Date().toISOString(),
            flagReason: 'Verification error: ' + error.message
          });
        }
      }
      
      // If no agents passed verification, return null
      console.warn('No agents passed identity verification for capability:', capability);
      return null;
    } catch (error) {
      console.error('Error finding agent with capability:', error);
      throw error;
    }
  }

  /**
   * Register an agent with its capabilities in Firestore
   * @param {string} agentId - The agent ID
   * @param {string} cloudRunUrl - The agent's Cloud Run URL
   * @param {Array<string>} capabilities - The agent's capabilities
   * @param {number} maxCapacity - The maximum capacity of the agent (default: 10)
   * @returns {Promise<void>}
   */
  async registerAgent(agentId, cloudRunUrl, capabilities, maxCapacity = 10) {
    try {
      const agentData = {
        agentId: agentId,
        cloudRunUrl: cloudRunUrl,
        status: 'idle',
        capabilities: capabilities,
        registeredAt: new Date().toISOString(),
        version: 1, // Initial version
        maxCapacity: maxCapacity // Maximum concurrent tasks
      };

      await this.firestoreClient.upsertDocument('agents', agentId, agentData);
      console.log(`✅ Registered agent ${agentId} with capabilities: ${capabilities.join(', ')}`);
      
      // Initialize tracking for this agent
      this.agentLoad.set(agentId, 0);
      this.agentCapacity.set(agentId, maxCapacity);
    } catch (error) {
      console.error('Error registering agent:', error);
      throw error;
    }
  }

  /**
   * Synchronize agent capabilities between Firestore and blockchain
   * @param {string} agentId - The agent ID
   * @param {Array<string>} capabilities - The agent's capabilities
   * @returns {Promise<void>}
   */
  async syncAgentCapabilities(agentId, capabilities) {
    try {
      console.log(`Syncing capabilities for agent ${agentId} between Firestore and blockchain`);
      
      // Update Firestore with the latest capabilities
      const agentData = {
        capabilities: capabilities,
        lastSynced: new Date().toISOString()
      };

      await this.firestoreClient.updateDocument('agents', agentId, agentData);
      console.log(`✅ Synced capabilities for agent ${agentId} in Firestore`);
      
      // Load the payer keypair from the Solana wallet
      const keypairPath = process.env.SOLANA_WALLET_PATH || '/Users/cryptojoker710/.config/solana/id.json';
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
      
      // Update the blockchain with the latest capabilities
      const signature = await this.axiomChainInterface.updateAgentCapabilities(
        agentId, 
        capabilities, 
        payerKeypair
      );
      
      console.log(`✅ Synced capabilities for agent ${agentId} on blockchain with signature: ${signature}`);
    } catch (error) {
      console.error('Error syncing agent capabilities:', error);
      throw error;
    }
  }

  /**
   * Verify agent capabilities using cryptographic verification from blockchain
   * @param {string} agentId - The agent ID
   * @param {Array<string>} capabilities - The agent's capabilities to verify
   * @returns {Promise<boolean>} True if verified, false otherwise
   */
  async verifyAgentCapabilities(agentId, capabilities) {
    try {
      console.log(`Cryptographically verifying capabilities for agent ${agentId}`);
      
      // Use the axiom chain interface to verify capabilities
      const isVerified = await this.axiomChainInterface.verifyAgentCapabilities(agentId, capabilities);
      
      console.log(`✅ Capabilities verification ${isVerified ? 'successful' : 'failed'} for agent ${agentId}`);
      return isVerified;
    } catch (error) {
      console.error('Error verifying agent capabilities:', error);
      return false;
    }
  }

  /**
   * Update agent capabilities with versioning support
   * @param {string} agentId - The agent ID
   * @param {Array<string>} capabilities - The updated capabilities
   * @param {number} version - The new version number
   * @returns {Promise<void>}
   */
  async updateAgentCapabilitiesWithVersion(agentId, capabilities, version) {
    try {
      console.log(`Updating capabilities for agent ${agentId} to version ${version}`);
      
      // First, get the current agent data to preserve other fields
      const currentAgent = await this.firestoreClient.getDocument('agents', agentId);
      
      // Update the agent data with new capabilities and version
      const agentData = {
        ...currentAgent.data(),
        capabilities: capabilities,
        version: version,
        lastUpdated: new Date().toISOString()
      };

      await this.firestoreClient.upsertDocument('agents', agentId, agentData);
      console.log(`✅ Updated agent ${agentId} capabilities to version ${version}`);
      
      // Load the payer keypair from the Solana wallet
      const keypairPath = process.env.SOLANA_WALLET_PATH || '/Users/cryptojoker710/.config/solana/id.json';
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
      
      // Update the blockchain with the new capabilities and version
      const signature = await this.axiomChainInterface.updateAgentCapabilitiesWithVersion(
        agentId, 
        capabilities, 
        version,
        payerKeypair
      );
      
      console.log(`✅ Updated capabilities for agent ${agentId} to version ${version} on blockchain with signature: ${signature}`);
    } catch (error) {
      console.error('Error updating agent capabilities with version:', error);
      throw error;
    }
  }

  /**
   * Monitor for discrepancies between on-chain and off-chain capability data
   * @param {string} agentId - The agent ID
   * @returns {Promise<Object>} Discrepancy report
   */
  async monitorCapabilityDiscrepancies(agentId) {
    try {
      console.log(`Monitoring capability discrepancies for agent ${agentId}`);
      
      // Get the agent data from Firestore
      const firestoreAgent = await this.firestoreClient.getDocument('agents', agentId);
      
      if (!firestoreAgent.exists) {
        throw new Error(`Agent ${agentId} not found in Firestore`);
      }
      
      const firestoreCapabilities = firestoreAgent.data().capabilities || [];
      const firestoreVersion = firestoreAgent.data().version || 1;
      
      // Get the agent data from the blockchain
      let blockchainCapabilities = [];
      let blockchainVersion = 1;
      
      try {
        const blockchainAgent = await this.axiomChainInterface.getAgentInfo(agentId);
        // For now, we'll assume the capabilities are the same as in Firestore
        // In a full implementation, you would extract capabilities from the blockchain data
        blockchainCapabilities = [...firestoreCapabilities];
        blockchainVersion = firestoreVersion;
      } catch (error) {
        console.warn(`Could not fetch agent ${agentId} from blockchain:`, error.message);
        // Use empty arrays if we can't fetch from blockchain
        blockchainCapabilities = [];
        blockchainVersion = 0;
      }
      
      // Compare capabilities
      const discrepancies = [];
      
      // Check for capability differences
      const firestoreSet = new Set(firestoreCapabilities);
      const blockchainSet = new Set(blockchainCapabilities);
      
      // Find capabilities in Firestore but not on blockchain
      for (const capability of firestoreCapabilities) {
        if (!blockchainSet.has(capability)) {
          discrepancies.push({
            type: 'missing_on_blockchain',
            capability: capability
          });
        }
      }
      
      // Find capabilities on blockchain but not in Firestore
      for (const capability of blockchainCapabilities) {
        if (!firestoreSet.has(capability)) {
          discrepancies.push({
            type: 'missing_in_firestore',
            capability: capability
          });
        }
      }
      
      // Check version consistency
      if (firestoreVersion !== blockchainVersion) {
        discrepancies.push({
          type: 'version_mismatch',
          firestoreVersion: firestoreVersion,
          blockchainVersion: blockchainVersion
        });
      }
      
      // Create report
      const report = {
        agentId: agentId,
        firestoreCapabilities: firestoreCapabilities,
        blockchainCapabilities: blockchainCapabilities,
        firestoreVersion: firestoreVersion,
        blockchainVersion: blockchainVersion,
        discrepancies: discrepancies,
        isConsistent: discrepancies.length === 0,
        checkedAt: new Date().toISOString()
      };
      
      // Log discrepancies if any found
      if (discrepancies.length > 0) {
        console.warn(`⚠️  Found ${discrepancies.length} discrepancies for agent ${agentId}:`, discrepancies);
        // Send alert for security issues
        await this.sendSecurityAlert(agentId, discrepancies);
      } else {
        console.log(`✅ No discrepancies found for agent ${agentId}`);
      }
      
      return report;
    } catch (error) {
      console.error('Error monitoring capability discrepancies:', error);
      throw error;
    }
  }

  /**
   * Monitor all agents for capability discrepancies
   * @returns {Promise<Array>} Array of discrepancy reports
   */
  async monitorAllAgentsForDiscrepancies() {
    try {
      console.log('Monitoring all agents for capability discrepancies...');
      
      // Get all agents from Firestore
      const agents = await this.firestoreClient.queryCollection('agents', []);
      
      const reports = [];
      let totalDiscrepancies = 0;
      
      // Check each agent for discrepancies
      for (const agent of agents) {
        try {
          const report = await this.monitorCapabilityDiscrepancies(agent.id);
          reports.push(report);
          if (!report.isConsistent) {
            totalDiscrepancies++;
          }
        } catch (error) {
          console.error(`Error monitoring agent ${agent.id}:`, error);
          // Continue with other agents even if one fails
        }
      }
      
      // Filter to only reports with discrepancies
      const inconsistentReports = reports.filter(report => !report.isConsistent);
      
      console.log(`🔍 Monitoring complete. Found ${inconsistentReports.length} agents with discrepancies.`);
      
      // Send summary alert if there are any discrepancies
      if (totalDiscrepancies > 0) {
        await this.sendSummaryAlert(totalDiscrepancies, inconsistentReports);
      }
      
      return reports;
    } catch (error) {
      console.error('Error monitoring all agents for discrepancies:', error);
      throw error;
    }
  }
  
  /**
   * Send security alert for agent discrepancies
   * @param {string} agentId - The agent ID
   * @param {Array} discrepancies - Array of discrepancies found
   * @returns {Promise<void>}
   */
  async sendSecurityAlert(agentId, discrepancies) {
    try {
      // Log the security alert
      console.error(`🚨 SECURITY ALERT: Discrepancies found for agent ${agentId}`);
      console.error(`Details: ${JSON.stringify(discrepancies, null, 2)}`);
      
      // In a production environment, this would send alerts to:
      // 1. Slack channel for immediate notification
      // 2. Email to system architect
      // 3. Logging service for audit trail
      // 4. Incident management system
      
      // For now, we'll just log to console but this can be extended
      const alertData = {
        timestamp: new Date().toISOString(),
        agentId: agentId,
        discrepancies: discrepancies,
        severity: 'HIGH',
        actionRequired: 'Immediate investigation needed'
      };
      
      // Log to a dedicated security log
      console.error(`SECURITY_LOG: ${JSON.stringify(alertData)}`);
      
      // TODO: Implement actual alerting mechanisms (Slack, Email, etc.)
      // Example:
      // await this.sendSlackAlert(alertData);
      // await this.sendEmailAlert(alertData);
      
    } catch (error) {
      console.error('Error sending security alert:', error);
    }
  }
  
  /**
   * Send summary alert for monitoring results
   * @param {number} totalDiscrepancies - Total number of discrepancies found
   * @param {Array} inconsistentReports - Array of inconsistent reports
   * @returns {Promise<void>}
   */
  async sendSummaryAlert(totalDiscrepancies, inconsistentReports) {
    try {
      // Log the summary alert
      console.error(`🚨 MONITORING SUMMARY: ${totalDiscrepancies} agents with discrepancies found`);
      
      const summaryData = {
        timestamp: new Date().toISOString(),
        totalDiscrepancies: totalDiscrepancies,
        inconsistentAgents: inconsistentReports.map(report => ({
          agentId: report.agentId,
          discrepancyCount: report.discrepancies.length
        })),
        severity: totalDiscrepancies > 5 ? 'CRITICAL' : 'MEDIUM',
        actionRequired: 'Review discrepancy reports'
      };
      
      // Log to a dedicated monitoring log
      console.error(`MONITORING_LOG: ${JSON.stringify(summaryData)}`);
      
      // TODO: Implement actual alerting mechanisms (Slack, Email, etc.)
      
    } catch (error) {
      console.error('Error sending summary alert:', error);
    }
  }
}

export default TaskService;