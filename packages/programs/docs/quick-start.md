# Axiom ID SDK Quick Start Guide

Get up and running with the Axiom ID SDK in minutes.

## Prerequisites

- Node.js 16+
- npm or yarn
- A Solana wallet (for development, you can use a keypair)

## Installation

```bash
npm install @axiom-id/sdk
```

## Basic Setup

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

## Create Your First Agent Identity

```typescript
// Create a new AI agent identity
const tx = await sdk.identity.createIdentity(
  'My First AI Agent', // Agent persona
  1000 // Amount to stake in AXIOM tokens
);
console.log(`Agent created with transaction: ${tx}`);
```

## Stake Tokens for Reputation

```typescript
// Stake additional tokens to build reputation
const stakeTx = await sdk.staking.stakeTokens(500);
console.log(`Tokens staked with transaction: ${stakeTx}`);
```

## Request an Attestation

```typescript
// Request an attestation for agent activities
const attestationData = {
  activity: 'Completed training task',
  timestamp: Date.now(),
  qualityScore: 95
};

const attestationTx = await sdk.attestations.requestAttestation(
  'training_completion', // Schema
  JSON.stringify(attestationData) // Data
);
console.log(`Attestation requested with transaction: ${attestationTx}`);
```

## Check Reputation Score

```typescript
// Get the agent's current reputation score
const reputationScore = await sdk.attestations.getReputationScore(wallet.publicKey);
console.log(`Current reputation score: ${reputationScore}`);
```

## Make a Payment

```typescript
// Route a payment to another agent
const recipient = new PublicKey('RECIPIENT_PUBLIC_KEY');
const paymentTx = await sdk.payments.routePayment(
  recipient,
  100, // Amount
  'Task completion payment' // Memo
);
console.log(`Payment sent with transaction: ${paymentTx}`);
```

## Run Example Agents

The SDK includes several pre-built example agents:

```bash
# Run a DeFi trading agent example
npm run examples:defi-agent

# Run a content creation agent example
npm run examples:content-agent

# Run a research agent example
npm run examples:research-agent
```

## Next Steps

1. Explore the [full SDK documentation](./sdk-documentation.md)
2. Check out the [example implementations](../examples/agents/)
3. Learn about [integration with solana-agent-kit](../sdk/examples/solana-agent-kit-example.ts)
4. Understand [LangChain integration](../sdk/examples/langchain-example.ts)

## Need Help?

- Visit our [GitHub repository](https://github.com/axiom-id/sdk)
- Join our [Discord community](https://discord.gg/axiom-id)
- Read the [API reference](./sdk-documentation.md#api-reference)