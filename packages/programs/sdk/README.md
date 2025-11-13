# Axiom ID SDK

The Axiom ID SDK provides a comprehensive TypeScript interface for interacting with the Axiom ID protocol on Solana. It enables developers to easily create and manage AI agent identities, stake tokens, request attestations, make payments, and more.

## Features

- **Identity Management**: Create and manage AI agent identities with soul-bound tokens
- **Staking & Reputation**: Stake tokens and build reputation through the Reputation-as-Yield (RaY) system
- **Attestations**: Request and verify attestations through the Solana Attestation Service (SAS)
- **Payments**: Route A2A payments through the $AXIOM token
- **Slashing**: Handle penalties for malicious behavior
- **Integration**: Seamless integration with solana-agent-kit and LangChain

## Installation

```bash
npm install @axiom-id/sdk
```

## Usage

### Basic Setup

```typescript
import { Connection } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import AxiomIDSDK from '@axiom-id/sdk';

// Initialize connection and provider
const connection = new Connection('https://api.devnet.solana.com');
const provider = new AnchorProvider(connection, wallet, {});

// Initialize the Axiom ID SDK
const sdk = new AxiomIDSDK(connection, provider);
```

### Creating an Identity

```typescript
// Create a new AI agent identity
const tx = await sdk.identity.createIdentity('DeFi Trading Agent v1.0', 1000);
console.log(`Identity created with transaction: ${tx}`);
```

### Staking Tokens

```typescript
// Stake tokens for reputation and yield
const tx = await sdk.staking.stakeTokens(500);
console.log(`Tokens staked with transaction: ${tx}`);
```

### Requesting Attestations

```typescript
// Request an attestation for task completion
const tx = await sdk.attestations.requestAttestation(
  agentPublicKey,
  'task_completion',
  '{"tasks_completed": 10, "success_rate": 0.95}'
);
console.log(`Attestation requested with transaction: ${tx}`);
```

### Making Payments

```typescript
// Route a payment to another agent
const tx = await sdk.payments.routePayment(recipientPublicKey, 100, 'Payment for services');
console.log(`Payment sent with transaction: ${tx}`);
```

## Integration with solana-agent-kit

The SDK provides first-class support for solana-agent-kit:

```typescript
import { AxiomAgent } from '@axiom-id/sdk/examples/agent-example';

const agent = new AxiomAgent(sdk, agentKey);
await agent.createIdentity('Trading Agent', 1000);
await agent.stakeTokens(500);
await agent.requestAttestation('task_completion', '{"tasks": 10}');
```

## Integration with LangChain

The SDK includes tools for LangChain integration:

```typescript
import { LangChainAxiomAgent } from '@axiom-id/sdk/examples/langchain-example';

const langchainAgent = new LangChainAxiomAgent(sdk, model);
const response = await langchainAgent.processRequest('Create an identity for a DeFi assistant');
```

## API Reference

### IdentityClient

- `createIdentity(persona: string, stakeAmount: number)`: Create a new AI agent identity
- `getIdentity(authority: PublicKey)`: Get an existing AI agent identity
- `createSoulBoundToken(recipient: PublicKey, amount: number)`: Create a soul-bound token

### StakingClient

- `stakeTokens(amount: number)`: Stake tokens for an identity
- `unstakeTokens(amount: number)`: Unstake tokens
- `claimRewards()`: Claim staking rewards
- `stakeWithReputation(amount: number, reputationScore: number)`: Stake with reputation boost

### AttestationClient

- `requestAttestation(subject: PublicKey, schema: string, data: string)`: Request an attestation
- `getReputationScore(agent: PublicKey)`: Get reputation score
- `presentCredentials(credentials: any)`: Present credentials for verification

### PaymentClient

- `routePayment(recipient: PublicKey, amount: number, memo?: string)`: Route a payment
- `createPaymentChannel(recipient: PublicKey, limit: number, expiration: number)`: Create a payment channel
- `processChannelPayment(channel: PublicKey, amount: number)`: Process a channel payment
- `closePaymentChannel(channel: PublicKey)`: Close a payment channel
- `createEscrowPayment(recipient: PublicKey, amount: number, arbiter: PublicKey)`: Create an escrow payment

### SlashingClient

- `slashAgent(agent: PublicKey, amount: number, reason: string)`: Slash tokens from an agent
- `burnTokens(agent: PublicKey, amount: number, reason: string)`: Burn tokens as penalty
- `autoSlashForNegativeAttestations(agent: PublicKey, negativeAttestations: number)`: Auto-slash for negative attestations

## Development

### Building

```bash
npm run build
```

### Running Examples

```bash
npm run examples:agent
npm run examples:langchain
```

## License

MIT