# Axiom Governance Program

This is a Solana program built with Anchor that implements a decentralized governance system (DAO) for the Axiom ID protocol.

## Overview

The Axiom Governance program provides the foundational infrastructure for decentralized decision-making within the Axiom ID ecosystem. It enables community members to create proposals, vote on them, and execute decisions in a transparent and decentralized manner.

## Features

1. **Proposal Creation**: Users can create proposals with titles, descriptions, and voting periods
2. **Voting System**: Community members can vote "Yes" or "No" on proposals with their voting power
3. **Proposal Lifecycle**: Proposals progress through Draft → Voting → Succeeded/Failed states
4. **Time-based Voting**: Proposals have a defined voting period that automatically expires
5. **Vote Tracking**: All votes are recorded and associated with specific proposals and voters

## Account Structures

### Proposal
- `proposer`: Pubkey of the wallet that created the proposal
- `status`: Current status (Draft, Voting, Succeeded, Failed)
- `votes_for`: Total "Yes" votes
- `votes_against`: Total "No" votes
- `execution_target`: Optional program address for execution
- `title`: Proposal title
- `description`: Proposal description
- `created_at`: Timestamp when proposal was created
- `voting_ends_at`: Timestamp when voting period ends

### VoteRecord
- `proposal`: Pubkey of the proposal being voted on
- `voter`: Pubkey of the wallet that cast the vote
- `side`: Vote side (Yes/No)
- `voting_power`: Amount of voting power used
- `timestamp`: When the vote was cast

## Functions

1. `create_proposal`: Initialize a new proposal in Draft status
2. `submit_vote`: Submit a vote for an active proposal
3. `start_voting`: Transition a proposal from Draft to Voting status
4. `finalize_proposal`: Determine the final status of a proposal after voting ends

## Getting Started

1. Install dependencies:
   ```bash
   anchor build
   ```

2. Run tests:
   ```bash
   anchor test
   ```

## Next Steps

To complete the governance system, the following components need to be implemented:

1. **Token Program Integration**: Connect with the $AXIOM token for voting power
2. **Reputation/Agent Integration**: Link with existing AgentInfo system
3. **Proposal Execution**: Implement execution of successful proposals
4. **Advanced Governance Features**: 
   - Quorum requirements
   - Multi-signature proposals
   - Delegation system
   - Treasury management