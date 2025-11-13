# Axiom ID SDK Integration Tests

This directory contains integration tests for the Axiom ID SDK with various frameworks and libraries, including solana-agent-kit.

## Test Structure

- `solana-agent-kit.test.ts` - Integration tests for solana-agent-kit compatibility
- Additional integration tests for other frameworks will be added here

## Running Integration Tests

To run the integration tests, use the following command from the SDK root directory:

```bash
npm run test:integration
```

Or to run specific integration tests:

```bash
npm run test:integration solana-agent-kit
```

## Test Coverage

The integration tests cover the following functionality:

1. **Identity Management**
   - Creating identities for solana-agent-kit agents
   - Managing agent personas and metadata

2. **Staking and Reputation**
   - Staking tokens through the SDK
   - Retrieving reputation scores
   - Requesting attestations for completed tasks

3. **Credential Management**
   - Presenting credentials to other agents or services
   - Verifying agent credentials

4. **Payment Routing**
   - Routing payments through the Axiom ID payment system
   - Using reputation-based trust verification

5. **Complete Workflows**
   - End-to-end agent workflows combining all functionality

## Mock Implementation

The tests use mock implementations of solana-agent-kit classes to focus on testing the integration points with the Axiom ID SDK rather than the actual solana-agent-kit functionality.

In a real implementation, you would import the actual solana-agent-kit classes:

```typescript
import { Agent, AgentKit } from 'solana-agent-kit';
```

## Example Usage

See the `examples/solana-agent-kit-example.ts` file for a complete example of how to integrate Axiom ID SDK with solana-agent-kit.