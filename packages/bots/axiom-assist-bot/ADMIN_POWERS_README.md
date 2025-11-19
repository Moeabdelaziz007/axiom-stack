# Admin Powers Setup and Usage Guide

This guide explains how to set up and use the Render and GitHub Admin Powers for your Axiom DevOps Agent.

## 🔐 Setup Instructions

### 1. Render API Key Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Navigate to **Account Settings** > **API Keys**
3. Create a new API key with appropriate permissions
4. Save this key securely (you'll need it in the next step)

### 2. GitHub Personal Access Token Setup

1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Navigate to **Developer settings** > **Personal access tokens** > **Fine-grained tokens**
3. Click **Generate new token**
4. Select your repository (`Moeabdelaziz007/axiom-stack`)
5. Grant the following permissions:
   - `repo` (full control of private repositories)
   - `admin:repo_hook` (Read and write webhooks)
6. Generate and save the token securely

### 3. Environment Configuration

Set the following environment variables in your shell:

```bash
export RENDER_API_KEY=your_render_api_key_here
export GITHUB_PAT=your_github_personal_access_token_here
```

Alternatively, you can add them to your `.env` file:

```env
RENDER_API_KEY=your_render_api_key_here
GITHUB_PAT=your_github_personal_access_token_here
```

## 🧪 Testing the Admin Powers

### Automated Test Script

Run the automated test script to verify everything is working:

```bash
cd axiom-stack/packages/bots/axiom-assist-bot
python test_admin_powers.py
```

This script will:

1. Generate a new webhook secret
2. Add the secret as an environment variable to your Render service
3. Create a webhook on your GitHub repository
4. Create a test PR to trigger the DevOps workflow
5. Wait 2 minutes and check for comments from the Axiom-DevOps-Agent

### Setup Verification Script

You can also run the setup verification script to check your environment:

```bash
cd axiom-stack/packages/bots/axiom-assist-bot
python setup_admin_powers.py
```

### Manual Testing

You can also test the powers individually:

#### Render Admin Power

```python
from adk-agents.superpowers.render_admin_power import RenderAdminPower

render_power = RenderAdminPower()
result = render_power.execute({
    "action": "ADD_ENV_VAR",
    "render_api_key": "your_render_api_key",
    "service_id": "your_render_service_id",
    "env_key": "TEST_KEY",
    "env_value": "test_value"
})
print(result)
```

#### GitHub Admin Power

```python
from adk-agents.superpowers.github_admin_power import GitHubAdminPower

github_power = GitHubAdminPower()
result = github_power.execute({
    "action": "CREATE_TEST_PR",
    "github_token": "your_github_pat",
    "repo_full_name": "Moeabdelaziz007/axiom-stack"
})
print(result)
```

## 🛠️ Available Actions

### Render Admin Power

1. `ADD_ENV_VAR` - Add or update environment variables on Render services
2. `TRIGGER_DEPLOY` - Trigger a new deployment on Render
3. `GET_LOGS` - Retrieve logs from Render services

### GitHub Admin Power

1. `CREATE_WEBHOOK` - Create webhooks on GitHub repositories
2. `CREATE_TEST_PR` - Create automated test pull requests
3. `CHECK_PR_COMMENTS` - Check comments on pull requests

## 📋 Prerequisites

Make sure you have installed all required dependencies:

```bash
pip install -r adk-agents/superpowers/requirements.txt
```

This will install:
- `requests` (for Render API calls)
- `PyGithub` (for GitHub API calls)
- Other dependencies for existing superpowers

## 🎯 Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure your tokens have the correct permissions
2. **Service ID Errors**: Verify your Render service ID is correct
3. **Network Issues**: Check your internet connection and firewall settings

### Debugging

If the test fails, the script will automatically retrieve Render logs to help diagnose the issue.

You can also manually check logs:

```python
from adk-agents.superpowers.render_admin_power import RenderAdminPower

render_power = RenderAdminPower()
result = render_power.execute({
    "action": "GET_LOGS",
    "render_api_key": "your_render_api_key",
    "service_id": "your_render_service_id"
})
print(result)
```

## 📚 Additional Resources

- [Render API Documentation](https://render.com/docs/api)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Axiom DevOps Agent Documentation](#)