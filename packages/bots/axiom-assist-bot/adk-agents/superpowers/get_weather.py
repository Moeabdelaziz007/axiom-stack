from .base_power import BaseSuperpower
import aiohttp
import asyncio

class GetWeatherPower(BaseSuperpower):
    """Superpower for getting weather information."""
    
    def get_name(self) -> str:
        return "get_weather"
    
    async def execute(self, payload: dict) -> dict:
        """Get weather information for a location.
        
        Args:
            payload: Dictionary containing 'location' key with the target location
            
        Returns:
            Dictionary containing weather information or error information
        """
        location = payload.get('location')
        if not location:
            return {"error": "Location is required for weather information"}
        
        try:
            # Use a free weather API (OpenWeatherMap requires API key, so we'll use a mock response)
            # In a real implementation, you would use an actual weather API service
            async with aiohttp.ClientSession() as session:
                # This is a mock implementation - in reality you would call a weather API
                # For example: https://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}
                
                # Mock response for demonstration
                response_data = {
                    "status": "success",
                    "location": location,
                    "temperature": 22,  # Celsius
                    "condition": "Partly Cloudy",
                    "humidity": 65,
                    "wind_speed": 10  # km/h
                }
                
                return response_data
        except Exception as e:
            return {
                "status": "error",
                "location": location,
                "error": str(e)
            }