# Axiom ID

A decentralized identity verification system built on the Solana blockchain using the Anchor framework.

## Overview

Axiom ID is a secure, configurable, and dedicated development environment for creating and managing decentralized identities on the Solana blockchain. This project provides a robust foundation for identity verification services in Web3 applications.

## Features

- Decentralized identity creation and management
- Secure verification processes
- Integration with Solana blockchain
- Built with Rust and Anchor framework
- TypeScript frontend for user interactions
- Wallet integration for Solana networks
- Trustless agent-to-agent (A2A) commerce capabilities

## Project Structure

```
axiom_id/
├── programs/          # Solana programs (Rust)
│   └── axiom_id/      # Main program
│       ├── src/       # Program source code
│       └── Cargo.toml # Program dependencies
├── landing/           # Frontend application (React + TypeScript)
├── tests/             # Integration tests
├── migrations/        # Deployment scripts
├── scripts/           # Utility scripts
├── target/            # Build artifacts
└── target/deploy/     # Deployed program files
```

## Prerequisites

- Rust and Cargo
- Solana CLI tools
- Node.js and npm
- Anchor framework

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Build the program with `anchor build`
4. Run tests with `anchor test`

## Deployment

The project can be deployed to Solana devnet or mainnet using the provided scripts.

### Local Development

```bash
# Start local validator
solana-test-validator

# Build and deploy locally
anchor build
anchor deploy

# Run tests
anchor test
```

## Development

### Solana Program

The core logic is implemented in the `programs/axiom_id/src/lib.rs` file using the Anchor framework.

### Frontend

The frontend is built with React and TypeScript, providing a user interface for interacting with the Solana program.

### Testing

Tests are written in TypeScript and can be found in the `tests/` directory.

## API Reference

### Instructions

- `create_identity`: Creates a new identity account
- `get_identity`: Fetches an existing identity account

### Accounts

- `AxiomAiIdentity`: The main identity account structure

## Contact Information

- **Name**: Mohamed Hossameldin Abdelaziz
- **Email**: amrikyy@gmail.com
- **Student Email**: mabdela1@students.kennesaw.edu
- **Phone (Egypt)**: +201094228044 (WhatsApp)
- **Phone (US)**: +17706160211

## Social Media

- **GitHub**: https://github.com/Moeabdelaziz007/axiom-id
- **Facebook**: https://www.facebook.com/profile.php?id=61583477974464&locale=ar_AR
- **Instagram**: https://www.instagram.com/axiom_id/

## Deployment Information

The landing page is deployed to the custom domain: **axiomid.app**

## Formspree Configuration

The waiting list form is configured to submit data to Formspree endpoint: https://formspree.io/f/xblqrblj
The form includes localStorage fallback functionality for offline/error scenarios.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.