# The Axiom Stack

The world's first open-source, decentralized stack for the Autonomous Agent (AA) Economy.

## Overview

The Axiom Stack is a unified ecosystem consisting of three layers:

1. **Layer 1: Axiom ID (The Identity Layer)** - Answers "Who is this Agent?" and "Can it be trusted?"
2. **Layer 2: Zentix Protocol (The Economic Layer)** - Answers "What can this Agent do?" and "How does it get capital?"
3. **Layer 3: Axiom Assist Bot (The Interface Layer)** - Answers "How do humans support and grow this ecosystem?"

## Architecture

```
/axiom-stack/
├── .github/
│   └── workflows/
├── docs/
├── packages/
│   ├── programs/
│   │   ├── axiom_id/
│   │   ├── axiom_staking/
│   │   ├── axiom_pohw/
│   │   ├── axiom_attestations/
│   │   └── zentix_protocol/
│   ├── sdks/
│   │   └── axiom-sdk/
│   ├── bots/
│   │   └── axiom-assist-bot/
│   └── web/
│       └── landing-page/
├── package.json
└── README.md
```

## Key Components

### Layer 1: Axiom ID (Identity Layer)
- **Identity Program**: Core identity management for autonomous agents
- **Staking Program**: Token staking and reputation management
- **PoHW Program**: Proof of Human Work verification and reward system
- **Attestations Program**: Third-party verification framework

### Layer 2: Zentix Protocol (Economic Layer)
- **Flash Loans**: Instant capital access for AI agents
- **Strategy Engines**: Automated trading and investment strategies
- **Risk Management**: Built-in risk controls for agent activities

### Layer 3: Axiom Assist Bot (Interface Layer)
- **Discord Bot**: Real-time support and community engagement
- **Web API**: Programmatic access to ecosystem functions
- **Strategic Engine**: Proactive growth and optimization strategies
- **RAG System**: Retrieval-Augmented Generation for intelligent responses

## Getting Started

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

## Development

### Prerequisites
- Rust and Cargo
- Solana CLI tools
- Node.js and npm
- Anchor framework

### Building Programs
```bash
cd packages/programs
anchor build
```

### Running Tests
```bash
cd packages/programs
anchor test
```

### Building SDK
```bash
cd packages/sdks/axiom-sdk
npm run build
```

## Documentation

- [Whitepaper](docs/whitepaper.md)
- [API Documentation](packages/sdks/axiom-sdk/README.md)
- [Program Documentation](packages/programs/README.md)

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.