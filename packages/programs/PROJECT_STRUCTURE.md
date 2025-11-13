# Axiom ID Project Structure

This document outlines the organized structure of the Axiom ID project repository.

## 📁 Root Directory

```
/Users/cryptojoker710/Desktop/Axiom ID/
├── LICENSE                    # Project license (Apache 2.0)
├── README.md                  # Main project overview
├── axiom_id/                  # Main project files (this directory)
└── axiom-assist-bot/          # AI assistant bot implementation
```

## 📁 Main Project (axiom_id/)

```
axiom_id/
├── Anchor.toml                # Solana Anchor configuration
├── Cargo.toml                 # Rust workspace configuration
├── Cargo.lock                 # Rust dependencies lock file
├── package.json               # Node.js dependencies and scripts
├── README.md                  # Project-specific README
├── LICENSE                    # Project license
├── programs/                  # Solana smart contracts
│   ├── axiom_id/             # Core identity program
│   ├── axiom_staking/        # Staking mechanisms
│   ├── axiom_attestations/   # Credential verification
│   └── ...                   # Other Solana programs
├── sdk/                      # JavaScript/TypeScript SDK
├── poc/                      # Proof of Concept implementations
├── docs/                     # Documentation and whitepapers
├── examples/                 # Usage examples
├── tests/                    # Integration tests
├── fraud-detection/          # AI-based fraud detection system
├── payments/                 # Cross-agent payment protocols
├── tma/                      # Telegram Mini Apps integration
└── ...                       # Other project components
```

## 📁 Documentation (axiom_id/docs/)

The docs directory contains all project documentation:

- **Whitepaper Materials**: Technical specifications and research
- **API Documentation**: SDK and program interfaces
- **Launch Materials**: Marketing and community content
- **Guides**: Quick start and integration guides
- **Governance**: Project policies and contribution guidelines

## 📁 AI Assistant Bot (axiom-assist-bot/)

Separate directory for the AI assistant implementation:

```
axiom-assist-bot/
├── index.mjs                 # Core logic and API functions
├── ingest.mjs                # Knowledge base ingestion
├── discord-bot.mjs           # Discord bot implementation
├── strategist.mjs            # Proactive strategic engine
├── system-prompt.txt         # Bot persona and behavior
├── strategist-prompt.txt     # Strategic thinking prompt
├── package.json              # Dependencies and scripts
└── ...                       # Other bot components
```

## 🎯 Key Benefits of This Structure

1. **Clear Separation**: Main project code is cleanly separated from bot implementation
2. **Organized Documentation**: All docs are centralized in the docs/ directory
3. **Standard Layout**: Follows conventional Solana and Node.js project structures
4. **Easy Navigation**: Clear hierarchy makes it easy to find specific components
5. **Shareable**: Clean structure suitable for open-source sharing

This organization ensures that the main project files are contained within the `axiom_id/` directory, making it easy to share and understand the core Axiom ID protocol implementation.