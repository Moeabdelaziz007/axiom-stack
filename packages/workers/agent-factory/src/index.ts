// packages/workers/agent-factory/src/index.ts - Agent Factory Worker Entry Point
import { Hono } from 'hono';
import type { AgentConfig, GenesisRules, SpawnRequest } from '@axiom-stack/core';

// Initialize Hono app
const app = new Hono();

// Health check endpoint
app.get('/', async (c: any) => {
  return c.json({
    message: 'AxiomID Agent Factory',
    version: '1.0.0',
    status: 'ok'
  });
});

// POST /spawn endpoint - Creates a new agent
app.post('/spawn', async (c: any) => {
  try {
    const { type, config, strategy }: SpawnRequest = await c.req.json();
    
    // Validate required fields
    if (!type || !config) {
      return c.json({ error: 'Missing required fields: type and config' }, 400);
    }
    
    // Validate Genesis Rules
    const isValid = validateGenesisRules(config.rules);
    if (!isValid) {
      return c.json({ error: 'Invalid genesis rules' }, 400);
    }
    
    // TODO: Call AgentDO.initialize(config)
    // This will require service bindings to communicate with the Agent DO
    
    // TODO: Register agent in D1 Database
    // const agentId = await registerAgentInRegistry(agentData);
    
    // Mock response for now
    const agentId = `agent_${Date.now()}`;
    const publicKey = 'mock_public_key';
    
    return c.json({
      success: true,
      agentId,
      publicKey,
      message: `Agent '${type}' created successfully`
    });
  } catch (error: any) {
    console.error('Error spawning agent:', error);
    return c.json({ error: 'Failed to create agent' }, 500);
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