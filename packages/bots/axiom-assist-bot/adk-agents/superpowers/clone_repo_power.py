import subprocess
import os
import tempfile
import shutil
from .base_power import BaseSuperpower

class CloneRepoPower(BaseSuperpower):
    """Superpower for cloning Git repositories to prepare for security scanning."""

    def get_name(self) -> str:
        return "clone_repo"

    async def execute(self, payload: dict) -> dict:
        """
        Clone a Git repository to a temporary directory.
        
        Payload should contain:
        - repo_url (string): The Git repository URL to clone
        - branch (string, optional): Specific branch to clone (default: main)
        - depth (int, optional): Clone depth for shallow clone (default: 1)
        
        Returns:
        - temp_dir (string): Path to the cloned repository
        - success (boolean): Whether the clone was successful
        """
        
        try:
            # Extract parameters from payload
            repo_url = payload.get('repo_url')
            branch = payload.get('branch', 'main')
            depth = payload.get('depth', 1)
            
            if not repo_url:
                return {"status": "error", "message": "Missing required parameter: repo_url"}
            
            # Create a temporary directory for cloning
            temp_dir = tempfile.mkdtemp(prefix='axiom_repo_clone_')
            
            # Build the git clone command
            command = [
                'git', 'clone',
                '--depth', str(depth),
                '--branch', branch,
                repo_url,
                temp_dir
            ]
            
            # Execute the clone command
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=300  # 5-minute timeout
            )
            
            # Check if the clone was successful
            if result.returncode == 0:
                return {
                    "status": "success",
                    "message": f"Repository cloned successfully to {temp_dir}",
                    "temp_dir": temp_dir,
                    "repo_url": repo_url,
                    "branch": branch
                }
            else:
                # Clean up the temporary directory on failure
                if os.path.exists(temp_dir):
                    shutil.rmtree(temp_dir)
                
                return {
                    "status": "error",
                    "message": "Failed to clone repository",
                    "error_details": result.stderr,
                    "repo_url": repo_url
                }
                
        except subprocess.TimeoutExpired:
            # Clean up the temporary directory on timeout
            if 'temp_dir' in locals() and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
                
            return {
                "status": "error",
                "message": "Repository cloning timed out",
                "repo_url": repo_url
            }
            
        except Exception as e:
            # Clean up the temporary directory on any other error
            if 'temp_dir' in locals() and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
                
            return {
                "status": "error",
                "message": f"Unexpected error during repository cloning: {str(e)}",
                "repo_url": repo_url
            }