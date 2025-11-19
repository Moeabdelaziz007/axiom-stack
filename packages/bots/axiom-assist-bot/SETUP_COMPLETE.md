# Admin Powers Setup Complete ✅

Congratulations! You've successfully set up the Render and GitHub Admin Powers for your Axiom DevOps Agent. Here's a summary of what's been accomplished and what you need to do next.

## ✅ What's Been Done

1. **Created Admin Power Files**:
   - [x] `render_admin_power.py` - Controls Render.com services
   - [x] `github_admin_power.py` - Controls GitHub repositories

2. **Updated Dependencies**:
   - [x] Added `requests` library to `requirements.txt` for Render API calls
   - [x] Verified `PyGithub` is installed for GitHub API calls

3. **Environment Configuration**:
   - [x] Added `RENDER_API_KEY` and `GITHUB_PAT` to `.env` file
   - [x] Created verification scripts to check environment variables

4. **Testing**:
   - [x] Verified both admin powers can be imported and instantiated
   - [x] Confirmed all required dependencies are installed

## 🚀 Next Steps

To fully utilize these admin powers, you need to:

### 1. Get Your Actual API Keys

#### Render API Key
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Navigate to **Account Settings** > **API Keys**
3. Create a new API key with appropriate permissions
4. Copy the key

#### GitHub Personal Access Token
1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Navigate to **Developer settings** > **Personal access tokens** > **Fine-grained tokens**
3. Click **Generate new token**
4. Select your repository (`Moeabdelaziz007/axiom-stack`)
5. Grant the following permissions:
   - `repo` (full control of private repositories)
   - `admin:repo_hook` (Read and write webhooks)
6. Generate and copy the token

### 2. Update Your Environment Variables

Replace the placeholder values in your `.env` file:

```env
# Replace these placeholders with your actual keys
RENDER_API_KEY=your_actual_render_api_key_here
GITHUB_PAT=your_actual_github_personal_access_token_here
```

### 3. Test the Admin Powers

Run the full test suite:

```bash
cd axiom-stack/packages/bots/axiom-assist-bot
python test_admin_powers.py
```

This will:
1. Generate a new webhook secret
2. Add the secret as an environment variable to your Render service
3. Create a webhook on your GitHub repository
4. Create a test PR to trigger the DevOps workflow
5. Wait 2 minutes and check for comments from the Axiom-DevOps-Agent

## 🧪 Manual Testing

You can also test the powers individually:

### Render Admin Power
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

### GitHub Admin Power
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

## 🎯 Troubleshooting

If you encounter any issues:

1. **Permission Errors**: Ensure your tokens have the correct permissions
2. **Service ID Errors**: Verify your Render service ID is correct
3. **Network Issues**: Check your internet connection and firewall settings

You can run the verification scripts to check your setup:
```bash
# Check environment variables
./verify_env.sh

# Check environment variables with Python
python verify_env.py
```

## 📚 Additional Resources

- [Render API Documentation](https://render.com/docs/api)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Axiom DevOps Agent Documentation](#)