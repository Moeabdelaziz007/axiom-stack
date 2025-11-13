# Axiom Chat Telegram Mini App (TMA)

A Train-to-Earn interface for the Axiom ID protocol that allows users to complete Human-in-the-Loop (HITL) micro-tasks and earn AXIOM tokens.

## Features

- Complete micro-tasks to earn AXIOM tokens
- Build reputation through SAS attestations
- View staking rewards and APY
- Track task completion history
- Telegram-native interface

## How It Works

1. **Task Selection**: Users browse available micro-tasks in various categories (image classification, text analysis, data validation, etc.)

2. **Task Completion**: Users complete HITL tasks that help train AI models

3. **Reward Distribution**: Upon task completion, users receive:
   - AXIOM token rewards
   - Reputation points that boost staking APY
   - SAS attestations that verify their contributions

4. **Reputation Building**: Completed tasks are recorded as SAS attestations, which increase the user's reputation score and staking yield

## Integration with Axiom ID Protocol

The TMA integrates with the Axiom ID protocol through:

- **Axiom ID SDK**: For identity management and reputation scoring
- **Staking Program**: For APY calculations based on reputation
- **Attestations Program**: For issuing SAS-compliant credentials
- **Token Program**: For AXIOM token transfers

## Development

### Prerequisites

- Node.js
- Telegram account for testing

### Installation

```bash
cd tma
npm install
```

### Running Locally

```bash
npm start
```

The TMA will be available at `http://localhost:3000`

## Deployment

To deploy the TMA to Telegram:

1. Host the files on a public web server
2. Configure the Telegram Bot with the Mini App URL
3. Set up the webhook for the bot

## Task Types

### Image Classification
Classify images into predefined categories to help train computer vision models.

### Text Quality Rating
Rate the quality of AI-generated text responses to improve natural language processing.

### Data Validation
Verify the accuracy of structured data entries to enhance data quality assurance.

### Sentiment Analysis
Analyze the sentiment of social media posts to train sentiment detection models.

### Audio Transcription
Transcribe short audio clips to improve speech recognition systems.

## Reward System

Rewards are distributed based on:

- **Task Difficulty**: More complex tasks yield higher rewards
- **Completion Time**: Faster completion increases reward multiplier
- **Accuracy**: Higher accuracy in task completion increases rewards
- **Reputation Boost**: Completed tasks increase reputation, which boosts staking APY

## Security

All transactions and attestations are recorded on the Solana blockchain, ensuring:

- Immutable task completion records
- Transparent reward distribution
- Verifiable reputation scores
- Secure token transfers

## Future Enhancements

- Integration with Solana wallets for direct token management
- Advanced task categorization and recommendation system
- Social features for collaborative task completion
- Leaderboards and achievement badges
- Integration with other Solana-based protocols