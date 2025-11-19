// api/simple-chat-socket.mjs - Simplified Socket.io server for real-time communication
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://api.axiomid.app", "https://axiomid.app", "http://axiomid.app"],
    methods: ["GET", "POST"]
  }
});

// Store connected clients
const connectedClients = new Map();

console.log('🚀 Initializing Simple Socket.io server...');

// Start the server when the module is imported
const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`📡 Simple Socket.io server running on port ${PORT}`);
  console.log(`🔗 Health check endpoint: http://localhost:${PORT}/health`);
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log(`📱 Client connected: ${socket.id}`);
  connectedClients.set(socket.id, socket);

  // Send connection confirmation
  socket.emit('agent_connected', {
    message: 'Connected to Axiom Holo-Partner',
    timestamp: new Date().toISOString(),
    clientId: socket.id
  });

  // Handle voice input from client
  socket.on('user_sends_speech', async (data) => {
    console.log(`🎤 Received speech from client ${socket.id}:`, data.text);
    
    try {
      // Send processing status
      socket.emit('agent_processing', {
        status: 'processing',
        message: 'Analyzing your request...'
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple response generation
      let response = "I'm the Axiom ID assistant. I'm here to help you with your decentralized agent economy needs. ";
      
      if (data.text.toLowerCase().includes('hello') || data.text.toLowerCase().includes('hi')) {
        response = "Hello there! I'm your Axiom ID assistant. How can I help you today?";
      } else if (data.text.toLowerCase().includes('agent')) {
        response = "Agents in the Axiom ID ecosystem are autonomous entities with verifiable identities, economic capabilities, and self-discovery features. They can perform tasks, earn reputation, and interact with other agents in the decentralized economy.";
      } else if (data.text.toLowerCase().includes('sdk')) {
        response = "You can generate custom agent SDKs using our SDK Factory. Just tell me what kind of agent you want to create, and I'll generate the code for you!";
      } else if (data.text.toLowerCase().includes('reputation')) {
        response = "Reputation in Axiom ID is a measure of an agent's trustworthiness and performance. It's stored on the Solana blockchain and updated based on the agent's actions and task completions.";
      }

      // Send the response back to the client
      socket.emit('agent_speaks_response', {
        text: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error processing user query:', error);
      socket.emit('agent_error', {
        message: 'Sorry, I encountered an error while processing your request.',
        error: error.message
      });
    }
  });

  // Handle SDK generation request
  socket.on('user_requests_sdk', async (data) => {
    console.log(`🔧 SDK generation requested by client ${socket.id}:`, data);
    
    try {
      // Send building status
      socket.emit('agent_building_sdk', {
        status: 'building',
        message: 'Generating your Agent SDK...'
      });

      // Simulate SDK generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a simple SDK template
      const sdkContent = `// Axiom Agent SDK - Generated on ${new Date().toISOString()}
// Agent Name: ${data.name || 'MyAxiomAgent'}
// Type: ${data.type || 'custom'}
// Description: ${data.description || 'Custom Axiom Agent'}

class AxiomAgent {
  constructor() {
    this.name = '${data.name || 'MyAxiomAgent'}';
    this.type = '${data.type || 'custom'}';
    this.description = '${data.description || 'Custom Axiom Agent'}';
  }

  async processTask(task) {
    // Implement your agent logic here
    console.log('Processing task:', task);
    return { status: 'completed', result: 'Task processed successfully' };
  }

  async communicateWithOtherAgent(agentId, message) {
    // Implement inter-agent communication here
    console.log('Communicating with agent:', agentId);
    return { status: 'sent', message: 'Message sent successfully' };
  }
}

module.exports = AxiomAgent;
`;

      // Convert to base64 for transmission
      const base64SDK = Buffer.from(sdkContent).toString('base64');
      
      // Send the SDK back to the client
      socket.emit('agent_delivers_sdk', {
        sdk: base64SDK,
        name: `${data.name || 'AxiomAgent'}-SDK.js`,
        message: 'Your Agent SDK has been generated successfully!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating SDK:', error);
      socket.emit('agent_error', {
        message: 'Sorry, I encountered an error while generating the SDK.',
        error: error.message
      });
    }
  });

  // Handle widget connection
  socket.on('widget_connected', (data) => {
    console.log(`📱 Widget connected from client ${socket.id}:`, data);
    socket.emit('agent_connected', {
      message: 'Welcome to Axiom ID Holo-Core!',
      timestamp: new Date().toISOString(),
      clientId: socket.id
    });
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log(`📴 Client disconnected: ${socket.id}`);
    connectedClients.delete(socket.id);
  });

  // Handle client errors
  socket.on('error', (error) => {
    console.error(`❌ Socket error for client ${socket.id}:`, error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Axiom ID Simple Socket Server is running',
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size,
    documentation: 'Visit https://axiomid.app for API documentation'
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down Socket.io server...');
  server.close(() => {
    console.log('✅ Socket.io server closed');
    process.exit(0);
  });
});

export { io, server, app };