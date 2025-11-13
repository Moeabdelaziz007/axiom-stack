# Axiom Stack Project Structure

## Overview

This document outlines the structure of the Axiom Stack monorepo and the key components that have been implemented.

## Directory Structure

```
/axiom-stack/
├── .github/
│   └── workflows/
│       ├── axiom-ci.yml          # Unified CI for all programs
│       ├── assist-bot-ci.yml     # CI for the assist bot
│       └── strategist.yml        # Proactive AI Strategist
├── docs/
│   ├── README.md                 # Master documentation
│   ├── whitepaper.md             # The unified vision
│   └── PROJECT_STRUCTURE.md      # This document
├── packages/
│   ├── programs/
│   │   ├── axiom_id/             # Identity program
│   │   ├── axiom_staking/        # Staking program
│   │   ├── axiom_pohw/           # Proof of Human Work program
│   │   ├── axiom_attestations/   # Attestations program
│   │   └── zentix_protocol/      # Economic layer (placeholder)
│   ├── sdks/
│   │   └── axiom-sdk/            # Unified TypeScript SDK
│   ├── bots/
│   │   └── axiom-assist-bot/     # Discord/Web bot
│   └── web/
│       └── landing-page/         # Next.js landing page
├── package.json                  # Root package.json for workspaces
└── README.md                     # Master README
```

## Key Implementation Highlights

### 1. Monorepo Structure
- ✅ Created unified directory structure
- ✅ Organized code into logical packages
- ✅ Set up workspace configuration for easy management

### 2. Unified SDK
- ✅ Created `@axiom-stack/sdk` package
- ✅ Implemented client classes for all programs
- ✅ Defined TypeScript types for all data structures
- ✅ Set up build and test configurations

### 3. CI/CD Pipeline
- ✅ Created `axiom-ci.yml` for unified testing
- ✅ Created `assist-bot-ci.yml` for bot-specific testing
- ✅ Created `strategist.yml` for proactive AI workflows

### 4. Cross-Program Integration
- ✅ Designed CPI connection between Zentix and Axiom Staking
- ✅ Implemented reputation-based access control for flash loans
- ✅ Created placeholder for Zentix Protocol with proper dependencies

### 5. Documentation
- ✅ Created comprehensive whitepaper
- ✅ Updated root README with architecture overview
- ✅ Documented project structure

### 6. Bot Integration
- ✅ Modified ingest.mjs to read from entire monorepo
- ✅ Expanded file types supported for knowledge base
- ✅ Improved path resolution for monorepo structure

## Next Steps

1. **Implement Zentix Protocol**: Complete the economic layer implementation
2. **Integrate with Existing Code**: Move existing program code into the new structure
3. **Test Cross-Program Calls**: Verify CPI connections work correctly
4. **Deploy Infrastructure**: Set up continuous deployment for all components
5. **Expand SDK**: Add more comprehensive client methods and examples

## Benefits of This Structure

1. **Unified Development**: All components in one repository for easier coordination
2. **Shared Dependencies**: Common libraries and tools managed centrally
3. **Consistent Testing**: Unified test infrastructure across all components
4. **Streamlined CI/CD**: Single pipeline for building and testing the entire stack
5. **Better Documentation**: Centralized documentation for the entire ecosystem
6. **Easier Onboarding**: New contributors can understand the entire system more easily