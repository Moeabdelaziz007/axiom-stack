from abc import ABC, abstractmethod

class BaseSuperpower(ABC):
    """Abstract base class for all superpowers in the Axiom ID system."""
    
    @abstractmethod
    def get_name(self) -> str:
        """Return the name of the superpower."""
        pass

    @abstractmethod
    async def execute(self, payload: dict) -> dict:
        """Execute the superpower with the given payload.
        
        Args:
            payload: Dictionary containing the data needed for execution
            
        Returns:
            Dictionary containing the result of the execution
        """
        pass