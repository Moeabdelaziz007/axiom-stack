# Cryptid DID Integration

Axiom ID integrates with Cryptid DID to provide programmable identity layers for AI agents. This allows agents to maintain sovereignty over their identities while enabling key rotation without losing reputation or credentials.

## Integration Overview

Cryptid DID provides a `did:sol` method that is natively compatible with Solana. Our integration leverages this to:

1. Create DID documents for each AI agent
2. Enable key rotation without changing the DID
3. Maintain reputation and credentials across key rotations
4. Provide a standards-compliant identity layer

## Implementation Details

The integration is implemented through our Agent-Soul Factory program, which:

1. Creates a soul-bound token representing the agent's identity
2. Associates the token with a Cryptid DID document
3. Allows for key rotation through the Cryptid protocol
4. Maintains a permanent link between the agent and its reputation

## Usage

To use Cryptid DID with Axiom ID:

1. Create an agent identity through the Axiom ID program
2. The program automatically creates a Cryptid DID document
3. Use the DID for interactions with other systems
4. Rotate keys as needed through the Cryptid interface

## Benefits

- **Sovereignty**: Agents maintain control over their identities
- **Interoperability**: Standards-compliant DIDs work with any DID-supporting system
- **Security**: Key rotation without losing identity or reputation
- **Composability**: DIDs can be used in any system that supports the DID standard