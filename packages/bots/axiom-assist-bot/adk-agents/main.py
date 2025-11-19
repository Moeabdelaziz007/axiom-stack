# main.py - Superpower Host for Axiom ID
import aiohttp
import os
import importlib
from fastapi import FastAPI
import uvicorn


class SuperpowerHost:
    """Superpower Host that dynamically loads and executes capabilities."""
    
    def __init__(self, name="axiom-superpower-host"):
        self.name = name
        self.superpowers = {}
        self.load_superpowers()
        
    def load_superpowers(self):
        """
        Dynamically load all available superpowers from 
        the superpowers directory.
        """
        # Get all Python files in the superpowers directory
        superpowers_dir = os.path.join(
            os.path.dirname(__file__),
            'superpowers'
        )
        if not os.path.exists(superpowers_dir):
            print("Superpowers directory not found")
            return
            
        python_files = [
            f for f in os.listdir(superpowers_dir)
            if (f.endswith('.py') and
                f != '__init__.py' and
                f != 'base_power.py')
        ]
        
        for filename in python_files:
            module_name = filename[:-3]  # Remove .py extension
            try:
                # Import the superpower module
                module = importlib.import_module(f"superpowers.{module_name}")
                
                # Find the class that inherits from BaseSuperpower
                power_class = None
                for attr_name in dir(module):
                    attr = getattr(module, attr_name)
                    if (isinstance(attr, type) and 
                        hasattr(attr, '__bases__') and 
                        any(base.__name__ == 'BaseSuperpower' 
                            for base in attr.__bases__)):
                        power_class = attr
                        break
                
                if power_class:
                    # Create an instance of the superpower
                    power_instance = power_class()
                    power_name = power_instance.get_name()
                    
                    # Store the superpower
                    self.superpowers[power_name] = power_instance
                    
                    print(f"Loaded superpower: {power_name} from {filename}")
                else:
                    print(f"No superpower class found in {filename}")
            except Exception as e:
                print(f"Failed to load superpower from {filename}: {str(e)}")
        
        print(
            f"Loaded {len(self.superpowers)} superpowers: "
            f"{list(self.superpowers.keys())}"
        )
    
    async def execute_superpower(self, power_name: str, payload: dict):
        """
        Execute a specific superpower with the given payload.
        
        Args:
            power_name: Name of the superpower to execute
            payload: Data to pass to the superpower
            
        Returns:
            Result of the superpower execution
        """
        if power_name not in self.superpowers:
            raise ValueError(f"Superpower '{power_name}' not found")
            
        return await self.superpowers[power_name].execute(payload)
    
    async def send_callback(self, callback_url: str, callback_data: dict):
        """
        Send callback to the orchestrator
        """
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    callback_url, 
                    json=callback_data
                ) as response:
                    if response.status == 200:
                        print("Callback sent successfully")
                    else:
                        print(f"Failed to send callback: {response.status}")
        except Exception as e:
            print(f"Error sending callback: {str(e)}")


# Create the superpower host instance
superpower_host = SuperpowerHost()


# Simple server implementation
app = FastAPI()


@app.post("/process-task")
async def process_task(payload: dict):
    """
    Process a task by executing the specified superpower.
    
    Expected payload format:
    {
        "power_name": "name_of_superpower",
        "payload": {"key": "value"},  # Data for the superpower
        "callback_url": "http://orchestrator/callback",
        "taskId": "unique-task-id"
    }
    """
    try:
        power_name = payload.get('power_name')
        power_payload = payload.get('payload', {})
        callback_url = payload.get('callback_url')
        task_id = payload.get('taskId')
        
        if not power_name:
            return {"error": "power_name is required"}
            
        if not callback_url:
            return {"error": "callback_url is required"}
            
        if power_name not in superpower_host.superpowers:
            result = {
                "error": f"Superpower '{power_name}' not found on this agent.",
                "available_superpowers": 
                    list(superpower_host.superpowers.keys())
            }
        else:
            # Execute the superpower
            try:
                result = await superpower_host.execute_superpower(
                    power_name, 
                    power_payload
                )
            except Exception as e:
                result = {"error": str(e)}
        
        # Send callback to orchestrator
        callback_data = {
            "result": result,
            "taskId": task_id
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                callback_url, 
                json=callback_data
            ) as response:
                if response.status == 200:
                    print(f"Callback sent successfully for task {task_id}")
                else:
                    print(
                        f"Failed to send callback for task {task_id}: "
                        f"{response.status}"
                    )
        
        return {"status": "processing_complete"}
    except Exception as e:
        return {"error": f"Failed to process task: {str(e)}"}


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "superpowers": list(superpower_host.superpowers.keys()),
        "count": len(superpower_host.superpowers)
    }


@app.get("/superpowers")
async def list_superpowers():
    """List all available superpowers."""
    return {
        "superpowers": list(superpower_host.superpowers.keys()),
        "count": len(superpower_host.superpowers)
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)