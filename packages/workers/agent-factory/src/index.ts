// packages/workers/agent-factory/src/index.ts - Agent Factory Worker Entry Point (Nano Banana Architecture)
import { Hono } from 'hono';
import { AGENT_TEMPLATES } from '@axiom-stack/core';
import type { AgentConfig, GenesisRules, SpawnRequest } from '@axiom-stack/core';
import { AIXValidator } from './aix-validator';
import { QuantumSynchronizer } from './QuantumSynchronizer';
import { SkillExecutor } from '../../tool-executor/src/SkillExecutor';
import type { Mission } from './types';
import { generateAgentDNA } from './utils/gemini-generator';

// Initialize Hono app with CORS middleware
const app = new Hono();

// Add CORS middleware
app.use('*', async (c, next) => {
  c.res.headers.set('Access-Control-Allow-Origin', '*');
  c.res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }

  await next();
});

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID Agent Factory (Nano Banana Architecture)',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /generate-agent-dna endpoint - Voice Agent Factory (Gemini-powered)
app.post('/generate-agent-dna', async (c: any) => {
  try {
    const { transcript, userPreferences } = await c.req.json();

    if (!transcript || transcript.trim() === '') {
      return c.json({ error: 'Transcript is required' }, 400);
    }

    // Get Gemini API key from environment
    const geminiApiKey = c.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return c.json({ error: 'Gemini API key not configured' }, 500);
    }

    console.log(`🎤 Generating agent DNA from voice: "${transcript.substring(0, 50)}..."`);

    // Generate DNA using Gemini
    const agentDNA = await generateAgentDNA(
      { transcript, userPreferences },
      geminiApiKey
    );

    console.log(`✅ Generated DNA for: ${agentDNA.agentName} (${agentDNA.ticker})`);

    return c.json({
      success: true,
      agentDNA,
      message: `Agent DNA generated for ${agentDNA.agentName}`
    });

  } catch (error: any) {
    console.error('Error generating agent DNA:', error);
    return c.json({
      success: false,
      error: error.message || 'Failed to generate agent DNA'
    }, 500);
  }
});

// POST /spawn endpoint - Creates a new agent
app.post('/spawn', async (c: any) => {
  try {
    const { type, config, archetype } = await c.req.json();

    // 1. Validate AIX Protocol (Genesis Validator)
    try {
      // Get Archetype Template if provided
      let templateConfig: Partial<AgentConfig> = {};
      let allowedTools: string[] = [];

      if (archetype && AGENT_TEMPLATES[archetype as keyof typeof AGENT_TEMPLATES]) {
        const template = AGENT_TEMPLATES[archetype as keyof typeof AGENT_TEMPLATES];
        console.log(`Spawning ${template.role} Agent with ${template.allowedTools.length} allowed tools.`);

        templateConfig = {
          manifest: {
            ...config.manifest,
            persona: {
              ...config.manifest?.persona,
              role: template.role,
              systemPrompt: template.systemPrompt
            }
          }
        };
        allowedTools = [...template.allowedTools];
      }

      // Construct full AIX-compliant config
      const fullConfig: AgentConfig = {
        manifest: {
          id: `temp_${Date.now()}`,
          type: type,
          publicKey: '',
          createdAt: Date.now(),
          status: 'active' as const,
          persona: {
            name: 'Default Agent',
            description: '',
            tone: 'neutral',
            risk_tolerance: 'medium' as const,
            ...config.manifest?.persona,
            ...templateConfig.manifest?.persona
          },
          capabilities: config.manifest?.capabilities || [],
          genesis_rules: config.manifest?.genesis_rules || {
            stop_loss_pct: 0.05,
            max_slippage: 0.01,
            allowlist: []
          },
          knowledge_base: config.manifest?.knowledge_base || {
            sources: [],
            grounding_required: true
          },
          // Inject allowed tools into metadata or capabilities
          allowedTools: allowedTools
        },
        strategy: config.strategy
      };

      // Strict Validation: Rules #1-5
      AIXValidator.validate(fullConfig);

      // 2. Initialize Durable Object (Genesis Ceremony)
      const agentId = c.env.AGENT_DO.newUniqueId();
      const agentStub = c.env.AGENT_DO.get(agentId);

      const initResponse = await agentStub.fetch('http://agent-do/initialize', {
        method: 'POST',
        body: JSON.stringify(fullConfig)
      });

      if (!initResponse.ok) {
        throw new Error('Failed to initialize Agent Durable Object');
      }

      const { publicKey, transactionSignature } = await initResponse.json();

      // 3. Return Full Agent Profile
      return c.json({
        success: true,
        agentId: agentId.toString(),
        publicKey,
        transactionSignature,
        message: `Agent '${fullConfig.manifest.persona.name}' created successfully via Genesis Protocol`,
        aixCompliance: true,
        profile: fullConfig.manifest
      });

    } catch (validationError: any) {
      return c.json({ error: validationError.message }, 400);
    }
  } catch (error: any) {
    console.error('Error spawning agent:', error);
    return c.json({ error: 'Failed to create agent: ' + error.message }, 500);
  }
});

