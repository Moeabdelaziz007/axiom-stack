# Superpowers

This directory contains modular capability implementations for the Axiom ID ADK agents.

## Overview

Superpowers are specialized capabilities that can be dynamically loaded and executed by ADK agents. Each superpower is implemented as a Python class that inherits from the `BaseSuperpower` abstract class.

## Structure

```
superpowers/
├── __init__.py          # Makes this directory a Python package
├── base_power.py        # Abstract base class for all superpowers
├── requirements.txt     # Dependencies for superpowers
├── web_scraper.py       # Web scraping capability
└── text_analyzer.py     # Text analysis capability
```

## Creating a New Superpower

1. Create a new Python file in this directory (e.g., `my_superpower.py`)
2. Import the `BaseSuperpower` class: `from .base_power import BaseSuperpower`
3. Create a class that inherits from `BaseSuperpower`
4. Implement the required methods:
   - `get_name()` - Return a unique name for the superpower
   - `execute(payload)` - Implement the superpower logic
5. The ADK agent will automatically discover and load the new superpower

## Example Superpower Implementation

```python
from .base_power import BaseSuperpower

class MySuperpower(BaseSuperpower):
    def get_name(self) -> str:
        return "my_superpower"
    
    async def execute(self, payload: dict) -> dict:
        # Implement your superpower logic here
        return {"status": "success", "result": "Superpower executed!"}
```

## Available Superpowers

### Web Scraper (`web_scraping`)
Scrapes content from web pages.

**Payload:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "url": "https://example.com",
  "status_code": 200,
  "content_length": 1234,
  "content_preview": "..."
}
```

### Text Analyzer (`text_analysis`)
Analyzes text for word count, character count, sentence count, and extracts keywords.

**Payload:**
```json
{
  "text": "Your text to analyze..."
}
```

**Response:**
```json
{
  "status": "success",
  "analysis": {
    "word_count": 100,
    "character_count": 500,
    "sentence_count": 10,
    "paragraph_count": 5,
    "top_keywords": [
      {"word": "example", "frequency": 5},
      {"word": "text", "frequency": 3}
    ]
  }
}
```

## Adding Dependencies

If your superpower requires additional dependencies, add them to the `requirements.txt` file in this directory.

## Testing Superpowers

To test superpowers, you can run the superpowers test script from the parent directory:

```bash
npm run test:superpowers
```