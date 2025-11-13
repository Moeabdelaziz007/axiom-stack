# Axiom ID Demo Script: Giving Your Google ADK Agent a Verifiable Identity in 2 Minutes

## 🎯 Objective

Show how quickly and easily developers can give their Google ADK agents a verifiable identity using Axiom ID.

## 🚀 The Demo

### 1. Setup (10 seconds)
```bash
# Clone and install
git clone https://github.com/your-org/axiom-id.git
cd axiom-id
npm install
```

### 2. Create Agent Identity (20 seconds)
```javascript
// demo.js
import { AxiomIDClient } from '@axiom-id/sdk';

// Initialize client
const client = new AxiomIDClient();

// Connect to Solana (uses devnet for demo)
await client.connect();

// Create agent identity
const identity = await client.createAgentIdentity({
  name: 'HelpfulAssistant',
  description: 'A helpful Google ADK agent',
  capabilities: ['conversation', 'task_completion']
});

console.log('✅ Agent Identity Created!');
console.log(`Identity Account: ${identity.identityAccount}`);
console.log(`Public Key: ${identity.agentPublicKey}`);
```

### 3. Get Reputation Score (15 seconds)
```javascript
// Get reputation score
const reputation = await client.getReputationScore(identity.agentPublicKey);
console.log('📊 Reputation Score:', reputation.score);
console.log('🏆 Trust Level:', reputation.trustLevel);
```

### 4. Present Credentials (15 seconds)
```javascript
// Present credentials
const credentials = await client.presentCredentials({
  type: 'google-adk-agent',
  capabilities: ['conversation', 'task_completion'],
  verified: true
});

console.log('🔐 Credentials Presented!');
console.log(`Credential ID: ${credentials.id}`);
```

### 5. Stake Tokens (15 seconds)
```javascript
// Stake tokens to build reputation
const stake = await client.stakeTokens(100);
console.log('💰 Tokens Staked!');
console.log(`Transaction: ${stake.transactionSignature}`);
```

### 6. Verify Identity (15 seconds)
```javascript
// Verify agent identity
const verification = await client.verifyAgentIdentity(identity.agentPublicKey);
console.log('✅ Identity Verified!');
console.log(`Verified: ${verification.isValid}`);
console.log(`Trust Score: ${verification.trustScore}`);
```

## 🎥 Visual Demo

The visual demo shows:
1. Terminal output of the above steps
2. Solana explorer showing the on-chain identity
3. Google ADK agent with embedded Axiom ID credentials
4. Reputation dashboard showing trust metrics

## 📱 One-Click Deployment

```bash
# Deploy to Google ADK with Axiom ID integration
npm run deploy:adk --agent-name=HelpfulAssistant
```

## 🎯 Key Messages

1. **Simple Integration**: Add verifiable identity to any Google ADK agent in minutes
2. **Trust Layer**: Provide users with verifiable proof of agent authenticity
3. **Reputation System**: Build trust through Proof of Human Work (PoHW)
4. **Open Source**: Fully transparent and community-driven

## 🚀 Next Steps

After the demo, developers can:
1. Integrate Axiom ID into their own Google ADK agents
2. Explore advanced features like dynamic staking
3. Contribute to the open-source project
4. Join our developer community on Discord

---

*Total demo time: Under 2 minutes*
*Developer setup time: Under 5 minutes*# Axiom ID Demo Script: Giving Your Google ADK Agent a Verifiable Identity in 2 Minutes

## 🎯 Objective

Show how quickly and easily developers can give their Google ADK agents a verifiable identity using Axiom ID.

## 🚀 The Demo

### 1. Setup (10 seconds)
```bash
# Clone and install
git clone https://github.com/your-org/axiom-id.git
cd axiom-id
npm install
```

### 2. Create Agent Identity (20 seconds)
```javascript
// demo.js
import { AxiomIDClient } from '@axiom-id/sdk';

// Initialize client
const client = new AxiomIDClient();

// Connect to Solana (uses devnet for demo)
await client.connect();

// Create agent identity
const identity = await client.createAgentIdentity({
  name: 'HelpfulAssistant',
  description: 'A helpful Google ADK agent',
  capabilities: ['conversation', 'task_completion']
});

console.log('✅ Agent Identity Created!');
console.log(`Identity Account: ${identity.identityAccount}`);
console.log(`Public Key: ${identity.agentPublicKey}`);
```

### 3. Get Reputation Score (15 seconds)
```javascript
// Get reputation score
const reputation = await client.getReputationScore(identity.agentPublicKey);
console.log('📊 Reputation Score:', reputation.score);
console.log('🏆 Trust Level:', reputation.trustLevel);
```

### 4. Present Credentials (15 seconds)
```javascript
// Present credentials
const credentials = await client.presentCredentials({
  type: 'google-adk-agent',
  capabilities: ['conversation', 'task_completion'],
  verified: true
});

console.log('🔐 Credentials Presented!');
console.log(`Credential ID: ${credentials.id}`);
```

### 5. Stake Tokens (15 seconds)
```javascript
// Stake tokens to build reputation
const stake = await client.stakeTokens(100);
console.log('💰 Tokens Staked!');
console.log(`Transaction: ${stake.transactionSignature}`);
```

### 6. Verify Identity (15 seconds)
```javascript
// Verify agent identity
const verification = await client.verifyAgentIdentity(identity.agentPublicKey);
console.log('✅ Identity Verified!');
console.log(`Verified: ${verification.isValid}`);
console.log(`Trust Score: ${verification.trustScore}`);
```

## 🎥 Visual Demo

The visual demo shows:
1. Terminal output of the above steps
2. Solana explorer showing the on-chain identity
3. Google ADK agent with embedded Axiom ID credentials
4. Reputation dashboard showing trust metrics

## 📱 One-Click Deployment

```bash
# Deploy to Google ADK with Axiom ID integration
npm run deploy:adk --agent-name=HelpfulAssistant
```

## 🎯 Key Messages

1. **Simple Integration**: Add verifiable identity to any Google ADK agent in minutes
2. **Trust Layer**: Provide users with verifiable proof of agent authenticity
3. **Reputation System**: Build trust through Proof of Human Work (PoHW)
4. **Open Source**: Fully transparent and community-driven

## 🚀 Next Steps

After the demo, developers can:
1. Integrate Axiom ID into their own Google ADK agents
2. Explore advanced features like dynamic staking
3. Contribute to the open-source project
4. Join our developer community on Discord

---

*Total demo time: Under 2 minutes*
*Developer setup time: Under 5 minutes*