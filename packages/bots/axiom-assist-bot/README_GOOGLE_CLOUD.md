# Google Cloud Integration for Axiom ID

This document provides an overview of the Google Cloud technologies integrated into the Axiom ID project.

## 🚀 Technologies Implemented

### 1. Cloud Tasks
Asynchronous task processing for complex AI operations.

**Key Files:**
- `api/chat-socket.mjs` - Task creation and management
- `test-cloud-tasks.mjs` - Integration testing

**Usage:**
```bash
npm run test:cloud-tasks
```

### 2. Model Armor
Security layer for prompt and response validation.

**Key Files:**
- `model-armor-service.mjs` - Security service implementation
- `test-model-armor.mjs` - Security testing

**Usage:**
```bash
npm run test:model-armor
```

### 3. ADK Agents
Python-based AI agents for specialized tasks.

**Key Files:**
- `adk-agents/main.py` - Agent implementation
- `adk-agents/requirements.txt` - Dependencies

**Usage:**
```bash
cd adk-agents
pip install -r requirements.txt
python main.py
```

### 4. MCP Server
Model Context Protocol server for tool integration.

**Key Files:**
- `mcp-server/main.py` - MCP server implementation
- `mcp-server/requirements.txt` - Dependencies

### 5. Jules Integration
Autonomous coding agent setup.

**Key Files:**
- `install-jules.mjs` - Installation script

**Usage:**
```bash
npm run install:jules
```

## 🧪 Testing

Run all tests:
```bash
npm run test:cloud-tasks
npm run test:model-armor
npm run test:adk-agent
```

## ⚙️ Configuration

Required environment variables:
- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_CLOUD_REGION`
- `GOOGLE_CLOUD_TASKS_QUEUE`
- `GOOGLE_CLOUD_SERVICE_ACCOUNT`
- `AGENT_SERVICE_URL`
- `MODEL_ARMOR_TEMPLATE_ID`
- `GOOGLE_CLOUD_ACCESS_TOKEN`

## 📚 Documentation

- `IMPLEMENTATION_SUMMARY.md` - Detailed implementation overview
- `FINAL_IMPLEMENTATION_SUMMARY.md` - Comprehensive final summary