# Axiom ID Test Plan

This document outlines the comprehensive testing strategy for the Axiom ID project, covering all components and integration points.

## 1. Test Strategy Matrix

| Test Type | Tool/Framework | Objective | Component |
|-----------|----------------|-----------|-----------|
| Unit Testing | Jest (Node.js) | Isolate and test orchestrator logic | AxiomOrchestrator (Node.js) |
| Unit Testing | pytest (Python) | Isolate and test agent logic and tools | AxiomAgentService (Python) |
| Integration Testing | TestContainers, WireMock | Test service communication and API mocking | Orchestrator <-> Cloud Tasks <-> ADK Agent |
| Agent Performance Testing | ADK User Simulation | Evaluate agent intent fulfillment in dynamic conversations | AxiomAgentService (ADK) |
| Frontend Testing | Chrome DevTools MCP | AI-driven automated frontend testing | Holo-Core (Render.com) |
| Security Testing | OWASP ZAP + Custom Scripts | Verify Model Armor effectiveness against prompt injection | Model Armor / AxiomOrchestrator Endpoint |

## 2. Unit & Integration Testing for Microservices

### 2.1 Node.js Orchestrator Testing (Jest)

**File:** `tests/orchestrator.test.js`

**Test Cases:**
1. Constructor initializes properties correctly
2. Task registration works properly
3. User query handling routes to gems or system body
4. Callback endpoint setup
5. Health check endpoint setup

**Command:** `npm run test:unit`

### 2.2 Model Armor Service Testing (Jest)

**File:** `tests/model-armor-service.test.js`

**Test Cases:**
1. Service initialization
2. User prompt sanitization with safe content
3. User prompt sanitization with threats detected
4. Model response sanitization with safe content
5. Model response sanitization with sensitive data
6. Error handling for API failures

**Command:** `npm run test:unit`

### 2.3 Cloud Tasks Integration Testing (Jest)

**File:** `tests/cloud-tasks.integration.test.js`

**Test Cases:**
1. Task creation with correct parameters
2. Base64 payload encoding
3. OIDC authentication setup
4. Error handling for task creation failures

**Command:** `npm run test:integration`

### 2.4 Python Agent Testing (pytest)

**Files:** 
- `adk-agents/tests/test_agent.py` (to be created)
- `mcp-server/tests/test_mcp_server.py` (to be created)

**Test Cases:**
1. Agent initialization
2. Payload processing
3. Callback mechanism
4. Error handling
5. MCP tool integration

## 3. Agent Performance Testing with ADK User Simulation

### 3.1 Configuration File

**File:** `test-configs/eval_config.json`

**Scenarios:**
1. User search and interaction summary
2. System status checking
3. Agent creation assistance

### 3.2 Execution

**Command:** `adk eval /path/to/agent --config_file_path /path/to/eval_config.json`

## 4. Frontend Testing with Chrome DevTools MCP

### 4.1 Test Cases

**File:** `tests/chrome-devtools.test.js` (placeholder)

**Test Cases:**
1. Console message analysis
2. Network request monitoring
3. Script evaluation in browser context
4. DOM element interaction
5. Automated login flows
6. UI component behavior verification

## 5. Security Penetration Testing for Model Armor

### 5.1 Test File

**File:** `tests/model-armor-security.test.js`

### 5.2 Test Cases

#### Prompt Injection Attacks
- Direct prompt injection attempts
- Indirect prompt injection attempts

#### PII Protection
- Credit card number detection
- Social security number detection

#### Malicious URL Detection
- Known phishing URL detection

#### Harmful Content Filtering
- Instructions for illegal activities
- Security bypass techniques

**Command:** `npm run test:security`

## 6. Test Execution Commands

### 6.1 Individual Test Suites
```bash
# Run unit tests
npm run test:unit

# Run security tests
npm run test:security

# Run integration tests
npm run test:integration

# Run Cloud Tasks tests
npm run test:cloud-tasks

# Run Model Armor tests
npm run test:model-armor

# Run ADK Agent tests
npm run test:adk-agent
```

### 6.2 All Tests
```bash
# Run all tests
npm run test:all

# Run all tests with detailed output
npm run test:run-all
```

## 7. Test Coverage Requirements

### 7.1 Minimum Coverage Thresholds
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### 7.2 Coverage Reports
- JSON format for CI/CD integration
- HTML format for local review
- LCOV format for coverage tools

## 8. Continuous Integration

### 8.1 Pre-commit Hooks
- Run unit tests before commit
- Check test coverage thresholds
- Validate code quality

### 8.2 CI Pipeline
- Run all test suites on pull requests
- Generate coverage reports
- Block merges if tests fail or coverage is below threshold

## 9. Test Data Management

### 9.1 Test Environment Variables
- `TEST_GOOGLE_CLOUD_PROJECT_ID`
- `TEST_GOOGLE_CLOUD_REGION`
- `TEST_GOOGLE_CLOUD_TASKS_QUEUE`
- `TEST_GOOGLE_CLOUD_SERVICE_ACCOUNT`
- `TEST_AGENT_SERVICE_URL`

### 9.2 Mock Services
- Firestore emulator for database testing
- WireMock for external API simulation
- TestContainers for isolated service testing

## 10. Performance Testing

### 10.1 Metrics
- Response time for user queries
- Task processing time
- Concurrent request handling
- Memory usage under load

### 10.2 Tools
- Jest for unit performance
- Custom scripts for integration performance
- Load testing tools for stress testing

## 11. Test Reporting

### 11.1 Automated Reports
- Test results summary
- Coverage reports
- Performance metrics
- Security scan results

### 11.2 Manual Reports
- Test plan execution status
- Defect reports
- Performance benchmarking
- Security vulnerability assessments# Axiom ID Test Plan

