# Axiom ID SDK Documentation

The Axiom ID SDK provides a comprehensive set of tools for creating and managing AI agent identities on Solana. This documentation covers installation, initialization, and usage of all SDK components.

## Table of Contents

1. [Installation](#installation)
2. [Initialization](#initialization)
3. [Core Components](#core-components)
   - [Identity Management](#identity-management)
   - [Staking and Reputation](#staking-and-reputation)
   - [Attestations](#attestations)
   - [Payments](#payments)
   - [Slashing](#slashing)
   - [PoHW Integration](#pohw-integration)
   - [Dynamic Staking](#dynamic-staking)
4. [Example Implementations](#example-implementations)
5. [Integration Guides](#integration-guides)
   - [solana-agent-kit](#solana-agent-kit-integration)
   - [LangChain](#langchain-integration)

## Installation

To install the Axiom ID SDK, run:

```bash
npm install @axiom-id/sdk
```

## Initialization

To initialize the SDK, you need a Solana connection and an Anchor provider:

```typescript
import { Connection, Keypair } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '@axiom-id/sdk';

// Initialize connection and provider
const connection = new Connection('https://api.devnet.solana.com');
const wallet = new Keypair(); // In practice, use a proper wallet
const provider = new AnchorProvider(connection, wallet, {});

// Initialize the Axiom ID SDK
const sdk = new AxiomIDSDK(connection, provider);
```

## Core Components

### Identity Management

The Identity component handles agent identity creation, management, and soul-bound token minting.

#### Creating an Identity

```typescript
// Create a new AI agent identity
const tx = await sdk.identity.createIdentity(
  'DeFi Trading Agent v1.0', // Agent persona
  1000 // Amount to stake
);
console.log(`Identity created with transaction: ${tx}`);
```

#### Creating Soul-Bound Tokens

```typescript
// Create a soul-bound token for an agent
const tx = await sdk.identity.createSoulBoundToken(
  agentPublicKey, // Recipient public key
  1 // Amount to mint
);
console.log(`Soul-bound token created with transaction: ${tx}`);
```

#### Getting Identity Information

```typescript
// Get an existing AI agent identity
const identity = await sdk.identity.getIdentity(agentPublicKey);
console.log(`Agent persona: ${identity.persona}`);
console.log(`Reputation score: ${identity.reputation}`);
```

#### Presenting Credentials

```typescript
// Present credentials for verification
const credentials = await sdk.identity.presentCredentials({
  agent: agentPublicKey.toString(),
  types: ['trading_strategy_execution', 'yield_farming'],
  timestamp: Date.now()
});
console.log('Credentials presented successfully');
```

### Staking and Reputation

The Staking component handles token staking, reward distribution, and reputation management.

#### Staking Tokens

```typescript
// Stake $AXIOM tokens for an agent identity
const tx = await sdk.staking.stakeTokens(500);
console.log(`Tokens staked with transaction: ${tx}`);
```

#### Getting Staking Information

```typescript
// Get user stake information
const stakeInfo = await sdk.staking.getUserStake(agentPublicKey);
console.log(`Staked amount: ${stakeInfo.amount}`);
console.log(`Effective amount: ${stakeInfo.effectiveAmount}`);
console.log(`Reputation score: ${stakeInfo.reputationScore}`);
```

#### Getting Reputation Score

```typescript
// Get reputation score for an agent from the staking contract
const reputationScore = await sdk.staking.getReputationScore(agentPublicKey);
console.log(`Reputation score: ${reputationScore}`);
```

### Attestations

The Attestations component handles verifiable credential issuance and management through the Solana Attestation Service (SAS).

#### Requesting Attestations

```typescript
// Request an attestation for an agent through SAS
const attestationData = {
  strategy: 'Yield Farming Strategy',
  profit: 150,
  timestamp: Date.now(),
  agent: agentPublicKey.toString()
};

const tx = await sdk.attestations.requestAttestation(
  'trading_strategy_execution', // Schema
  JSON.stringify(attestationData) // Data
);
console.log(`Attestation requested with transaction: ${tx}`);
```

#### Getting Reputation Score from Attestations

```typescript
// Get reputation score from attestations
const reputationScore = await sdk.attestations.getReputationScore(agentPublicKey);
console.log(`Reputation score: ${reputationScore}`);
```

### Payments

The Payments component handles A2A (Agent-to-Agent) payments with reputation-based trust verification.

#### Routing Payments

```typescript
// Route a payment to another agent
const tx = await sdk.payments.routePayment(
  recipientPublicKey, // Recipient
  100, // Amount
  'Performance fee' // Memo
);
console.log(`Payment sent with transaction: ${tx}`);
```

### Slashing

The Slashing component handles penalties for malicious agent behavior.

#### Slashing Tokens

```typescript
// Slash tokens from an agent for violations
const tx = await sdk.slashing.slashTokens(
  violatorPublicKey, // Violator
  50, // Amount to slash
  'Unauthorized trading activity' // Reason
);
console.log(`Tokens slashed with transaction: ${tx}`);
```

### PoHW Integration

The PoHW (Proof of Human Work) component integrates with the human work attestation system.

#### Getting Human Work Attestation

```typescript
// Get human work attestation for a user
const attestation = await sdk.pohw.getHumanWorkAttestation(agentPublicKey);
if (attestation && attestation.qualityScore) {
  console.log(`Quality score: ${attestation.qualityScore}`);
}
```

### Dynamic Staking

The Dynamic Staking component handles staking with reputation-based APY boosts.

#### Staking with Reputation

```typescript
// Stake tokens with reputation-based boost
const tx = await sdk.dynamicStaking.stakeWithReputation(
  1000, // Amount
  agentPublicKey // User public key
);
console.log(`Tokens staked with reputation boost: ${tx}`);
```

#### Getting User Stake Information

```typescript
// Get user stake information from dynamic staking
const userStake = await sdk.dynamicStaking.getUserStake(agentPublicKey);
console.log(`User stake amount: ${userStake.amount}`);
console.log(`Effective amount: ${userStake.effectiveAmount}`);
console.log(`Reputation score: ${userStake.reputationScore}`);
```

## Example Implementations

The SDK includes several example implementations to help you get started:

### DeFi Trading Agent

```typescript
import { DeFiTradingAgent } from '@axiom-id/agent-examples/defi-trading-agent';

// Create and initialize the DeFi trading agent
const defiAgent = new DeFiTradingAgent(sdk, agentKey);
await defiAgent.initialize();

// Execute trading strategies
await defiAgent.executeTradingStrategy('Yield Farming Strategy', 150);
await defiAgent.executeTradingStrategy('Arbitrage Strategy', 75);

// Check reputation score
await defiAgent.getReputationScore();
```

### Content Creation Agent

```typescript
import { ContentCreationAgent } from '@axiom-id/agent-examples/content-creation-agent';

// Create and initialize the content creation agent
const contentAgent = new ContentCreationAgent(sdk, agentKey);
await contentAgent.initialize();

// Create content
await contentAgent.createContent('article', 'The Future of AI in Finance', 95);
await contentAgent.createContent('social_post', 'Market Update Tweet', 85);

// Present credentials
await contentAgent.presentCredentials(['content_creation', 'article_writing']);
```

### Research Agent

```typescript
import { ResearchAgent } from '@axiom-id/agent-examples/research-agent';

// Create and initialize the research agent
const researchAgent = new ResearchAgent(sdk, agentKey);
await researchAgent.initialize();

// Conduct research
await researchAgent.conductResearch(
  'AI in Financial Markets', 
  'Analysis shows 15% improvement in prediction accuracy using transformer models',
  92
);

// Collaborate with another agent
const collaborator = Keypair.generate().publicKey;
await researchAgent.collaborateWithAgent(collaborator, 'Cross-chain Interoperability');
```

## Integration Guides

### solana-agent-kit Integration

The Axiom ID SDK provides first-class support for solana-agent-kit:

```typescript
import { Connection, Keypair } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '@axiom-id/sdk';
import { Agent } from 'solana-agent-kit';

// Initialize solana-agent-kit
const agentKey = Keypair.generate();
const agent = new Agent(agentKey);

// Initialize the Axiom ID SDK
const connection = new Connection('https://api.devnet.solana.com');
const provider = new AnchorProvider(connection, agent, {});
const sdk = new AxiomIDSDK(connection, provider);

// Create an integrated agent
class AxiomIntegratedAgent {
  constructor(private sdk: AxiomIDSDK, private agent: Agent) {}

  async initialize() {
    // Create identity on-chain
    const identityTx = await this.sdk.identity.createIdentity(
      'Integrated Agent v1.0', 
      1000
    );
    
    // Stake tokens for reputation building
    const stakeTx = await this.sdk.staking.stakeTokens(500);
    
    return { identityTx, stakeTx };
  }

  async executeTask(taskDescription: string) {
    // Execute task using solana-agent-kit
    const result = await this.agent.executeTask(taskDescription);
    
    // Report completion to Axiom ID for attestation
    const attestationData = JSON.stringify({
      task: taskDescription,
      completedAt: new Date().toISOString(),
      result: result
    });
    
    const attestationTx = await this.sdk.attestations.requestAttestation(
      'task_completion',
      attestationData
    );
    
    return { result, attestationTx };
  }
}
```

### LangChain Integration

The Axiom ID SDK also integrates with LangChain:

```typescript
import { AxiomIDPlugin } from '@axiom-id/langchain-plugin';
import { AgentExecutor } from 'langchain/agents';

// Initialize the Axiom ID plugin
const axiomPlugin = new AxiomIDPlugin(sdk);

// Create a LangChain agent with Axiom ID capabilities
const executor = AgentExecutor.fromAgentAndTools({
  agent: /* your agent */,
  tools: [axiomPlugin.getTools()],
});

// Execute tasks with identity and reputation management
const result = await executor.call({
  input: "Analyze the latest market trends and provide a trading strategy",
});
```

## API Reference

### AxiomIDSDK Class

#### Constructor

```typescript
new AxiomIDSDK(connection: Connection, provider: AnchorProvider)
```

#### Properties

- `identity: IdentityClient` - Identity management client
- `staking: StakingClient` - Staking and reputation client
- `attestations: AttestationClient` - Attestation management client
- `payments: PaymentClient` - Payment routing client
- `slashing: SlashingClient` - Slashing mechanism client
- `pohw: PoHWClient` - Proof of Human Work client
- `dynamicStaking: DynamicStakingClient` - Dynamic staking client

## Error Handling

All SDK methods throw errors when operations fail. Always wrap calls in try-catch blocks:

```typescript
try {
  const tx = await sdk.identity.createIdentity('My Agent', 1000);
  console.log(`Success: ${tx}`);
} catch (error) {
  console.error('Failed to create identity:', error.message);
}
```

## Best Practices

1. **Always verify reputation scores** before executing high-value operations
2. **Use soul-bound tokens** to establish permanent agent identities
3. **Request attestations** for important agent activities to build reputation
4. **Stake tokens** to participate in the reputation-as-yield (RaY) program
5. **Monitor slashing conditions** to avoid penalties
6. **Integrate with PoHW** to boost reputation through human work verification

## Support

For issues, feature requests, or questions, please visit our [GitHub repository](https://github.com/axiom-id/sdk) or join our [Discord community](https://discord.gg/axiom-id).