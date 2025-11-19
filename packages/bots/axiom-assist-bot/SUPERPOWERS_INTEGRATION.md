# Superpowers Integration for Axiom ID

This document describes the integration of the "Superpowers" concept into the Axiom ID project, transforming the architecture to support dynamic capability-based agent routing.

## Overview

The Superpowers integration restructures the Axiom ID architecture to move from a monolithic ADK agent approach to a dynamic, capability-based system where agents can be assigned specific superpowers (capabilities) and tasks are routed to the most appropriate agent based on required capabilities.

## Key Components

### 1. Superpowers Directory Structure

The ADK agents now include a `superpowers` directory that contains modular capability implementations:

```
adk-agents/
├── superpowers/
│   ├── __init__.py
│   ├── base_power.py          # Abstract base class for all superpowers
│   ├── web_scraper.py         # Web scraping capability
│   └── text_analyzer.py       # Text analysis capability
```

### 2. BaseSuperpower Abstract Class

All superpowers inherit from the `BaseSuperpower` abstract class, ensuring a consistent interface:

```python
class BaseSuperpower(ABC):
    @abstractmethod
    def get_name(self) -> str:
        pass

    @abstractmethod
    async def execute(self, payload: dict) -> dict:
        pass
```

### 3. Superpower Implementations

Example superpower implementation:

```python
class WebScraperPower(BaseSuperpower):
    def get_name(self) -> str:
        return "web_scraping"
    
    async def execute(self, payload: dict) -> dict:
        # Implementation for web scraping
        pass
```

### 4. Enhanced ADK Agent (main.py)

The ADK agent has been refactored to:

1. Dynamically load available superpowers at startup
2. Execute specific superpowers based on task requirements
3. Maintain backward compatibility for general queries

Key changes:
- Added `load_superpowers()` method to discover and load superpowers
- Modified `execute()` method to route tasks to appropriate superpowers
- Added support for capability-based task execution

### 5. Task Service (task-service.mjs)

A new TaskService class handles capability-based task routing:

- Finds agents with required capabilities in Firestore
- Creates Cloud Tasks for specific agents based on capabilities
- Manages agent registration with capabilities

### 6. Enhanced Orchestrator (orchestrator.mjs)

The orchestrator now includes:

- `determineRequiredCapability()` method for capability detection
- `createAgentTask()` method for capability-based task creation
- Integration with TaskService for agent routing

### 7. Updated Socket Server (chat-socket.mjs)

The socket server now uses the orchestrator's capability-based task creation method.

### 8. Firestore Schema Updates

Agents are now registered in Firestore with their capabilities:

```json
{
  "agentId": "uuid-...",
  "cloudRunUrl": "https://...",
  "status": "idle",
  "capabilities": ["web_scraping", "text_analysis"]
}
```

## Task Routing Flow

1. User sends a request through the socket interface
2. Orchestrator analyzes the request to determine required capabilities
3. TaskService queries Firestore for agents with the required capability
4. TaskService creates a Cloud Task for the selected agent
5. Agent receives the task and executes the appropriate superpower
6. Agent sends results back to the orchestrator via callback
7. Orchestrator forwards results to the user

## Benefits

1. **Dynamic Capability Assignment**: Agents can be assigned specific capabilities dynamically
2. **Scalability**: New capabilities can be added without modifying core architecture
3. **Efficiency**: Tasks are routed to the most appropriate agent
4. **Flexibility**: Agents can host multiple capabilities
5. **Maintainability**: Modular superpower implementations are easier to maintain

## Future Enhancements

1. **Advanced Capability Detection**: Use AI/ML models for more sophisticated capability detection
2. **Load Balancing**: Implement load balancing algorithms for agent selection
3. **Capability Reputation System**: Track agent performance for each capability
4. **Dynamic Capability Loading**: Allow agents to load/unload capabilities at runtime
5. **Capability Chaining**: Enable tasks that require multiple capabilities in sequence