# Axiom DevOps Agent - Admin Powers Summary

## Overview

This document provides a summary of the two new "Admin" level superpowers that have been added to your Axiom DevOps Agent:

1. **Render Admin Power** - Manages Render.com services
2. **GitHub Admin Power** - Manages GitHub repositories

## Render Admin Power

### Capabilities
- `ADD_ENV_VAR`: Add or update environment variables on Render services
- `TRIGGER_DEPLOY`: Trigger a new deployment on Render
- `GET_LOGS`: Retrieve logs from Render services

### Usage Example
```python
from adk_agents.superpowers.render_admin_power import RenderAdminPower

render_power = RenderAdminPower()
result = await render_power.execute({
    "action": "ADD_ENV_VAR",
    "render_api_key": "your_render_api_key",
    "service_id": "your_render_service_id",
    "env_key": "TEST_KEY",
    "env_value": "test_value"
})
```

## GitHub Admin Power

### Capabilities
- `CREATE_WEBHOOK`: Create webhooks on GitHub repositories
- `CREATE_TEST_PR`: Create automated test pull requests
- `CHECK_PR_COMMENTS`: Check comments on pull requests

### Usage Example
```python
from adk_agents.superpowers.github_admin_power import GitHubAdminPower

github_power = GitHubAdminPower()
result = await github_power.execute({
    "action": "CREATE_TEST_PR",
    "github_token": "your_github_pat",
    "repo_full_name": "Moeabdelaziz007/axiom-stack"
})
```

## Setup Requirements

### Environment Variables
Add these to your `.env` file:
```env
RENDER_API_KEY=your_render_api_key_here
GITHUB_PAT=your_github_personal_access_token_here
```

### Required Permissions

#### Render API Key
- Go to Render Dashboard > Account Settings > API Keys
- Create a new API key with appropriate permissions

#### GitHub Personal Access Token
- Go to GitHub Settings > Developer settings > Personal access tokens
- Create a Fine-grained token with these permissions:
  - `repo` (full control of private repositories)
  - `admin:repo_hook` (Read and write webhooks)

## Testing

Run the provided test scripts to verify everything is working:

```bash
# Check environment setup
python setup_admin_powers.py

# Run full integration test
python test_admin_powers.py
```

## Security Notes

These are "Admin" level powers with significant capabilities:
- Keep your API keys secure and never commit them to version control
- Use the principle of least privilege when creating tokens
- Regularly rotate your API keys for enhanced security