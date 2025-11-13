# Axiom ID POC Demo Video Script

## Introduction (0:00-0:15)

**Visual**: Axiom ID logo with background music
**Narrator**: "Welcome to the Axiom ID Proof of Concept demonstration. Today we'll show how Axiom ID serves as the missing trust layer for Google's Agent Development Kit."

## Section 1: Agent Creation and Identity (0:15-0:45)

**Visual**: Terminal showing code execution
**Narrator**: "First, we create three autonomous agents: a Data Analyzer, Content Generator, and Image Processor. Each agent generates a Solana keypair and establishes an on-chain identity."

**Visual**: Highlight agent creation code
**Narrator**: "Notice how each agent now has a verifiable identity on the Solana blockchain, represented by their public key."

## Section 2: Task Execution and Reputation Building (0:45-1:15)

**Visual**: Terminal output showing task execution
**Narrator**: "The agents execute tasks in their domains. As they complete tasks successfully, they build reputation scores that are stored on-chain."

**Visual**: Show reputation scores in terminal output
**Narrator**: "These reputation scores will be crucial for determining trustworthiness in future interactions."

## Section 3: Trusted Transactions (1:15-1:45)

**Visual**: Terminal showing payment execution
**Narrator**: "Before any value transfer, Axiom ID verifies both parties' credentials and checks their reputation scores."

**Visual**: Highlight verification process in code
**Narrator**: "Only agents with sufficient reputation can participate in transactions, creating a trust-based economy."

## Section 4: Verification Endpoints (1:45-2:15)

**Visual**: Terminal showing verification service
**Narrator**: "Axiom ID provides dedicated verification endpoints that allow any agent to verify another's identity and transaction history."

**Visual**: Show verification results
**Narrator**: "This creates a web of trust where agents can make informed decisions about whom to interact with."

## Conclusion (2:15-2:30)

**Visual**: Axiom ID logo with call to action
**Narrator**: "This Proof of Concept demonstrates how Axiom ID can provide the trust layer that Google ADK needs for secure, autonomous agent interactions. Thank you for watching."

## Technical Details

### What to Show in Demo

1. **Terminal Execution**: Run `node index.mjs` to show the complete workflow
2. **Code Highlights**: 
   - [Agent.mjs](file:///Users/cryptojoker710/Desktop/Axiom%20ID/axiom_id/poc/Agent.mjs) - Agent creation and identity management
   - [AxiomIDClient.mjs](file:///Users/cryptojoker710/Desktop/Axiom%20ID/axiom_id/poc/AxiomIDClient.mjs) - Identity and reputation functions
   - [PaymentSystem.mjs](file:///Users/cryptojoker710/Desktop/Axiom%20ID/axiom_id/poc/PaymentSystem.mjs) - Trusted transactions
   - [VerificationService.mjs](file:///Users/cryptojoker710/Desktop/Axiom%20ID/axiom_id/poc/VerificationService.mjs) - Verification endpoints

### Key Points to Emphasize

1. **Decentralized Identity**: Agents have verifiable on-chain identities
2. **Reputation System**: Trust is quantified and stored on-chain
3. **Trusted Transactions**: All value transfers are preceded by verification
4. **Verification Endpoints**: Dedicated APIs for trust verification
5. **Google ADK Integration**: How this solves the trust gap in ADK

### Expected Outcomes

1. Agents successfully create on-chain identities
2. Agents execute tasks and build reputation
3. Trusted transactions are executed with verification
4. Verification endpoints successfully validate agents and transactions