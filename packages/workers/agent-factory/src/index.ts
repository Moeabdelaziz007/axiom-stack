// packages/workers/agent-factory/src/index.ts - Agent Factory Worker Entry Point (Nano Banana Architecture)
import { Hono } from 'hono';
import { AGENT_TEMPLATES } from '@axiom-stack/core';
import type { AgentConfig, GenesisRules, SpawnRequest } from '@axiom-stack/core';
import { AIXValidator } from './aix-validator';

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

    // TODO: Implement actual orchestration logic
    // This would involve:
    // 1. Calling appropriate specialized workers via Service Bindings
    // 2. Routing to Gemini Router for AI decisions
    // 3. Routing to Tool Executor for action execution

    // For now, return a mock result
    const result = {
      agentId,
      action,
      status: 'orchestrated',
      timestamp: Date.now(),
      message: `Action ${action} orchestrated successfully for agent ${agentId}`
    };

    return c.json(result);
  } catch (error: any) {
    console.error('Error orchestrating agent action:', error);
    return c.json({ error: 'Failed to orchestrate agent action' }, 500);
  }
});

// POST /message endpoint - Route incoming messages to Agent DO
app.post('/message', async (c: any) => {
  try {
    const payload = await c.req.json();
    const { agentId, source } = payload;

    if (!agentId || !source) {
      return c.json({ error: 'Missing required fields: agentId and source' }, 400);
    }

    console.log(`Routing message from ${source} to agent ${agentId}`);

    // Get Agent DO stub
    const id = c.env.AGENT_DO.idFromString(agentId);
    const agentStub = c.env.AGENT_DO.get(id);

    // Forward to Agent DO
    const response = await agentStub.fetch(`http://agent-do/incoming/${source}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Agent DO returned ${response.status}`);
    }

    return c.json({ success: true });
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