This document outlines the comprehensive testing strategy for the Axiom ID project, covering all components and integration points.

## 1. Test Strategy Matrix

| Test Type | Tool/Framework | Objective | Component |
|-----------|----------------|-----------|-----------|
| Unit Testing | Jest (Node.js) | Isolate and test orchestrator logic | AxiomOrchestrator (Node.js) |
| Unit Testing | pytest (Python) | Isolate and test agent logic and tools | AxiomAgentService (Python) |
| Integration Testing | TestContainers, WireMock | Test service communication and API mocking | Orchestrator <-> Cloud Tasks <-> ADK Agent |
| Agent Performance Testing | ADK User Simulation | Evaluate agent intent fulfillment in dynamic conversations | AxiomAgentService (ADK) |
| Frontend Testing | Chrome DevTools MCP | AI-driven automated frontend testing | Holo-Core (Render.com) |
| Security Testing | OWASP ZAP + Custom Scripts | Verify Model Armor effectiveness against prompt injection | Model Armor / AxiomOrchestrator Endpoint |

## 2. Unit & Integration Testing for Microservices

### 2.1 Node.js Orchestrator Testing (Jest)

**File:** `tests/orchestrator.test.js`

**Test Cases:**
1. Constructor initializes properties correctly
2. Task registration works properly
3. User query handling routes to gems or system body
4. Callback endpoint setup
5. Health check endpoint setup

**Command:** `npm run test:unit`

### 2.2 Model Armor Service Testing (Jest)

**File:** `tests/model-armor-service.test.js`

**Test Cases:**
1. Service initialization
2. User prompt sanitization with safe content
3. User prompt sanitization with threats detected
4. Model response sanitization with safe content
5. Model response sanitization with sensitive data
6. Error handling for API failures

**Command:** `npm run test:unit`

### 2.3 Cloud Tasks Integration Testing (Jest)

**File:** `tests/cloud-tasks.integration.test.js`

**Test Cases:**
1. Task creation with correct parameters
2. Base64 payload encoding
3. OIDC authentication setup
4. Error handling for task creation failures

**Command:** `npm run test:integration`

### 2.4 Python Agent Testing (pytest)

**Files:** 
- `adk-agents/tests/test_agent.py` (to be created)
- `mcp-server/tests/test_mcp_server.py` (to be created)

**Test Cases:**
1. Agent initialization
2. Payload processing
3. Callback mechanism
4. Error handling
5. MCP tool integration

## 3. Agent Performance Testing with ADK User Simulation

### 3.1 Configuration File

**File:** `test-configs/eval_config.json`

**Scenarios:**
1. User search and interaction summary
2. System status checking
3. Agent creation assistance

### 3.2 Execution

**Command:** `adk eval /path/to/agent --config_file_path /path/to/eval_config.json`

## 4. Frontend Testing with Chrome DevTools MCP

### 4.1 Test Cases

**File:** `tests/chrome-devtools.test.js` (placeholder)

**Test Cases:**
1. Console message analysis
2. Network request monitoring
3. Script evaluation in browser context
4. DOM element interaction
5. Automated login flows
6. UI component behavior verification

## 5. Security Penetration Testing for Model Armor

### 5.1 Test File

**File:** `tests/model-armor-security.test.js`

### 5.2 Test Cases

#### Prompt Injection Attacks
- Direct prompt injection attempts
- Indirect prompt injection attempts

#### PII Protection
- Credit card number detection
- Social security number detection

#### Malicious URL Detection
- Known phishing URL detection

#### Harmful Content Filtering
- Instructions for illegal activities
- Security bypass techniques

**Command:** `npm run test:security`

## 6. Test Execution Commands

### 6.1 Individual Test Suites
```bash
# Run unit tests
npm run test:unit

# Run security tests
npm run test:security

# Run integration tests
npm run test:integration

# Run Cloud Tasks tests
npm run test:cloud-tasks

# Run Model Armor tests
npm run test:model-armor

# Run ADK Agent tests
npm run test:adk-agent
```

### 6.2 All Tests
```bash
# Run all tests
npm run test:all

# Run all tests with detailed output
npm run test:run-all
```

## 7. Test Coverage Requirements

### 7.1 Minimum Coverage Thresholds
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### 7.2 Coverage Reports
- JSON format for CI/CD integration
- HTML format for local review
- LCOV format for coverage tools

## 8. Continuous Integration

### 8.1 Pre-commit Hooks
- Run unit tests before commit
- Check test coverage thresholds
- Validate code quality

### 8.2 CI Pipeline
- Run all test suites on pull requests
- Generate coverage reports
- Block merges if tests fail or coverage is below threshold

## 9. Test Data Management

### 9.1 Test Environment Variables
- `TEST_GOOGLE_CLOUD_PROJECT_ID`
- `TEST_GOOGLE_CLOUD_REGION`
- `TEST_GOOGLE_CLOUD_TASKS_QUEUE`
- `TEST_GOOGLE_CLOUD_SERVICE_ACCOUNT`
- `TEST_AGENT_SERVICE_URL`

### 9.2 Mock Services
- Firestore emulator for database testing
- WireMock for external API simulation
- TestContainers for isolated service testing

## 10. Performance Testing

### 10.1 Metrics
- Response time for user queries
- Task processing time
- Concurrent request handling
- Memory usage under load

### 10.2 Tools
- Jest for unit performance
- Custom scripts for integration performance
- Load testing tools for stress testing

## 11. Test Reporting

### 11.1 Automated Reports
- Test results summary
- Coverage reports
- Performance metrics
- Security scan results

### 11.2 Manual Reports
- Test plan execution status
- Defect reports
- Performance benchmarking
- Security vulnerability assessments