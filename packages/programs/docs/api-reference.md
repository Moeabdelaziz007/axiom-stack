# Axiom ID SDK API Reference

Detailed documentation for all classes, methods, and interfaces in the Axiom ID SDK.

## Table of Contents

1. [AxiomIDSDK](#axiomidsdk)
2. [IdentityClient](#identityclient)
3. [StakingClient](#stakingclient)
4. [AttestationClient](#attestationclient)
5. [PaymentClient](#paymentclient)
6. [SlashingClient](#slashingclient)
7. [PoHWClient](#pohwclient)
8. [DynamicStakingClient](#dynamicstakingclient)

## AxiomIDSDK

The main entry point for the Axiom ID SDK.

### Constructor

```typescript
new AxiomIDSDK(connection: Connection, provider: AnchorProvider)
```

**Parameters:**
- `connection`: Solana connection object
- `provider`: Anchor provider object

### Properties

- `identity: IdentityClient` - Identity management client
- `staking: StakingClient` - Staking and reputation client
- `attestations: AttestationClient` - Attestation management client
- `payments: PaymentClient` - Payment routing client
- `slashing: SlashingClient` - Slashing mechanism client
- `pohw: PoHWClient` - Proof of Human Work client
- `dynamicStaking: DynamicStakingClient` - Dynamic staking client

### Methods

#### initializePrograms

```typescript
async initializePrograms(programs: {
  agentSoulFactoryProgram: Program<AgentSoulFactory>,
  axiomStakingProgram: Program<AxiomStaking>,
  axiomIdProgram: Program<AxiomId>,
  axiomAttestationsProgram: Program<AxiomAttestations>,
  axiomPaymentsProgram: Program<AxiomPayments>,
  axiomSlashingProgram: Program<AxiomSlashing>,
  axiomTokenProgram: Program<AxiomToken>,
  axiomGovernanceProgram: Program<AxiomGovernance>,
  axiomPoHWProgram?: Program<AxiomPoHW>,
  axiomStakingDynamicProgram?: Program<AxiomStakingDynamic>
})
```

Initialize all program clients with their respective programs.

**Parameters:**
- `programs`: Object containing all program instances

## IdentityClient

Manages agent identities, soul-bound tokens, and credential presentation.

### Methods

#### createIdentity

```typescript
async createIdentity(persona: string, stakeAmount: number): Promise<string>
```

Create a new AI agent identity with NTT minting and Cryptid account creation.

**Parameters:**
- `persona`: Description of the AI agent
- `stakeAmount`: Amount of tokens to stake

**Returns:** Transaction signature

#### getIdentity

```typescript
async getIdentity(authority: PublicKey): Promise<any>
```

Get an existing AI agent identity.

**Parameters:**
- `authority`: Public key of the identity owner

**Returns:** Identity account data

#### createSoulBoundToken

```typescript
async createSoulBoundToken(recipient: PublicKey, amount: number): Promise<string>
```

Create a soul-bound token for an agent.

**Parameters:**
- `recipient`: Public key of the token recipient
- `amount`: Amount of tokens to mint

**Returns:** Transaction signature

#### stake

```typescript
async stake(amount: number): Promise<string>
```

Stake $AXIOM tokens for an agent identity.

**Parameters:**
- `amount`: Amount of tokens to stake

**Returns:** Transaction signature

#### requestAttestation

```typescript
async requestAttestation(schema: string, data: string): Promise<string>
```

Request an attestation for an agent through SAS.

**Parameters:**
- `schema`: Schema for the attestation
- `data`: Attestation data

**Returns:** Transaction signature

#### getReputationScore

```typescript
async getReputationScore(agent: PublicKey): Promise<number>
```

Get reputation score for an agent from the staking contract.

**Parameters:**
- `agent`: Public key of the agent

**Returns:** Reputation score

#### presentCredentials

```typescript
async presentCredentials(credentials: any): Promise<boolean>
```

Present credentials for verification.

**Parameters:**
- `credentials`: Credential data to present

**Returns:** Verification result

## StakingClient

Handles token staking, reward distribution, and reputation management.

### Methods

#### stakeTokens

```typescript
async stakeTokens(amount: number): Promise<string>
```

Stake tokens for rewards.

**Parameters:**
- `amount`: Amount of tokens to stake

**Returns:** Transaction signature

#### unstakeTokens

```typescript
async unstakeTokens(amount: number): Promise<string>
```

Unstake tokens.

**Parameters:**
- `amount`: Amount of tokens to unstake

**Returns:** Transaction signature

#### claimRewards

```typescript
async claimRewards(): Promise<string>
```

Claim staking rewards.

**Returns:** Transaction signature

#### getUserStake

```typescript
async getUserStake(userPublicKey: PublicKey): Promise<any>
```

Get user stake information.

**Parameters:**
- `userPublicKey`: Public key of the user

**Returns:** User stake information

#### getReputationScore

```typescript
async getReputationScore(agent: PublicKey): Promise<number>
```

Get reputation score for an agent.

**Parameters:**
- `agent`: Public key of the agent

**Returns:** Reputation score

## AttestationClient

Manages verifiable credentials through the Solana Attestation Service (SAS).

### Methods

#### requestAttestation

```typescript
async requestAttestation(subject: PublicKey, schema: string, data: string): Promise<string>
```

Request an attestation for an agent.

**Parameters:**
- `subject`: Public key of the subject
- `schema`: Schema for the attestation
- `data`: Attestation data

**Returns:** Transaction signature

#### revokeAttestation

```typescript
async revokeAttestation(attestation: PublicKey, reason: string): Promise<string>
```

Revoke an attestation.

**Parameters:**
- `attestation`: Public key of the attestation
- `reason`: Reason for revocation

**Returns:** Transaction signature

#### getReputationScore

```typescript
async getReputationScore(agent: PublicKey): Promise<number>
```

Get reputation score from attestations.

**Parameters:**
- `agent`: Public key of the agent

**Returns:** Reputation score

## PaymentClient

Handles A2A (Agent-to-Agent) payments with reputation-based trust verification.

### Methods

#### routePayment

```typescript
async routePayment(recipient: PublicKey, amount: number, memo?: string): Promise<string>
```

Route a payment to another agent.

**Parameters:**
- `recipient`: Public key of the recipient
- `amount`: Amount to send
- `memo`: Optional memo

**Returns:** Transaction signature

## SlashingClient

Handles penalties for malicious agent behavior.

### Methods

#### slashTokens

```typescript
async slashTokens(violator: PublicKey, amount: number, reason: string): Promise<string>
```

Slash tokens from an agent for violations.

**Parameters:**
- `violator`: Public key of the violator
- `amount`: Amount to slash
- `reason`: Reason for slashing

**Returns:** Transaction signature

## PoHWClient

Integrates with the Proof of Human Work (PoHW) system.

### Methods

#### recordHumanWork

```typescript
async recordHumanWork(user: PublicKey, workData: any): Promise<string>
```

Record human work attestation.

**Parameters:**
- `user`: Public key of the user
- `workData`: Work data to record

**Returns:** Transaction signature

#### updateHumanWork

```typescript
async updateHumanWork(user: PublicKey, workData: any): Promise<string>
```

Update human work attestation.

**Parameters:**
- `user`: Public key of the user
- `workData`: Updated work data

**Returns:** Transaction signature

#### getHumanWorkAttestation

```typescript
async getHumanWorkAttestation(user: PublicKey): Promise<any>
```

Get human work attestation for a user.

**Parameters:**
- `user`: Public key of the user

**Returns:** Attestation data

## DynamicStakingClient

Handles staking with reputation-based APY boosts.

### Methods

#### stakeWithReputation

```typescript
async stakeWithReputation(amount: number, userPublicKey: PublicKey): Promise<string>
```

Stake tokens with reputation-based boost.

**Parameters:**
- `amount`: Amount of tokens to stake
- `userPublicKey`: Public key of the user

**Returns:** Transaction signature

#### getUserStake

```typescript
async getUserStake(userPublicKey: PublicKey): Promise<any>
```

Get user stake information.

**Parameters:**
- `userPublicKey`: Public key of the user

**Returns:** User stake information

#### getPoolInfo

```typescript
async getPoolInfo(): Promise<any>
```

Get pool information.

**Returns:** Pool information# Axiom ID SDK API Reference

Detailed documentation for all classes, methods, and interfaces in the Axiom ID SDK.

## Table of Contents

1. [AxiomIDSDK](#axiomidsdk)
2. [IdentityClient](#identityclient)
3. [StakingClient](#stakingclient)
4. [AttestationClient](#attestationclient)
5. [PaymentClient](#paymentclient)
6. [SlashingClient](#slashingclient)
7. [PoHWClient](#pohwclient)
8. [DynamicStakingClient](#dynamicstakingclient)

## AxiomIDSDK

The main entry point for the Axiom ID SDK.

### Constructor

```typescript
new AxiomIDSDK(connection: Connection, provider: AnchorProvider)
```

**Parameters:**
- `connection`: Solana connection object
- `provider`: Anchor provider object

### Properties

- `identity: IdentityClient` - Identity management client
- `staking: StakingClient` - Staking and reputation client
- `attestations: AttestationClient` - Attestation management client
- `payments: PaymentClient` - Payment routing client
- `slashing: SlashingClient` - Slashing mechanism client
- `pohw: PoHWClient` - Proof of Human Work client
- `dynamicStaking: DynamicStakingClient` - Dynamic staking client

### Methods

#### initializePrograms

```typescript
async initializePrograms(programs: {
  agentSoulFactoryProgram: Program<AgentSoulFactory>,
  axiomStakingProgram: Program<AxiomStaking>,
  axiomIdProgram: Program<AxiomId>,
  axiomAttestationsProgram: Program<AxiomAttestations>,
  axiomPaymentsProgram: Program<AxiomPayments>,
  axiomSlashingProgram: Program<AxiomSlashing>,
  axiomTokenProgram: Program<AxiomToken>,
  axiomGovernanceProgram: Program<AxiomGovernance>,
  axiomPoHWProgram?: Program<AxiomPoHW>,
  axiomStakingDynamicProgram?: Program<AxiomStakingDynamic>
})
```

Initialize all program clients with their respective programs.

**Parameters:**
- `programs`: Object containing all program instances

## IdentityClient

Manages agent identities, soul-bound tokens, and credential presentation.

### Methods

#### createIdentity

```typescript
async createIdentity(persona: string, stakeAmount: number): Promise<string>
```

Create a new AI agent identity with NTT minting and Cryptid account creation.

**Parameters:**
- `persona`: Description of the AI agent
- `stakeAmount`: Amount of tokens to stake

**Returns:** Transaction signature

#### getIdentity

```typescript
async getIdentity(authority: PublicKey): Promise<any>
```

Get an existing AI agent identity.

**Parameters:**
- `authority`: Public key of the identity owner

**Returns:** Identity account data

#### createSoulBoundToken

```typescript
async createSoulBoundToken(recipient: PublicKey, amount: number): Promise<string>
```

Create a soul-bound token for an agent.

**Parameters:**
- `recipient`: Public key of the token recipient
- `amount`: Amount of tokens to mint

**Returns:** Transaction signature

#### stake

```typescript
async stake(amount: number): Promise<string>
```

Stake $AXIOM tokens for an agent identity.

**Parameters:**
- `amount`: Amount of tokens to stake

**Returns:** Transaction signature

#### requestAttestation

```typescript
async requestAttestation(schema: string, data: string): Promise<string>
```

Request an attestation for an agent through SAS.

**Parameters:**
- `schema`: Schema for the attestation
- `data`: Attestation data

**Returns:** Transaction signature

#### getReputationScore

```typescript
async getReputationScore(agent: PublicKey): Promise<number>
```

Get reputation score for an agent from the staking contract.

**Parameters:**
- `agent`: Public key of the agent

**Returns:** Reputation score

#### presentCredentials

```typescript
async presentCredentials(credentials: any): Promise<boolean>
```

Present credentials for verification.

**Parameters:**
- `credentials`: Credential data to present

**Returns:** Verification result

## StakingClient

Handles token staking, reward distribution, and reputation management.

### Methods

#### stakeTokens

```typescript
async stakeTokens(amount: number): Promise<string>
```

Stake tokens for rewards.

**Parameters:**
- `amount`: Amount of tokens to stake

**Returns:** Transaction signature

#### unstakeTokens

```typescript
async unstakeTokens(amount: number): Promise<string>
```

Unstake tokens.

**Parameters:**
- `amount`: Amount of tokens to unstake

**Returns:** Transaction signature

#### claimRewards

```typescript
async claimRewards(): Promise<string>
```

Claim staking rewards.

**Returns:** Transaction signature

#### getUserStake

```typescript
async getUserStake(userPublicKey: PublicKey): Promise<any>
```

Get user stake information.

**Parameters:**
- `userPublicKey`: Public key of the user

**Returns:** User stake information

#### getReputationScore

```typescript
async getReputationScore(agent: PublicKey): Promise<number>
```

Get reputation score for an agent.

**Parameters:**
- `agent`: Public key of the agent

**Returns:** Reputation score

## AttestationClient

Manages verifiable credentials through the Solana Attestation Service (SAS).

### Methods

#### requestAttestation

```typescript
async requestAttestation(subject: PublicKey, schema: string, data: string): Promise<string>
```

Request an attestation for an agent.

**Parameters:**
- `subject`: Public key of the subject
- `schema`: Schema for the attestation
- `data`: Attestation data

**Returns:** Transaction signature

#### revokeAttestation

```typescript
async revokeAttestation(attestation: PublicKey, reason: string): Promise<string>
```

Revoke an attestation.

**Parameters:**
- `attestation`: Public key of the attestation
- `reason`: Reason for revocation

**Returns:** Transaction signature

#### getReputationScore

```typescript
async getReputationScore(agent: PublicKey): Promise<number>
```

Get reputation score from attestations.

**Parameters:**
- `agent`: Public key of the agent

**Returns:** Reputation score

## PaymentClient

Handles A2A (Agent-to-Agent) payments with reputation-based trust verification.

### Methods

#### routePayment

```typescript
async routePayment(recipient: PublicKey, amount: number, memo?: string): Promise<string>
```

Route a payment to another agent.

**Parameters:**
- `recipient`: Public key of the recipient
- `amount`: Amount to send
- `memo`: Optional memo

**Returns:** Transaction signature

## SlashingClient

Handles penalties for malicious agent behavior.

### Methods

#### slashTokens

```typescript
async slashTokens(violator: PublicKey, amount: number, reason: string): Promise<string>
```

Slash tokens from an agent for violations.

**Parameters:**
- `violator`: Public key of the violator
- `amount`: Amount to slash
- `reason`: Reason for slashing

**Returns:** Transaction signature

## PoHWClient

Integrates with the Proof of Human Work (PoHW) system.

### Methods

#### recordHumanWork

```typescript
async recordHumanWork(user: PublicKey, workData: any): Promise<string>
```

Record human work attestation.

**Parameters:**
- `user`: Public key of the user
- `workData`: Work data to record

**Returns:** Transaction signature

#### updateHumanWork

```typescript
async updateHumanWork(user: PublicKey, workData: any): Promise<string>
```

Update human work attestation.

**Parameters:**
- `user`: Public key of the user
- `workData`: Updated work data

**Returns:** Transaction signature

#### getHumanWorkAttestation

```typescript
async getHumanWorkAttestation(user: PublicKey): Promise<any>
```

Get human work attestation for a user.

**Parameters:**
- `user`: Public key of the user

**Returns:** Attestation data

## DynamicStakingClient

Handles staking with reputation-based APY boosts.

### Methods

#### stakeWithReputation

```typescript
async stakeWithReputation(amount: number, userPublicKey: PublicKey): Promise<string>
```

Stake tokens with reputation-based boost.

**Parameters:**
- `amount`: Amount of tokens to stake
- `userPublicKey`: Public key of the user

**Returns:** Transaction signature

#### getUserStake

```typescript
async getUserStake(userPublicKey: PublicKey): Promise<any>
```

Get user stake information.

**Parameters:**
- `userPublicKey`: Public key of the user

**Returns:** User stake information

#### getPoolInfo

```typescript
async getPoolInfo(): Promise<any>
```

Get pool information.

**Returns:** Pool information