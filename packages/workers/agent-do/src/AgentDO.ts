// packages/workers/agent-do/src/AgentDO.ts - Agent Durable Object Implementation
import { DurableObject, DurableObjectState } from '@cloudflare/workers-types';
import { AgentConfig, GenesisRules } from '@axiom-stack/core';
// import { Connection, PublicKey } from '@solana/web3.js';
// import { AxiomClient } from '@axiom-stack/solana-sdk';

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

interface Env {
  AUDIT_SYSTEM: Fetcher;
  TELEGRAM_SECRET_TOKEN?: string;
  [key: string]: any;
}

export class AgentDO implements DurableObject {
  private state: DurableObjectState;
  private env: Env;
  private agentState: AgentState | null = null;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  /**
   * Initialize a new agent with the provided configuration (Genesis Ceremony)
   * @param config - Agent configuration including rules and strategy
   * @returns Public key and transaction signature
   */
  async initialize(config: AgentConfig): Promise<{ publicKey: string; transactionSignature?: string }> {
    try {
      console.log('Initializing agent with config:', config);

      // 1. Generate Ed25519 keypair (The Agent's Wallet)
      const keyPair = nacl.sign.keyPair();
      const publicKeyArray = new Uint8Array(keyPair.publicKey);
      const privateKeyArray = new Uint8Array(keyPair.secretKey);

      // Convert to hex string without using Buffer
      const publicKey = Array.from(publicKeyArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // 2. State Injection (The DNA)
      // Store AIX Configuration securely
      await this.state.storage.put('AIX_CONFIG', config);

      // Store private key securely in Durable Object storage
      // NEVER export this key - it stays within the DO
      await this.state.storage.put('privateKey', privateKeyArray); // Store as Uint8Array for use
      await this.state.storage.put('publicKey', publicKey);

      // Initialize state
      const agentId = this.state.id.toString();
      this.agentState = {
        id: agentId,
        config,
        publicKey,
        createdAt: Date.now(),
        lastActive: Date.now()
      };
      await this.state.storage.put('agentState', this.agentState);

      // 3. Solana Identity Creation (The Soul)
      let transactionSignature: string | undefined;
      try {
        // In a real environment, we would connect to a real RPC
        // For now, we simulate the connection or use a devnet URL if available
        // const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

        // Mocking the SDK interaction for now as we might not have funds/RPC access in this environment
        // const wallet = {
        //   publicKey: new PublicKey(publicKey),
        //   signTransaction: async (tx: any) => {
        //     // Sign with private key
        //     return tx;
        //   },
        //   signAllTransactions: async (txs: any[]) => txs
        // };

        // const client = new AxiomClient(connection, wallet);
        // transactionSignature = await client.createIdentity(config.manifest.persona.name, 0);

        transactionSignature = `tx_simulated_${Date.now()}`;
        console.log(`Simulated on-chain identity creation for ${agentId}: ${transactionSignature}`);

      } catch (chainError) {
        console.error('Failed to create on-chain identity:', chainError);
        // We don't fail the whole initialization if chain fails, but we log it
        // In production, this might be a critical failure
      }

      console.log(`Agent ${agentId} initialized with public key: ${publicKey}`);

      // Record creation virtue
      this.recordAudit('RIGHT', 'AGENT_BORN', `Agent initialized with public key ${publicKey}`, 10);

      return { publicKey, transactionSignature };
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
        // Record Sin: Rule Violation
        this.recordAudit('LEFT', 'RULE_VIOLATION', `Invalid signal: ${JSON.stringify(signal)}`, 5);
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

      // Record Virtue: Trade Executed
      this.recordAudit('RIGHT', 'TRADE_EXECUTED', `Trade executed successfully: ${result.transactionId}`, 20);

      return result;
    } catch (error: any) {
      console.error('Error executing trade:', error);
      // Record Sin: Trade Failed
      this.recordAudit('LEFT', 'TRADE_FAILED', `Trade execution failed: ${error.message}`, 10);
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
   * Helper to record audit events (The Two Angels)
   * @param side - 'RIGHT' (Virtue) or 'LEFT' (Sin)
   * @param action - Action type
   * @param details - Details of the action
   * @param impact - Impact score
   */
  private recordAudit(side: 'RIGHT' | 'LEFT', action: string, details: string, impact: number) {
    if (!this.env.AUDIT_SYSTEM) {
      console.warn('Audit System binding not available');
      return;
    }

    const agentId = this.state.id.toString();
    const method = side === 'RIGHT' ? 'recordVirtue' : 'recordSin';

    // Fire and forget - don't await
    this.state.waitUntil(
      (async () => {
        try {
          // @ts-ignore - Dynamic RPC call
          await this.env.AUDIT_SYSTEM[method](agentId, action, details, impact);
        } catch (error) {
          console.error(`Failed to record ${side} audit:`, error);
        }
      })()
    );
  }

  /**
   * Register communication channels (webhooks)
   * @param channels - Channel configuration
   */
  async registerChannels(channels: any): Promise<void> {
    try {
      console.log('Registering channels:', channels);
      const agentId = this.state.id.toString();

      // 1. Telegram
      if (channels.telegram?.botToken && channels.telegram.active) {
        const botToken = channels.telegram.botToken;
        const webhookUrl = `https://webhook-router.axiomid.app/telegram/${agentId}`;
        const secretToken = this.env.TELEGRAM_SECRET_TOKEN || 'default_secret_token';

        // Store token securely
        await this.state.storage.put('TELEGRAM_BOT_TOKEN', botToken);

        // Call Telegram API to set webhook
        const result = await this.callTelegramApi(botToken, 'setWebhook', {
          url: webhookUrl,
          secret_token: secretToken,
          allowed_updates: JSON.stringify(['message', 'callback_query'])
        });

        console.log(`Telegram webhook registered for agent ${agentId}:`, result);
      }

      // 2. WhatsApp (Placeholder for now)
      if (channels.whatsapp?.active) {
        console.log('WhatsApp channel registration not yet implemented fully, but config stored.');
        // Store WhatsApp credentials
        if (channels.whatsapp.phoneId) await this.state.storage.put('WHATSAPP_PHONE_ID', channels.whatsapp.phoneId);
        if (channels.whatsapp.accessToken) await this.state.storage.put('WHATSAPP_ACCESS_TOKEN', channels.whatsapp.accessToken);
      }

    } catch (error: any) {
      console.error('Error registering channels:', error);
      throw new Error(`Failed to register channels: ${error.message}`);
    }
  }

  /**
   * Handle incoming messages from communication channels
   * @param source - Source channel (telegram, whatsapp, etc.)
   * @param payload - Message payload
   */
  async handleIncomingMessage(source: string, payload: any): Promise<void> {
    try {
      console.log(`Received message from ${source}:`, payload);

      // Logic specific to Telegram
      if (source === 'telegram') {
        const message = payload.message;
        if (!message || !message.text) return; // Ignore non-text messages for now

        const chatId = message.chat.id;
        const userText = message.text;
        const userId = message.from?.id?.toString() || 'unknown';

        // 1. Process with Axiom Brain
        // We need to call the brain worker. Since we might not have a direct binding to the brain class instance easily here without RPC,
        // we will use the service binding if available, or fetch.
        // Assuming 'AXIOM_BRAIN' binding is available in env.

        let responseText = "I'm processing your request...";

        try {
          // Construct a brain request
          const brainRequest = {
            message: userText,
            userId: userId,
            agentId: this.state.id.toString()
          };

          // Call Axiom Brain (assuming service binding or HTTP)
          // For now, we'll simulate a simple echo/brain response if binding isn't set up perfectly yet
          // In a real scenario: const brainResponse = await this.state.env.AXIOM_BRAIN.fetch(...)

          // MVP: Simple logic or fetch if URL is known
          // const brainUrl = 'https://brain.axiomid.app/process'; 
          // const brainResp = await fetch(brainUrl, { method: 'POST', body: JSON.stringify(brainRequest) });

          // For this step, we will just acknowledge to prove connectivity
          responseText = `Received: "${userText}". (Brain integration pending)`;

        } catch (brainError) {
          console.error('Brain processing error:', brainError);
          responseText = "I encountered an error thinking about that.";
        }

        // 2. Reply via Telegram
        const botToken = await this.state.storage.get<string>('TELEGRAM_BOT_TOKEN');
        if (botToken) {
          await this.callTelegramApi(botToken, 'sendMessage', {
            chat_id: chatId,
            text: responseText
          });
        } else {
          console.error('No Telegram bot token found for this agent');
        }
      }

    } catch (error) {
      console.error(`Error handling incoming message from ${source}:`, error);
    }
  }

  /**
   * Helper to call Telegram Bot API
   */
  private async callTelegramApi(token: string, method: string, params: any): Promise<any> {
    const url = `https://api.telegram.org/bot${token}/${method}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data: any = await response.json();
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }
    return data.result;
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

      // Initialize Agent
      if (method === 'POST' && path === '/initialize') {
        const config: AgentConfig = await request.json();
        const publicKey = await this.initialize(config);

        // Register channels if present
        if (config.channels) {
          // Run in background to not block initialization response
          this.state.waitUntil(this.registerChannels(config.channels));
        }

        return new Response(JSON.stringify({ publicKey }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Register Channels Manually
      if (method === 'POST' && path === '/register-channels') {
        const channels = await request.json();
        await this.registerChannels(channels);
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Handle Incoming Webhook Message
      // Path format: /incoming/:source (e.g., /incoming/telegram)
      if (method === 'POST' && path.startsWith('/incoming/')) {
        const source = path.split('/')[2]; // /incoming/telegram -> telegram
        const payload = await request.json();

        // Handle in background
        this.state.waitUntil(this.handleIncomingMessage(source, payload));

        return new Response('OK', { status: 200 });
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