// orchestrator.mjs - The central nervous system coordinating Human and Body
import HumanMind from './mind/human-mind.mjs';
import SystemBody from './body/system-body.mjs';
import GemManager from './gems/GemManager.mjs';
import PineconeClient from './pinecone-client.mjs';
import FirestoreClient from './firestore-client.mjs';
import TaskService from './task-service.mjs';
import AxiomChainInterface from './axiom-chain-interface.mjs';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import SecretManagerService from './secret-manager-service.mjs'; // Import the secret manager service
import { Webhooks, createNodeMiddleware } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";

class AxiomOrchestrator {
  constructor() {
    this.humanMind = new HumanMind();
    this.systemBody = new SystemBody();
    this.gemManager = new GemManager();
    this.taskService = new TaskService();
    this.axiomChainInterface = new AxiomChainInterface();
    this.running = false;
    
    // Initialize Express app and HTTP server for callbacks
    this.app = express();
    this.server = createServer(this.app);
    this.app.use(express.json());
    
    // Store pending tasks
    this.pendingTasks = new Map();
    
    // Metrics tracking
    this.metrics = {
      tasksRouted: 0,
      capabilitiesUsed: {},
      taskPriorities: {},
      unrecognizedTasks: 0,
      compositeTasks: 0,
      startTime: Date.now()
    };
    
    // 1. Initialize GitHub Webhook Verifier
    this.githubWebhooks = new Webhooks({
      secret: process.env.GITHUB_WEBHOOK_SECRET || 'temp_secret'
    });

    // 2. Add listeners for GitHub events
    this.setupGitHubWebhookListeners();
    
    // 3. Setup the new endpoint
    this.setupWebhookEndpoint();
    
    // Set up callback endpoint for ADK agents
    this.setupCallbackEndpoint();
    
    // Set up metrics endpoint
    this.setupMetricsEndpoint();
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Axiom Orchestrator...');
      
      // NEW STEP: Load secrets before initializing other components
      const secretManager = new SecretManagerService();
      await secretManager.loadSecrets();
      
      // Initialize the System Body
      await this.systemBody.initialize();
      
      // Initialize the Task Service
      await this.taskService.initialize();
      
      // Set initial goals for the Human Mind
      this.humanMind.setGoals([
        "Enhance developer experience with Axiom ID",
        "Expand the Axiom ID ecosystem with new use cases",
        "Improve system reliability and performance",
        "Foster community growth and contributions"
      ]);
      
      console.log('✅ Axiom Orchestrator initialized successfully');
    } catch (error) {
      console.error('Error initializing Axiom Orchestrator:', error);
      throw error;
    }
  }

  setupCallbackEndpoint() {
    // Endpoint for ADK agents to send results back
    this.app.post('/adk-callback', (req, res) => {
      try {
        const { taskId, result, status, error, agentId } = req.body;
        
        console.log(`Received callback for task ${taskId} with status: ${status}`);
        
        // Find the pending task
        const task = this.pendingTasks.get(taskId);
        if (!task) {
          console.warn(`No pending task found for ID: ${taskId}`);
          return res.status(404).json({ error: 'Task not found' });
        }
        
        // Remove task from pending tasks
        this.pendingTasks.delete(taskId);
        
        // Process the result
        if (status === 'completed') {
          // Send result to the client via Socket.io
          if (task.socket) {
            task.socket.emit('agent_speaks_response', {
              text: result,
              timestamp: new Date().toISOString()
            });
          }
          
          // Update agent reputation on successful task completion
          this.updateAgentReputation(agentId, 5); // Award 5 reputation points for successful completion
        } else if (status === 'error') {
          // Send error to the client via Socket.io
          if (task.socket) {
            task.socket.emit('agent_error', {
              message: 'ADK Agent encountered an error while processing your request.',
              error: error || 'Unknown error'
            });
          }
          
          // Deduct reputation points for failed task execution
          this.updateAgentReputation(agentId, -2); // Deduct 2 reputation points for failure
        }
        
        res.status(200).json({ message: 'Callback received successfully' });
      } catch (error) {
        console.error('Error processing ADK callback:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', pendingTasks: this.pendingTasks.size });
    });
  }
  
  setupMetricsEndpoint() {
    // Metrics endpoint
    this.app.get('/metrics', (req, res) => {
      // Calculate uptime
      const uptime = Date.now() - this.metrics.startTime;
      
      // Add current pending tasks to metrics
      const metrics = {
        ...this.metrics,
        pendingTasks: this.pendingTasks.size,
        uptime: Math.floor(uptime / 1000) // in seconds
      };
      
      res.json(metrics);
    });
  }

  // --- ADD THIS NEW METHOD ---
  setupWebhookEndpoint() {
    // We use the raw body for signature verification
    this.app.post(
      '/api/v1/github-webhook', 
      createNodeMiddleware(this.githubWebhooks)
    );
    console.log('✅ GitHub Webhook Endpoint listening at /api/v1/github-webhook');
  }

  // --- ADD THIS NEW METHOD ---
  setupGitHubWebhookListeners() {
    
    // Listen for new Pull Requests or when new commits are pushed
    this.githubWebhooks.on(["pull_request.opened", "pull_request.synchronize"], async ({ id, name, payload }) => {
      console.log(`[GitHub Webhook] Received: ${name} (ID: ${id})`);
      
      const pr = payload.pull_request;
      const repo = payload.repository;
      
      try {
        // --- TASK 1: Dispatch Vulnerability Scan ---
        // NOTE: The VulnerabilityScanPower requires a local path.
        // We'll skip this for now until we build a "cloning" power.
        console.log("[GitHub Webhook] Skipping vulnerability_scan (requires repo cloning logic).");
        
        // --- TASK 2: Dispatch Code Review ---
        const diff = await this.getPRDiff(repo.owner.login, repo.name, pr.number);
        
        const reviewPayload = {
          diff: diff,
          repo_full_name: repo.full_name,
          pr_number: pr.number,
          github_token: process.env.GITHUB_BOT_TOKEN,
          gemini_api_key: process.env.GEMINI_API_KEY // Assumes this is loaded
        };

        // Dispatch the code_review task to an available agent
        await this.taskService.createAgentTask(
          reviewPayload, 
          "code_review" // The name of the new superpower
        );

      } catch (error) {
        console.error(`[GitHub Webhook] Failed to dispatch tasks for PR #${pr.number}:`, error);
      }
    });

    // We can add listeners for failed builds here later
    // this.githubWebhooks.on("workflow_run.completed", async ({ payload }) => { ... });
  }

  /**
   * Update agent reputation on the blockchain
   * @param {string} agentId - Unique identifier for the agent
   * @param {number} reputationChange - Change in reputation score (positive or negative)
   */
  async updateAgentReputation(agentId, reputationChange) {
    try {
      console.log(`Updating reputation for agent ${agentId} by ${reputationChange} points`);
      
      // Load the payer keypair from the Solana wallet
      const keypairPath = process.env.SOLANA_WALLET_PATH || '/Users/cryptojoker710/.config/solana/id.json';
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      const payerKeypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));
      
      // Update agent reputation on the blockchain
      const signature = await this.axiomChainInterface.updateAgentReputation(
        agentId, 
        reputationChange, 
        payerKeypair
      );
      
      console.log(`✅ Updated agent ${agentId} reputation by ${reputationChange} points on the blockchain with signature: ${signature}`);
    } catch (error) {
      console.error(`Error updating reputation for agent ${agentId}:`, error);
    }
  }

  startCallbackServer() {
    const port = process.env.CALLBACK_PORT || 3002;
    this.server.listen(port, () => {
      console.log(`📞 Callback server running on port ${port}`);
    });
  }

  async runCycle() {
    try {
      console.log('🔄 Starting orchestration cycle...');
      
      // Get current system status
      const systemStatus = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        pendingTasks: this.pendingTasks.size
        // Add more status metrics as needed
      };
      
      // Have the Human Mind think about current situation
      const thoughts = await this.humanMind.think({
        systemStatus,
        currentTime: new Date().toISOString()
      });
      
      console.log('💭 Human Mind Thoughts:');
      console.log(thoughts);
      
      // Based on thoughts, determine actions
      // This is a simplified example - in practice, you'd parse the thoughts
      // and extract actionable items
      
      // Perform routine body functions
      await this.performRoutineTasks();
      
      console.log('✅ Orchestration cycle completed');
    } catch (error) {
      console.error('Error in orchestration cycle:', error);
    }
  }

  async performRoutineTasks() {
    // Example routine tasks
    console.log('⚙️ Performing routine system tasks...');
    
    // In a real implementation, this would call various automated functions
    // on the System Body based on instructions from the Human Mind
  }

  async handleUserQuery(question) {
    try {
      console.log(`💬 Handling user query: ${question}`);
      
      // First, try to route to a specialized Gem
      const gemResponse = await this.gemManager.routeRequest(question);
      
      // If the Gem provides a useful response, return it
      if (gemResponse && !gemResponse.includes('Sorry, I encountered an error')) {
        return gemResponse;
      }
      
      // Fallback to the System Body for general queries
      console.log('🔮 No suitable Gem found, falling back to System Body');
      const response = await this.systemBody.processQuery(question);
      
      return response;
    } catch (error) {
      console.error('Error handling user query:', error);
      throw error;
    }
  }

  /**
   * Determine the required capability for a given task using enhanced NLP-based classification
   * @param {string} taskDescription - Description of the task
   * @returns {string|null} The required capability or null if not determined
   */
  determineRequiredCapability(taskDescription) {
    // Enhanced capability detection using keyword weighting, context analysis, and phrase matching
    const capabilityKeywords = {
      'web_scraping': [
        { keyword: 'scrap', weight: 1.0 },
        { keyword: 'web page', weight: 1.0 },
        { keyword: 'website', weight: 0.8 },
        { keyword: 'url', weight: 0.9 },
        { keyword: 'crawl', weight: 1.0 },
        { keyword: 'extract', weight: 0.7 },
        { keyword: 'fetch', weight: 0.6 },
        { keyword: 'download', weight: 0.5 },
        { keyword: 'get content from', weight: 1.0 },
        { keyword: 'pull data from', weight: 1.0 }
      ],
      'text_analysis': [
        { keyword: 'analyze', weight: 1.0 },
        { keyword: 'text', weight: 0.8 },
        { keyword: 'content', weight: 0.7 },
        { keyword: 'document', weight: 0.8 },
        { keyword: 'paragraph', weight: 0.6 },
        { keyword: 'summarize', weight: 0.9 },
        { keyword: 'sentiment', weight: 0.9 },
        { keyword: 'keywords', weight: 0.8 },
        { keyword: 'classify', weight: 0.8 },
        { keyword: 'extract insights', weight: 1.0 }
      ],
      'get_weather': [
        { keyword: 'weather', weight: 1.0 },
        { keyword: 'temperature', weight: 0.9 },
        { keyword: 'forecast', weight: 1.0 },
        { keyword: 'climate', weight: 0.7 },
        { keyword: 'rain', weight: 0.8 },
        { keyword: 'sunny', weight: 0.6 },
        { keyword: 'cloudy', weight: 0.6 },
        { keyword: 'conditions', weight: 0.7 }
      ],
      'example': [
        { keyword: 'example', weight: 1.0 },
        { keyword: 'sample', weight: 0.8 },
        { keyword: 'demo', weight: 0.9 }
      ]
    };
    
    const lowerDescription = taskDescription.toLowerCase();
    
    // Calculate scores for each capability
    const capabilityScores = {};
    
    for (const [capability, keywords] of Object.entries(capabilityKeywords)) {
      let score = 0;
      for (const { keyword, weight } of keywords) {
        // Check for exact phrase matches first
        if (lowerDescription.includes(keyword)) {
          score += weight;
        }
      }
      capabilityScores[capability] = score;
    }
    
    // Find the capability with the highest score
    let bestCapability = null;
    let highestScore = 0;
    
    for (const [capability, score] of Object.entries(capabilityScores)) {
      if (score > highestScore) {
        highestScore = score;
        bestCapability = capability;
      }
    }
    
    // Log the scoring for debugging
    console.log(`Capability scoring for task: "${taskDescription}"`, capabilityScores);
    
    // Only return a capability if we have a reasonable confidence score
    return highestScore >= 0.6 ? bestCapability : null;
  }

  /**
   * Determine if a task requires multiple capabilities (composite task)
   * @param {string} taskDescription - Description of the task
   * @returns {Array|null} Array of capabilities or null if not a composite task
   */
  determineCompositeCapabilities(taskDescription) {
    // Enhanced heuristic: if the task description contains "and" or "then", it might be composite
    // Also check for sequential task indicators
    const lowerDescription = taskDescription.toLowerCase();
    
    // Check for composite task indicators
    const compositeIndicators = [' and ', ' then ', ' after ', ' followed by ', ' next '];
    const hasCompositeIndicator = compositeIndicators.some(indicator => lowerDescription.includes(indicator));
    
    if (hasCompositeIndicator) {
      // Try to identify multiple capabilities in order
      const capabilities = [];
      
      // Split the task description into parts based on composite indicators
      const parts = lowerDescription.split(/ and | then | after | followed by | next /);
      
      // For each part, determine the capability
      for (const part of parts) {
        const capability = this.determineRequiredCapability(part);
        if (capability) {
          capabilities.push(capability);
        }
      }
      
      // Return capabilities if we found more than one
      return capabilities.length > 1 ? capabilities : null;
    }
    
    return null;
  }

  /**
   * Create a task for an ADK agent with capability-based routing
   * @param {Object} payload - The task payload
   * @param {string} taskDescription - Description of the task to determine capability
   * @returns {Promise<string>} The created task name
   */
  async createAgentTask(payload, taskDescription) {
    try {
      // First check if this is a composite task
      const compositeCapabilities = this.determineCompositeCapabilities(taskDescription);
      
      if (compositeCapabilities) {
        console.log(`Routing composite task with capabilities: ${compositeCapabilities.join(', ')}`);
        // Generate a unique task ID for tracking
        const taskId = `composite-${Date.now()}`;
        
        // For composite tasks, we need to split the payload
        // This is a simplified approach - in a real implementation, you might want
        // to analyze the task description to determine how to split the payload
        const payloads = compositeCapabilities.map(() => payload);
        
        // Handle the composite task
        const results = await this.handleCompositeTask(compositeCapabilities, payloads, taskId);
        
        // Return a special identifier for composite tasks
        return `composite-task-${taskId}`;
      }
      
      // Determine the required capability for this task
      const requiredCapability = this.determineRequiredCapability(taskDescription);
      
      // Determine task priority
      const taskPriority = this.determineTaskPriority(taskDescription, payload.metadata || {});
      console.log(`Task priority determined as: ${taskPriority}/10`);
      
      // Configuration
      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'axiom-id-project';
      const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
      const queue = process.env.GOOGLE_CLOUD_TASKS_QUEUE || 'axiom-agent-queue';
      const serviceAccountEmail = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT || 'axiom-agent@axiom-id-project.iam.gserviceaccount.com';
      const agentServiceUrl = process.env.AGENT_SERVICE_URL || 'https://axiom-agent-service-abc123.a.run.app/run';
      
      // If a specific capability is required, use the task service to route to an agent with that capability
      if (requiredCapability) {
        console.log(`Routing task to agent with capability: ${requiredCapability}`);
        
        // Update metrics
        this.metrics.tasksRouted++;
        
        // Update capability usage metrics
        if (this.metrics.capabilitiesUsed[requiredCapability]) {
          this.metrics.capabilitiesUsed[requiredCapability]++;
        } else {
          this.metrics.capabilitiesUsed[requiredCapability] = 1;
        }
        
        // Update task priority metrics
        const taskPriority = this.determineTaskPriority(taskDescription, payload.metadata || {});
        if (this.metrics.taskPriorities[taskPriority]) {
          this.metrics.taskPriorities[taskPriority]++;
        } else {
          this.metrics.taskPriorities[taskPriority] = 1;
        }
        
        return await this.taskService.createAgentTask(
          payload,
          requiredCapability,
          serviceAccountEmail,
          agentServiceUrl,
          projectId,
          location,
          queue
        );
      } else {
        // Handle unrecognized capabilities with human-in-the-loop classification
        console.log('Unrecognized capability, initiating fallback mechanism');
        await this.handleUnrecognizedCapability(taskDescription, payload);
        
        // Update metrics
        this.metrics.tasksRouted++;
        
        // For now, we still route to the default agent but in a production environment,
        // this might wait for human classification
        const parent = this.taskService.client.queuePath(projectId, location, queue);
        
        // Convert payload to Base64
        const body = Buffer.from(JSON.stringify(payload)).toString('base64');

        const task = {
          httpRequest: {
            httpMethod: 'POST',
            url: agentServiceUrl,
            headers: { 'Content-Type': 'application/json' },
            body: body,
            // Use OIDC for secure authentication
            oidcToken: {
              serviceAccountEmail: serviceAccountEmail,
            },
          },
        };

        // Send the task
        const [response] = await this.taskService.client.createTask({parent, task});
        console.log(`Created task ${response.name}`);
        return response.name;
      }
    } catch (error) {
      console.error('Error creating agent task:', error);
      throw error;
    }
  }

  // Method to register a task and associate it with a socket
  registerTask(taskId, socket) {
    this.pendingTasks.set(taskId, { socket, timestamp: Date.now() });
    console.log(`Registered task ${taskId}`);
  }

  /**
   * Handle unrecognized capabilities with human-in-the-loop classification
   * @param {string} taskDescription - Description of the task
   * @param {Object} payload - Task payload
   * @returns {Promise<void>}
   */
  async handleUnrecognizedCapability(taskDescription, payload) {
    try {
      console.log(`Unrecognized capability for task: ${taskDescription}`);
      
      // Update metrics
      this.metrics.unrecognizedTasks++;
      
      // In a production environment, this would send the task to a human operator
      // for classification. For now, we'll log it for manual review.
      
      // Emit to socket if available for human review
      for (const [taskId, task] of this.pendingTasks) {
        if (task.socket) {
          task.socket.emit('unrecognized_capability', {
            taskDescription,
            payload,
            timestamp: new Date().toISOString(),
            message: 'Human review needed for capability classification'
          });
        }
      }
      
      // Log for manual review
      console.log('HUMAN REVIEW NEEDED:', {
        taskDescription,
        payload,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error handling unrecognized capability:', error);
    }
  }

  /**
   * Handle composite tasks that require multiple capabilities
   * @param {Array} capabilities - Array of capability names
   * @param {Array} payloads - Array of payloads for each capability
   * @param {string} taskId - The task ID for tracking
   * @returns {Promise<Array>} Array of results from each capability
   */
  async handleCompositeTask(capabilities, payloads, taskId) {
    try {
      console.log(`Handling composite task with ${capabilities.length} capabilities`);
      
      // Update metrics
      this.metrics.compositeTasks++;
      
      const results = [];
      let previousResult = null;
      
      // Execute each capability in sequence, piping output from one to the next
      for (let i = 0; i < capabilities.length; i++) {
        const capability = capabilities[i];
        let payload = payloads[i] || {};
        
        console.log(`Executing capability ${i+1}/${capabilities.length}: ${capability}`);
        
        // Update capability usage metrics
        if (this.metrics.capabilitiesUsed[capability]) {
          this.metrics.capabilitiesUsed[capability]++;
        } else {
          this.metrics.capabilitiesUsed[capability] = 1;
        }
        
        // If this is not the first capability and we have a previous result, 
        // pipe it into the current payload
        if (previousResult && i > 0) {
          payload = {
            ...payload,
            inputFromPreviousTask: previousResult,
            previousCapability: capabilities[i-1]
          };
        }
        
        // Find an agent with the required capability
        const agent = await this.taskService.findAgentWithCapability(capability);
        
        if (!agent) {
          throw new Error(`No agent found with capability: ${capability}`);
        }
        
        // Configuration
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'axiom-id-project';
        const location = process.env.GOOGLE_CLOUD_REGION || 'us-central1';
        const queue = process.env.GOOGLE_CLOUD_TASKS_QUEUE || 'axiom-agent-queue';
        const serviceAccountEmail = process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT || 'axiom-agent@axiom-id-project.iam.gserviceaccount.com';
        
        // Create task for this capability
        const taskName = await this.taskService.createAgentTask(
          { ...payload, taskId: `${taskId}-${i}`, sequence: i },
          capability,
          serviceAccountEmail,
          agent.cloudRunUrl,
          projectId,
          location,
          queue
        );
        
        console.log(`Created sub-task ${taskName} for capability ${capability}`);
        
        // In a real implementation, we would wait for the result from the previous task
        // before proceeding. For now, we'll simulate this with a placeholder.
        previousResult = `Result from ${capability} task`;
        results.push({ capability, taskName, result: previousResult });
      }
      
      return results;
    } catch (error) {
      console.error('Error handling composite task:', error);
      throw error;
    }
  }

  /**
   * Determine task priority based on business criticality and user importance
   * @param {string} taskDescription - Description of the task
   * @param {Object} metadata - Additional metadata about the task
   * @returns {number} Priority level (1-10, where 10 is highest priority)
   */
  determineTaskPriority(taskDescription, metadata = {}) {
    let priority = 5; // Default priority
    
    // Check for high-priority keywords
    const highPriorityKeywords = [
      'urgent', 'asap', 'emergency', 'critical', 'important',
      'immediately', 'now', 'priority', 'vip', 'executive'
    ];
    
    const lowerDescription = taskDescription.toLowerCase();
    
    for (const keyword of highPriorityKeywords) {
      if (lowerDescription.includes(keyword)) {
        priority += 2;
      }
    }
    
    // Check for low-priority keywords
    const lowPriorityKeywords = [
      'whenever', 'later', 'eventually', 'nice to have', 'optional'
    ];
    
    for (const keyword of lowPriorityKeywords) {
      if (lowerDescription.includes(keyword)) {
        priority -= 2;
      }
    }
    
    // Adjust based on user importance if provided
    if (metadata.userRole === 'admin' || metadata.userRole === 'executive') {
      priority += 3;
    } else if (metadata.userRole === 'premium') {
      priority += 1;
    } else if (metadata.userRole === 'guest') {
      priority -= 1;
    }
    
    // Adjust based on business impact
    const businessImpactKeywords = [
      'revenue', 'customer', 'client', 'sales', 'marketing',
      'product', 'launch', 'release', 'bug', 'issue'
    ];
    
    for (const keyword of businessImpactKeywords) {
      if (lowerDescription.includes(keyword)) {
        priority += 1;
      }
    }
    
    // Ensure priority is within bounds
    return Math.max(1, Math.min(10, priority));
  }

  // --- ADD THIS NEW HELPER METHOD ---
  async getPRDiff(owner, repo, pullNumber) {
    // This helper uses the GitHub API to get the .diff file for the PR
    const octokit = new Octokit({ auth: process.env.GITHUB_BOT_TOKEN });
  
    const { data: diff } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
      mediaType: {
        format: "diff" // We request the diff format
      }
    });
  
    return diff;
  }

  start() {
    if (this.running) {
      console.log('Orchestrator is already running');
      return;
    }
    
    this.running = true;
    console.log('▶️ Axiom Orchestrator started');
    
    // Start the callback server
    this.startCallbackServer();
    
    // Run cycles periodically
    setInterval(async () => {
      await this.runCycle();
    }, 30000); // Run every 30 seconds
  }

  stop() {
    this.running = false;
    console.log('⏹️ Axiom Orchestrator stopped');
    
    // Close the server
    this.server.close();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new AxiomOrchestrator();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    orchestrator.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    orchestrator.stop();
    process.exit(0);
  });
  
  // Initialize and start
  orchestrator.initialize()
    .then(() => {
      orchestrator.start();
    })
    .catch(error => {
      console.error('Failed to start orchestrator:', error);
      process.exit(1);
    });
}

export default AxiomOrchestrator;