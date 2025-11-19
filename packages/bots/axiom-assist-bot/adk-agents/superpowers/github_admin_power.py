from github import Github
import sys
import os
sys.path.append(os.path.dirname(__file__))
from base_power import BaseSuperpower

class GitHubAdminPower(BaseSuperpower):

    def get_name(self) -> str:
        return "github_admin"

    async def execute(self, payload: dict) -> dict:
        """
        Payload should contain:
        - action (string): "CREATE_WEBHOOK" or "CREATE_TEST_PR" or "CHECK_PR_COMMENTS"
        - github_token (string): The master GitHub PAT.
        - repo_full_name (string): e.g., "Moeabdelaziz007/axiom-stack"
        - webhook_url (string): (For CREATE_WEBHOOK) The URL for the webhook.
        - webhook_secret (string): (For CREATE_WEBHOOK) The secret.
        - pr_number (int): (For CHECK_PR_COMMENTS) The PR number to check.
        """
        
        try:
            action = payload.get('action')
            token = payload.get('github_token')
            repo_name = payload.get('repo_full_name')

            if not all([action, token, repo_name]):
                return {"status": "error", "message": "Missing required payload: action, token, repo_full_name"}

            g = Github(token)
            repo = g.get_repo(repo_name)

            if action == "CREATE_WEBHOOK":
                url = payload.get('webhook_url')
                secret = payload.get('webhook_secret')
                if not url or not secret:
                    return {"status": "error", "message": "Missing webhook_url or webhook_secret"}
                
                config = {
                    "url": url,
                    "content_type": "json",
                    "secret": secret
                }
                events = ["pull_request"] # Only listen for PRs
                
                hook = repo.create_hook(name="web", config=config, events=events, active=True)
                return {"status": "success", "action": "CREATE_WEBHOOK", "hook_id": hook.id}

            elif action == "CREATE_TEST_PR":
                # 1. Create a new test branch
                base_branch = repo.get_branch(repo.default_branch)
                test_branch_name = f"devops-agent-test-{os.urandom(3).hex()}"
                repo.create_git_ref(ref=f"refs/heads/{test_branch_name}", sha=base_branch.commit.sha)
                
                # 2. Create a test file
                file_content = "// This is an automated test file to trigger the DevOps Agent workflow."
                file_path = f"test/agent_test_{test_branch_name}.js"
                repo.create_file(
                    path=file_path,
                    message=f"feat: Add test file {test_branch_name}",
                    content=file_content,
                    branch=test_branch_name
                )
                
                # 3. Create the Pull Request
                pr = repo.create_pull(
                    title=f"Automated DevOps Agent Test ({test_branch_name})",
                    body="This PR was created automatically by the Axiom IDE Agent to test the DevOps workflow.",
                    head=test_branch_name,
                    base=repo.default_branch
                )
                return {"status": "success", "action": "CREATE_TEST_PR", "pr_number": pr.number, "pr_url": pr.html_url}
            
            elif action == "CHECK_PR_COMMENTS":
                pr_number = int(payload.get('pr_number'))
                if not pr_number:
                    return {"status": "error", "message": "Missing pr_number"}
                
                pr = repo.get_pull(pr_number)
                comments = []
                for comment in pr.get_issue_comments():
                    comments.append({
                        "author": comment.user.login,
                        "body": comment.body
                    })
                return {"status": "success", "action": "CHECK_PR_COMMENTS", "comments": comments}
                
            else:
                return {"status": "error", "message": f"Unknown action: {action}"}

        except Exception as e:
            return {"status": "error", "message": str(e)}