# main.py - MCP Server for Axiom ID Firestore Tools
import asyncio
from mcp import Server, Tool
from mcp.server.stdio import stdio_server
from google.cloud import firestore


class FirestoreMCPTool:
    def __init__(self):
        # Initialize Firestore client
        self.db = firestore.Client()
        
    async def get_document(self, collection: str, 
                          document_id: str) -> dict:
        """
        Get a document from Firestore
        """
        try:
            doc_ref = self.db.collection(collection).document(document_id)
            doc = doc_ref.get()
            
            if doc.exists:
                return {"id": doc.id, "data": doc.to_dict()}
            else:
                return {"error": "Document not found"}
        except Exception as e:
            return {"error": str(e)}
    
    async def update_document(self, collection: str, 
                             document_id: str, data: dict) -> dict:
        """
        Update a document in Firestore
        """
        try:
            doc_ref = self.db.collection(collection).document(document_id)
            doc_ref.set(data, merge=True)
            return {"status": "success", "id": document_id}
        except Exception as e:
            return {"error": str(e)}
    
    async def query_collection(self, collection: str, field: str, 
                              operator: str, value) -> list:
        """
        Query documents in a Firestore collection
        """
        try:
            query = self.db.collection(collection)
            
            # Apply query conditions
            if field and operator and value is not None:
                query = query.where(field, operator, value)
            
            docs = query.stream()
            results = []
            
            async for doc in docs:
                results.append({"id": doc.id, "data": doc.to_dict()})
                
            return results
        except Exception as e:
            return [{"error": str(e)}]


async def main():
    # Create Firestore tool instance
    firestore_tool = FirestoreMCPTool()
    
    # Create MCP server
    server = Server("axiom-firestore-mcp")
    
    # Register tools
    @server.call_tool()
    async def call_tool(name: str, arguments: dict) -> list:
        if name == "get_document":
            collection = arguments.get("collection")
            document_id = arguments.get("document_id")
            if not collection or not document_id:
                return [{"error": "Missing required arguments: " + 
                        "collection, document_id"}]
            result = await firestore_tool.get_document(collection, document_id)
            return [result]
            
        elif name == "update_document":
            collection = arguments.get("collection")
            document_id = arguments.get("document_id")
            data = arguments.get("data")
            if not collection or not document_id or not data:
                return [{"error": "Missing required arguments: " + 
                        "collection, document_id, data"}]
            result = await firestore_tool.update_document(collection, 
                                                        document_id, data)
            return [result]
            
        elif name == "query_collection":
            collection = arguments.get("collection")
            field = arguments.get("field")
            operator = arguments.get("operator")
            value = arguments.get("value")
            if not collection:
                return [{"error": "Missing required argument: collection"}]
            result = await firestore_tool.query_collection(collection, field, 
                                                         operator, value)
            return result
            
        else:
            return [{"error": f"Unknown tool: {name}"}]
    
    # List available tools
    @server.list_tools()
    async def list_tools() -> list:
        return [
            Tool(
                name="get_document",
                description="Get a document from Firestore",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "collection": {"type": "string", 
                                     "description": "Firestore collection name"},
                        "document_id": {"type": "string", 
                                      "description": "Document ID"}
                    },
                    "required": ["collection", "document_id"]
                }
            ),
            Tool(
                name="update_document",
                description="Update a document in Firestore",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "collection": {"type": "string", 
                                     "description": "Firestore collection name"},
                        "document_id": {"type": "string", 
                                      "description": "Document ID"},
                        "data": {"type": "object", 
                               "description": "Document data to update"}
                    },
                    "required": ["collection", "document_id", "data"]
                }
            ),
            Tool(
                name="query_collection",
                description="Query documents in a Firestore collection",
                inputSchema={
                    "type": "object",
                    "properties": {
                        "collection": {"type": "string", 
                                     "description": "Firestore collection name"},
                        "field": {"type": "string", 
                                "description": "Field to query on (optional)"},
                        "operator": {"type": "string", 
                                   "description": "Query operator (==, >, <, etc.) (optional)"},
                        "value": {"type": "string", 
                                "description": "Value to compare against (optional)"}
                    },
                    "required": ["collection"]
                }
            )
        ]
    
    # Run the server
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, [], None)


if __name__ == "__main__":
    asyncio.run(main())