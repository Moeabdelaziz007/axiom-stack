from .base_power import BaseSuperpower
import aiohttp
import asyncio

class WebScraperPower(BaseSuperpower):
    """Superpower for web scraping and content extraction."""
    
    def get_name(self) -> str:
        return "web_scraping"
    
    async def execute(self, payload: dict) -> dict:
        """Execute web scraping with the given URL.
        
        Args:
            payload: Dictionary containing 'url' key with the target URL
            
        Returns:
            Dictionary containing the scraped content or error information
        """
        url = payload.get('url')
        if not url:
            return {"error": "URL is required for web scraping"}
        
        try:
            # Use aiohttp for asynchronous HTTP requests
            async with aiohttp.ClientSession() as session:
                async with session.get(url) as response:
                    if response.status == 200:
                        content = await response.text()
                        return {
                            "status": "success",
                            "url": url,
                            "status_code": response.status,
                            "content_length": len(content),
                            "content_preview": content[:500] + "..." if len(content) > 500 else content
                        }
                    else:
                        return {
                            "status": "error",
                            "url": url,
                            "status_code": response.status,
                            "error": f"HTTP {response.status} - Failed to fetch content"
                        }
        except Exception as e:
            return {
                "status": "error",
                "url": url,
                "error": str(e)
            }