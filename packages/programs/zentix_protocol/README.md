# Zentix Protocol

The Zentix Protocol is the economic layer of the Axiom Stack, featuring quantum-topological flash loans and autonomous strategy engines for AI agents.

## Overview

Zentix Protocol provides advanced DeFi primitives specifically designed for autonomous agents, with built-in security checks through the Axiom ID system. The protocol incorporates quantum and topological concepts to ensure robust and stable financial operations.

## Key Features

### Quantum-Topological Flash Loans

- **Quantum Entanglement Validation**: Ensures transaction coherence through quantum state validation
- **Topological Stability Checks**: Maintains system stability through topological link strength validation
- **Reputation-Based Access Control**: Integrates with Axiom Staking for trust-based lending

### Account Structure

1. **ProtocolState**: Singleton account storing global protocol configuration
2. **TokenVault**: PDA accounts holding liquidity for specific token types

### Security Features

- **Axiom ID Integration**: All flash loan requests require a minimum reputation score of 1000
- **Quantum-Topological Validation**: Multi-layer validation to ensure system stability
- **Atomic Operations**: All operations are atomic, ensuring no partial state changes

## Program Instructions

### 1. Initialize Protocol State
Sets up the global protocol configuration with admin controls and fee structure.

### 2. Initialize Token Vault
Creates a vault for a specific token type to hold liquidity for flash loans.

### 3. Request Flash Loan
Requests a flash loan with quantum-topological validation and Axiom ID security checks.

### 4. Repay Flash Loan
Repays a flash loan with calculated fees.

### 5. Reset Quantum Entropy
Admin function to reset quantum entropy levels.

### 6. Adjust Topological Stability
Admin function to adjust topological stability parameters.

### 7. Emergency Shutdown
Admin function to immediately halt new flash loan requests.

## Quantum-Topological Concepts

### Quantum Entropy
- Measures the "randomness" or "disorder" in the system
- Higher entropy values indicate more unstable conditions
- Automatically increases with larger flash loan amounts
- Can be reset by admin when needed

### Topological Stability
- Measures the "connectedness" and "robustness" of the system
- Ranges from 0-100, with 100 being maximum stability
- Decreases when loans are taken, increases when loans are repaid
- Must remain above 80 for new loans to be approved

### Quantum Coherence
- Measures the "consistency" of quantum states in token vaults
- Ranges from 0-100, with 100 being maximum coherence
- Decreases when loans are taken, increases when loans are repaid

### Topological Link Strength
- Measures the strength of connections between system components
- Ranges from 0-100, with 100 being maximum link strength
- Automatically adjusted based on successful loan operations

## Integration with Axiom Stack

The Zentix Protocol is deeply integrated with the Axiom ID system:

1. **Reputation Requirement**: Users must have a reputation score > 1000 to access flash loans
2. **CPI Connection**: Direct cross-program invocation to Axiom Staking for reputation verification
3. **Trust-Based Economy**: Economic power is gated by proven trustworthiness

## SDK Usage

```typescript
import { ZentixClient } from '@axiom-stack/sdk';

const zentixClient = new ZentixClient(connection, provider);

// Initialize protocol state
await zentixClient.initializeProtocolState(adminKeypair, 50); // 0.5% fee

// Initialize token vault
await zentixClient.initializeTokenVault(userKeypair, tokenMint);

// Request flash loan
await zentixClient.requestFlashLoan(tokenMint, 1000, userPublicKey);

// Repay flash loan
await zentixClient.repayFlashLoan(loanId, 1050, userPublicKey);
```

## Testing

The protocol includes comprehensive tests covering:

1. Protocol state initialization
2. Token vault initialization
3. Quantum state validation
4. Topological stability validation
5. Flash loan operations
6. Security checks

Run tests with:
```bash
anchor test
```