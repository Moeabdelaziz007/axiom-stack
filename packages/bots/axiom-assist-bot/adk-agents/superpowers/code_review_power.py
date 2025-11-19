import os
import google.generativeai as genai
from github import Github
from .base_power import BaseSuperpower

class CodeReviewPower(BaseSuperpower):

    def get_name(self) -> str:
        return "code_review"

    async def execute(self, payload: dict) -> dict:
        """
        Payload should contain:
        - diff (string): The .diff content of the PR.
        - repo_full_name (string): e.g., "YourOrg/AxiomID"
        - pr_number (int): The number of the pull request.
        - github_token (string): A token to post comments.
        - gemini_api_key (string): The API key for Gemini.
        """
        
        try:
            # 1. Get data from payload
            diff = payload.get('diff')
            repo_name = payload.get('repo_full_name')
            pr_number = int(payload.get('pr_number'))
            github_token = payload.get('github_token') # Must be passed from orchestrator
            api_key = payload.get('gemini_api_key')    # Must be passed from orchestrator

            if not all([diff, repo_name, pr_number, github_token, api_key]):
                return {"status": "error", "message": "Missing required payload fields."}

            # 2. Configure Gemini
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-pro-latest')

            # 3. Create the prompt
            prompt = f"""
            You are an expert Senior Software Architect and DevOps agent for the Axiom ID project. 
            Your task is to perform a code review on the following diff.
            
            Focus on:
            1. Potential bugs or logic errors.
            2. Security vulnerabilities (like hardcoded secrets or injection risks).
            3. Performance issues.
            4. Adherence to best practices (e.g., proper error handling, DRY principles).
            
            Provide your review as a concise markdown-formatted comment. If there are no major issues, state "LGTM! (Looks Good To Me)".
            
            Here is the diff:
            ---
            {diff}
            ---
            """
            
            # 4. Get Review from Gemini
            response = await model.generate_content_async(prompt)
            review_text = response.text

            # 5. Post review to GitHub PR
            g = Github(github_token)
            repo = g.get_repo(repo_name)
            pr = repo.get_pull(pr_number)
            
            # Add header to the comment
            final_comment = f"**🤖 Axiom DevOps Agent (Code Review)**\n\n---\n\n{review_text}"
            pr.create_issue_comment(final_comment)

            return {"status": "success", "message": f"Review posted to PR #{pr_number}"}

        except Exception as e:
            return {"status": "error", "message": str(e)}