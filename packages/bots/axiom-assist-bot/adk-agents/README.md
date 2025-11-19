# Axiom ID Superpower Host

This is the Superpower Host service for the Axiom ID project. It's a Python-based service that dynamically loads and executes "superpowers" (specialized capabilities) and can be deployed to Google Cloud Run.

## Overview

The Superpower Host is designed to:

1. Dynamically discover and load superpowers from the `superpowers/` directory
2. Expose a REST API endpoint for processing tasks
3. Execute specific superpowers based on task requirements
4. Send results back to the orchestrator via callback

## Architecture

```
Superpower Host
├── REST API (/process-task)
├── Dynamic Superpower Loader
├── Superpowers Directory
│   ├── BaseSuperpower (abstract class)
│   ├── WebScraperPower
│   ├── TextAnalyzerPower
│   └── GetWeatherPower
└── Callback Mechanism
```

## API Endpoints

### POST /process-task

Process a task by executing a specific superpower.

**Request Body:**
```json
{
  "power_name": "name_of_superpower",
  "payload": {"key": "value"},
  "callback_url": "http://orchestrator/callback",
  "taskId": "unique-task-id"
}
```

**Response:**
```json
{
  "status": "processing_complete"
}
```

### GET /health

Check the health of the service and list loaded superpowers.

**Response:**
```json
{
  "status": "ok",
  "superpowers": ["web_scraping", "text_analysis", "get_weather"],
  "count": 3
}
```

### GET /superpowers

List all available superpowers.

**Response:**
```json
{
  "superpowers": ["web_scraping", "text_analysis", "get_weather"],
  "count": 3
}
```

## Adding New Superpowers

To add a new superpower:

1. Create a new Python file in the `superpowers/` directory
2. Inherit from `BaseSuperpower`
3. Implement the `get_name()` and `execute()` methods
4. The Superpower Host will automatically discover and load the new superpower

**Example:**
```python
from .base_power import BaseSuperpower

class MySuperpower(BaseSuperpower):
    def get_name(self) -> str:
        return "my_superpower"
    
    async def execute(self, payload: dict) -> dict:
        # Implement your superpower logic here
        return {"status": "success", "result": "Superpower executed!"}
```

## Deployment

To deploy the Superpower Host to Google Cloud Run:

1. Ensure you have `gcloud` CLI installed and configured
2. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

3. Or manually deploy using:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/axiom-superpower-host .
   gcloud run deploy axiom-superpower-host --image gcr.io/[PROJECT_ID]/axiom-superpower-host --platform managed
   ```

## Testing

To test the superpower host locally:

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r superpowers/requirements.txt
   ```

2. Run the service:
   ```bash
   python main.py
   ```

3. Test with curl:
   ```bash
   curl -X POST http://localhost:8080/process-task -H "Content-Type: application/json" -d '{
     "power_name": "web_scraping",
     "payload": {"url": "https://httpbin.org/html"},
     "callback_url": "http://localhost:3002/adk-callback",
     "taskId": "test-task-123"
   }'
   ```

## Superpower Interface

All superpowers must inherit from `BaseSuperpower` and implement:

- `get_name() -> str`: Return the unique name of the superpower
- `execute(payload: dict) -> dict`: Execute the superpower with the given payload

The superpower should return a dictionary with the results of the execution.