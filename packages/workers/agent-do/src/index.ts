// packages/workers/agent-do/src/index.ts - Agent Durable Object Entry Point
import { AgentDO } from './AgentDO';

// Export the AgentDO class for use as a Durable Object
export { AgentDO };

// Export the AgentDO class as a Durable Object
export const AgentDurableObject = AgentDO;

// Default export
export default AgentDO;