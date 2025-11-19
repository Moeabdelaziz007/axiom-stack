from .base_power import BaseSuperpower
import asyncio


class ExamplePower(BaseSuperpower):
    """Example superpower that demonstrates the basic structure."""
    
    def get_name(self) -> str:
        return "example"
    
    async def execute(self, payload: dict) -> dict:
        """Execute the example superpower.
        
        Args:
            payload: Dictionary containing the data needed for execution
            
        Returns:
            Dictionary containing the result of the execution
        """
        # Extract parameters from payload
        message = payload.get('message', 'Hello, World!')
        delay = payload.get('delay', 1)
        
        # Simulate some async work
        await asyncio.sleep(delay)
        
        # Return result
        return {
            "status": "success",
            "message": f"Example superpower executed with message: {message}",
            "delay": delay
        }