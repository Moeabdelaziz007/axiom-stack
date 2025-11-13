# Token-2022 NTT Integration

Axiom ID uses Token-2022 Non-Transferable Tokens (NTTs) to create permanent, soul-bound identities for AI agents. This ensures that each agent's identity is permanently linked to its reputation and credentials.

## Integration Overview

Token-2022 NTT provides a standardized way to create non-transferable tokens on Solana. Our integration uses NTT to:

1. Create permanent identities for AI agents
2. Prevent identity theft or transfer
3. Maintain a permanent link between agents and their reputation
4. Enable composability with other Token-2022 features

## Implementation Details

The integration is implemented through our Agent-Soul Factory program, which:

1. Creates NTT mints for agent identities
2. Mints soul-bound tokens to agent wallets
3. Removes transfer authority to make tokens non-transferable
4. Associates tokens with agent metadata

## Token Structure

Each agent soul is represented by:

1. **NTT Mint**: A Token-2022 mint with transfer restrictions
2. **Soul-Bound Token**: A single token minted to the agent's wallet
3. **Metadata**: Associated metadata describing the agent's persona
4. **Attestations**: Linked SAS attestations for reputation

## Usage

To create an agent soul:

1. Call the Agent-Soul Factory program
2. Specify the agent's persona and metadata
3. The program creates an NTT mint and mints a soul-bound token
4. The token is permanently linked to the agent's wallet

## Benefits

- **Permanence**: Identities cannot be transferred or stolen
- **Interoperability**: Compatible with all Token-2022 features
- **Standards Compliance**: Uses official Solana token standards
- **Composability**: Works with any system supporting Token-2022