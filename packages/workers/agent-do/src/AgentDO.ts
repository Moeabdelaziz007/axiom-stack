// packages/workers/agent-do/src/AgentDO.ts - Agent Durable Object Implementation
import { DurableObject, DurableObjectState } from '@cloudflare/workers-types';
import { AgentConfig, GenesisRules } from '@axiom-stack/core';

// Import tweetnacl for keypair generation
import nacl from 'tweetnacl';

// Types
interface AgentState {
  id: string;
  config: AgentConfig;
  publicKey: string;
  createdAt: number;
  lastActive: number;
}

export class AgentDO implements DurableObject {
  private state: DurableObjectState;
  private agentState: AgentState | null = null;

  constructor(state: DurableObjectState) {
    this.state = state;
  }

  /**
   * Initialize a new agent with the provided configuration
   * @param config - Agent configuration including rules and strategy
   * @returns Public key of the newly created agent
   */
  async initialize(config: AgentConfig): Promise<string> {
    try {
      console.log('Initializing agent with config:', config);
      
      // Generate Ed25519 keypair
      const keyPair = nacl.sign.keyPair();
      const publicKeyArray = new Uint8Array(keyPair.publicKey);
      const privateKeyArray = new Uint8Array(keyPair.secretKey);
      
      // Convert to hex string without using Buffer
      const publicKey = Array.from(publicKeyArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      const privateKey = Array.from(privateKeyArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Create agent state
      const agentId = this.state.id.toString();
      this.agentState = {
        id: agentId,
        config,
        publicKey,
        createdAt: Date.now(),
        lastActive: Date.now()
      };
      
      // Store private key securely in Durable Object storage
      // NEVER export this key - it stays within the DO
      await this.state.storage.put('privateKey', privateKey);
      
      // Store agent state
      await this.state.storage.put('agentState', this.agentState);
      
      console.log(`Agent ${agentId} initialized with public key: ${publicKey}`);
      
      // Return only the public key
      return publicKey;
    } catch (error: any) {
      console.error('Error initializing agent:', error);
      throw new Error('Failed to initialize agent');
    }
  }

  /**
   * Execute a trade based on a signal
   * @param signal - Trade signal with details
   * @returns Result of the trade execution
   */
  async executeTrade(signal: any): Promise<any> {
    try {
      // Load agent state if not already loaded
      if (!this.agentState) {
        const storedState = await this.state.storage.get<AgentState>('agentState');
        this.agentState = storedState ?? null;
        if (!this.agentState) {
          throw new Error('Agent not initialized');
        }
      }
      
      console.log(`Executing trade for agent ${this.agentState.id}:`, signal);
      
      // Update last active timestamp
      this.agentState.lastActive = Date.now();
      await this.state.storage.put('agentState', this.agentState);
      
      // Validate signal against genesis rules
      const isValid = this.validateSignal(signal);
      if (!isValid) {
        throw new Error('Invalid trade signal');
      }
      
      // Retrieve private key for signing
      const privateKey = await this.state.storage.get<string>('privateKey');
      if (!privateKey) {
        throw new Error('Private key not found');
      }
      
      // Log the decision
      await this.logDecision(signal, 'executeTrade');
      
      // TODO: Implement actual trade execution logic
      // This would involve:
      // 1. Creating transaction instructions
      // 2. Signing with the stored private key
      // 3. Submitting to Solana network
      
      // For now, return a mock result
      const result = {
        success: true,
        transactionId: `tx_${Date.now()}`,
        timestamp: Date.now(),
        signal,
        agentId: this.agentState.id
      };
      
      return result;
    } catch (error: any) {
      console.error('Error executing trade:', error);
      throw new Error(`Failed to execute trade: ${error.message || String(error)}`);
    }
  }

  /**
   * Get the current state of the agent
   * @returns Agent state
   */
  async getState(): Promise<AgentState | null> {
    if (!this.agentState) {
      const storedState = await this.state.storage.get<AgentState>('agentState');
      this.agentState = storedState ?? null;
    }
    return this.agentState;
  }

  /**
   * Validate trade signal against genesis rules
   * @param signal - Trade signal to validate
   * @returns Whether the signal is valid
   */
  private validateSignal(signal: any): boolean {
    if (!this.agentState || !this.agentState.config.rules) {
      return true; // No rules to validate against
    }
    
    const rules: GenesisRules = this.agentState.config.rules;
    
    // Check token allowlist/denylist
    if (rules.tokenAllowlist && signal.token) {
      if (!rules.tokenAllowlist.includes(signal.token)) {
        console.warn(`Token ${signal.token} not in allowlist`);
        return false;
      }
    }
    
    if (rules.tokenDenylist && signal.token) {
      if (rules.tokenDenylist.includes(signal.token)) {
        console.warn(`Token ${signal.token} in denylist`);
        return false;
      }
    }
    
    // Check max position size
    if (rules.maxPositionSize && signal.amount) {
      if (signal.amount > rules.maxPositionSize) {
        console.warn(`Position size ${signal.amount} exceeds max ${rules.maxPositionSize}`);
        return false;
      }
    }
    
    return true;
  }

  /**
   * Log decision for audit and debugging
   * @param context - Context that influenced the decision
   * @param action - Action taken
   */
  private async logDecision(context: any, action: string): Promise<void> {
    try {
      const decisionLog = {
        traceId: `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId: this.agentState?.id || 'unknown',
        timestamp: Date.now(),
        reasoning: `Executing ${action} based on received signal`,
        context,
        action,
        confidenceScore: 0.8, // Mock confidence score
        riskAssessment: 'low', // Mock risk assessment
        snapshot: this.agentState?.config || {}
      };
      
      // Store decision log
      const logKey = `decision_${Date.now()}`;
      await this.state.storage.put(logKey, decisionLog);
      
      console.log(`Decision logged for agent ${this.agentState?.id}:`, decisionLog);
    } catch (error) {
      console.error('Error logging decision:', error);
    }
  }

  /**
   * Handle HTTP requests to the Durable Object
   * This allows external interaction with the agent
   */
  async fetch(request: Request): Promise<Response> {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;
      
      if (method === 'POST' && path === '/initialize') {
        const config: AgentConfig = await request.json();
        const publicKey = await this.initialize(config);
        return new Response(JSON.stringify({ publicKey }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'POST' && path === '/execute-trade') {
        const signal = await request.json();
        const result = await this.executeTrade(signal);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (method === 'GET' && path === '/state') {
        const state = await this.getState();
        return new Response(JSON.stringify(state), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response('Not Found', { status: 404 });
    } catch (error: any) {
      console.error('Error handling request:', error);
      return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}