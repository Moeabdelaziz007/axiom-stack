import os
import google.generativeai as genai
from .base_power import BaseSuperpower

class LogAnalysisPower(BaseSuperpower):

    def get_name(self) -> str:
        return "log_analysis"

    async def execute(self, payload: dict) -> dict:
        """
        Payload should contain:
        - log_content (string): The text content of the failed build log.
        - gemini_api_key (string): The API key for Gemini.
        """
        
        try:
            log_content = payload.get('log_content')
            api_key = payload.get('gemini_api_key')

            if not log_content or not api_key:
                return {"status": "error", "message": "Missing log_content or gemini_api_key."}
                
            # 1. Configure Gemini
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-pro-latest')
            
            # 2. Create the prompt
            prompt = f"""
            You are a Senior DevOps Build Expert. A CI/CD pipeline build has failed. 
            Your task is to analyze the following build log, identify the root cause of the error, 
            and suggest a specific solution.
            
            Respond in JSON format with two keys: "root_cause" and "suggested_fix".
            
            Here is the failed build log:
            ---
            {log_content}
            ---
            """
            
            # 3. Get Analysis from Gemini
            response = await model.generate_content_async(prompt)
            
            # Clean the response to ensure it's valid JSON
            json_response = response.text.strip().lstrip("```json").rstrip("```")
            
            return {"status": "success", "analysis": json_response}

        except Exception as e:
            return {"status": "error", "message": str(e)}