// POST /orchestrate endpoint - Orchestrate agent actions using Nano Banana architecture
app.post('/orchestrate', async (c: any) => {
  try {
    const { agentId, action, payload }: { agentId: string; action: string; payload: any } = await c.req.json();

    // Validate required fields
    if (!agentId || !action) {
      return c.json({ error: 'Missing required fields: agentId and action' }, 400);
    }

    console.log(`Orchestrating action ${action} for agent ${agentId}`);

    // In the Nano Banana architecture, orchestration happens through Service Bindings
    // This provides sub-5ms latency for internal agent communications

    // Orchestration Logic
    let resultPayload = null;

    if (action === 'generate_content') {
      const { ContentAgent } = await import('./agents/content-agent');
      const agent = new ContentAgent({
        systemPrompt: payload.systemPrompt || 'You are a helpful assistant',
        tools: payload.tools || [],
        apiKeys: {
          gemini: c.env.GEMINI_API_KEY
        }
      });

      const content = await agent.generateContent(payload.topic, payload.platform);
      resultPayload = { content };
    } else {
      // Default/Mock behavior for other actions
      resultPayload = { message: `Action ${action} simulated` };
    }

    const result = {
      agentId,
      action,
      status: 'orchestrated',
      timestamp: Date.now(),
      data: resultPayload,
      message: `Action ${action} orchestrated successfully for agent ${agentId}`
    };

    return c.json(result);
  } catch (error: any) {
    console.error('Error orchestrating agent action:', error);
    return c.json({ error: 'Failed to orchestrate agent action' }, 500);
  }
});

// POST /execute-mission endpoint - Execute agent missions using QuantumSynchronizer
app.post('/execute-mission', async (c: any) => {
  try {
    const { agentDNA, mission }: { agentDNA: any; mission: Mission } = await c.req.json();

    // Validate required fields
    if (!agentDNA || !mission) {
      return c.json({ error: 'Missing required fields: agentDNA and mission' }, 400);
    }

    console.log(`🌀 Executing mission: ${mission.objective}`);
    console.log(`Agent has ${agentDNA.skills_manifest?.length || 0} skills equipped`);

    // Initialize QuantumSynchronizer with SkillExecutor
    const skillExecutor = new SkillExecutor();
    const synchronizer = new QuantumSynchronizer(skillExecutor);

    // Execute the mission
    const result = await synchronizer.orchestrate(agentDNA, mission);

    console.log(`✅ Mission ${result.status} in ${result.totalExecutionTime}ms`);

    return c.json({
      ...result,
      message: `Mission executed: ${result.status}`
    });

  } catch (error: any) {
    console.error('Error executing mission:', error);
    return c.json({
      status: 'FAILED',
      error: error.message || 'Failed to execute mission'
    }, 500);
  }
});

