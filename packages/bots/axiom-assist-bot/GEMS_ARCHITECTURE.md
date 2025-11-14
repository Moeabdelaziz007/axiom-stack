# Axiom ID Gems System - Google Architecture Implementation

This document explains how the Axiom ID system implements Google's "Gems" concept and architecture patterns.

## Overview

The Axiom ID Gems system is a direct implementation of Google's official architecture pattern, where:

- **AxiomOrchestrator** = Google Workspace Flow (central coordination layer)
- **HumanMind Gems** = Google Gems (specialized AI assistants)
- **SystemBody** = Google Actions (general processing layer)

## Architecture Mapping

### 1. Google Workspace Flow = AxiomOrchestrator
The central coordination component that routes requests to appropriate specialized components.

### 2. Google Gems = HumanMind Gems
Specialized AI assistants with specific skills:
- **AxiomRustDebugger** (skill_debug_rust) - Debugs Rust code issues
- **AxiomCodePlanner** (skill_write_plan) - Plans code implementations

### 3. Google Actions = SystemBody
General processing layer that handles routine tasks and user queries.

## Implementation Details

### Gem Structure
Each Gem is implemented as a specialized class extending BaseGem with:
- Custom prompt templates
- Specific skill sets
- Conversation history management
- Automatic retry logic for API calls

### Gem Manager
The GemManager coordinates all Gems and provides:
- Automatic request routing based on keywords
- Gem instantiation and lifecycle management
- Fallback mechanisms to SystemBody

### Integration with Orchestrator
The AxiomOrchestrator now uses the GemManager to:
1. Route user queries to specialized Gems when appropriate
2. Fall back to SystemBody for general queries
3. Maintain conversation context across interactions

## Available Gems

### AxiomRustDebugger
Specialized for debugging Rust code within the Axiom ID ecosystem:
- Analyzes Rust code snippets and identifies potential issues
- Explains compiler error messages in plain language
- Suggests fixes for common Rust programming mistakes
- Helps optimize Rust code for better performance

### AxiomCodePlanner
Specialized for planning code implementations within the Axiom ID ecosystem:
- Breaks down complex requirements into manageable components
- Designs system architectures and data flows
- Creates implementation plans with clear steps
- Identifies potential challenges and risks

## Usage Examples

1. "I'm getting a borrow checker error in my Rust code" 
   → Automatically routed to AxiomRustDebugger

2. "I need to implement a new feature for attestation templates"
   → Automatically routed to AxiomCodePlanner

3. "How does the Axiom ID reputation system work?"
   → Routed to SystemBody for general knowledge queries

## Benefits of This Architecture

1. **Specialization**: Each Gem has deep expertise in specific domains
2. **Scalability**: New Gems can be added for new skill areas
3. **Context Awareness**: Gems maintain conversation history
4. **Fallback Safety**: System gracefully degrades to general processing
5. **Google-Aligned**: Follows official Google architecture patterns

## Future Expansion

The system can easily accommodate new Gems for additional skills:
- AxiomSecurityAuditor (skill_audit_security)
- AxiomPerformanceOptimizer (skill_optimize_performance)
- AxiomDocumentationWriter (skill_write_docs)