// POST /deploy endpoint - Securely deploy agent with signature verification, payment check, and persistence
app.post('/deploy', async (c: any) => {
  try {
    const { dna, signature, paymentProof, authType } = await c.req.json();

    if (!dna || !signature) {
      return c.json({ error: 'Missing required fields: dna and signature' }, 400);
    }

    // 1. Verify Payment (The Cash Register)
    if (!paymentProof && authType !== 'admin') { // Allow admin bypass
      return c.json({ error: 'Payment required. Please complete payment first.' }, 402);
    }

    if (paymentProof) {
      console.log(`💰 Verifying payment: ${paymentProof.provider} - ${paymentProof.id}`);
      // In production, verify with Stripe/PayPal API
      // if (paymentProof.provider === 'stripe') await stripe.paymentIntents.retrieve(paymentProof.id);
      // if (paymentProof.provider === 'paypal') await paypal.orders.get(paymentProof.id);
    }

    // 2. Verify Identity (The Neural Link)
    try {
      if (authType === 'wallet') {
        const { default: nacl } = await import('tweetnacl');
        const { default: bs58 } = await import('bs58');

        const publicKeyBytes = bs58.decode(dna.owner);
        const signatureBytes = bs58.decode(signature);
        const messageBytes = new TextEncoder().encode(JSON.stringify(dna));

        const verified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
        if (!verified) throw new Error('Invalid wallet signature');

      } else if (authType === 'firebase') {
        // Verify Firebase ID Token (Mock for now, use firebase-admin in prod)
        if (signature !== 'firebase_verified') throw new Error('Invalid Firebase token');
        console.log('✅ Verified Firebase User:', dna.owner);
      } else {
        throw new Error('Unsupported auth type');
      }
    } catch (sigError: any) {
      console.error('Identity verification error:', sigError);
      return c.json({ error: 'Identity verification failed: ' + sigError.message }, 401);
    }

    // 3. Persist to D1 (Axiom Brain DB)
    try {
      await c.env.DB.prepare(
        `INSERT INTO agents (id, owner, template_id, dna, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        dna.id,
        dna.owner,
        dna.templateId,
        JSON.stringify(dna),
        'active',
        Date.now(),
        Date.now()
      ).run();
    } catch (dbError: any) {
      // Ignore unique constraint error if retrying
      if (!dbError.message.includes('UNIQUE constraint failed')) {
        throw dbError;
      }
    }

    // 4. Initialize Durable Object (Genesis Ceremony)
    const agentId = c.env.AGENT_DO.idFromString(dna.id); // Use deterministic ID from DNA if possible, or newUniqueId
    // Note: dna.id is generated by frontend. To map to DO, we can use idFromName if we want stable IDs, or just store the mapping.
    // For now, we'll use the frontend ID as the DO ID if it's a valid hex string, otherwise we might need to hash it.
    // Actually, idFromString requires a 64-char hex string.
    // Let's use idFromName to ensure we get a valid DO ID based on the agent ID string.
    const doId = c.env.AGENT_DO.idFromName(dna.id);
    const agentStub = c.env.AGENT_DO.get(doId);

    const initResponse = await agentStub.fetch('http://agent-do/initialize', {
      method: 'POST',
      body: JSON.stringify({
        manifest: {
          ...dna,
          publicKey: dna.owner // Map owner to publicKey for DO
        },
        strategy: 'standard'
      })
    });

    if (!initResponse.ok) {
      throw new Error('Failed to initialize Agent Durable Object');
    }

    return c.json({
      success: true,
      agentId: dna.id,
      doId: doId.toString(),
      message: 'Agent deployed and verified successfully'
    });

  } catch (error: any) {
    console.error('Error deploying agent:', error);
    return c.json({ error: 'Failed to deploy agent: ' + error.message }, 500);
  }
});

// POST /message endpoint - Route incoming messages to Agent DO with Logging (The Black Box)
app.post('/message', async (c: any) => {
  try {
    const payload = await c.req.json();
    const { agentId, source, message } = payload;

    if (!agentId || !source) {
      return c.json({ error: 'Missing required fields: agentId and source' }, 400);
    }

    // Log to D1 (The Black Box)
    c.executionCtx.waitUntil(
      c.env.DB.prepare(
        `INSERT INTO logs (agent_id, type, message, metadata, timestamp) VALUES (?, ?, ?, ?, ?)`
      ).bind(
        agentId,
        'chat',
        message || 'Interaction',
        JSON.stringify(payload),
        Date.now()
      ).run().catch((err: any) => console.error('Failed to log message:', err))
    );

    console.log(`Routing message from ${source} to agent ${agentId}`);

    // Get Agent DO stub
    // We used idFromName in deploy, so we must use it here too
    const doId = c.env.AGENT_DO.idFromName(agentId);
    const agentStub = c.env.AGENT_DO.get(doId);

    // Forward to Agent DO
    const response = await agentStub.fetch(`http://agent-do/incoming/${source}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Agent DO returned ${response.status}`);
    }

    const responseData = await response.json();

    // Log response
    c.executionCtx.waitUntil(
      c.env.DB.prepare(
        `INSERT INTO logs (agent_id, type, message, metadata, timestamp) VALUES (?, ?, ?, ?, ?)`
      ).bind(
        agentId,
        'response',
        JSON.stringify(responseData),
        null,
        Date.now()
      ).run().catch((err: any) => console.error('Failed to log response:', err))
    );

    return c.json(responseData);
  } catch (error: any) {
    console.error('Error routing message:', error);
    return c.json({ error: 'Failed to route message: ' + error.message }, 500);
  }
});

/**
 * Validate Genesis Rules
 * @param rules - Genesis rules to validate
 * @returns Whether the rules are valid
 */
function validateGenesisRules(rules: GenesisRules): boolean {
  if (!rules) return true;

  // Validate stopLoss (0-1 range)
  if (rules.stopLoss !== undefined && (rules.stopLoss < 0 || rules.stopLoss > 1)) {
    // console.warn('Invalid stopLoss value:', rules.stopLoss);
    return false;
  }

  // Validate maxSlippage (0-1 range)
  if (rules.maxSlippage !== undefined && (rules.maxSlippage < 0 || rules.maxSlippage > 1)) {
    // console.warn('Invalid maxSlippage value:', rules.maxSlippage);
    return false;
  }

  // Validate maxPositionSize (positive number)
  if (rules.maxPositionSize !== undefined && rules.maxPositionSize <= 0) {
    // console.warn('Invalid maxPositionSize value:', rules.maxPositionSize);
    return false;
  }

  // Validate maxDailyTrades (positive integer)
  if (rules.maxDailyTrades !== undefined && (!Number.isInteger(rules.maxDailyTrades) || rules.maxDailyTrades <= 0)) {
    // console.warn('Invalid maxDailyTrades value:', rules.maxDailyTrades);
    return false;
  }

  // Validate maxLeverage (positive number)
  if (rules.maxLeverage !== undefined && rules.maxLeverage <= 0) {
    // console.warn('Invalid maxLeverage value:', rules.maxLeverage);
    return false;
  }

  // Validate minConfidenceScore (0-1 range)
  if (rules.minConfidenceScore !== undefined && (rules.minConfidenceScore < 0 || rules.minConfidenceScore > 1)) {
    // console.warn('Invalid minConfidenceScore value:', rules.minConfidenceScore);
    return false;
  }

  // Validate tokenAllowlist and tokenDenylist are not both present
  if (rules.tokenAllowlist && rules.tokenDenylist) {
    // console.warn('Cannot have both tokenAllowlist and tokenDenylist');
    return false;
  }

  return true;
}

export default app;