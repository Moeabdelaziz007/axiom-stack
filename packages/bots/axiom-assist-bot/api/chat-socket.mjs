// api/chat-socket.mjs - Socket.io server for real-time communication
import { Server } from 'socket.io';
import express from 'express';
import http from 'http';
import AxiomOrchestrator from '../orchestrator.mjs';
import AgentSDKFactory from '../components/AgentSDKFactory.mjs';
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
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://axiomid.app", "https://api.axiomid.app"],
    methods: ["GET", "POST"]
  }
});

// Initialize Axiom Orchestrator
const orchestrator = new AxiomOrchestrator();

// Initialize Agent SDK Factory
const sdkFactory = new AgentSDKFactory();

// Store connected clients
const connectedClients = new Map();

console.log('🚀 Initializing Socket.io server...');

// Initialize the orchestrator
orchestrator.initialize()
  .then(() => {
    console.log('✅ Axiom Orchestrator initialized successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to initialize Axiom Orchestrator:', error);
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

      // Process the query through the orchestrator
      const response = await orchestrator.handleUserQuery(data.text);
      
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

      // Generate SDK using AgentSDKFactory
      const sdkBuffer = await sdkFactory.generateSDK({
        name: data.name || 'AxiomAgent',
        type: data.type || 'custom',
        description: data.description || 'Custom Axiom Agent'
      });

      // Convert buffer to base64 for transmission
      const base64SDK = sdkBuffer.toString('base64');
      
      // Send the SDK back to the client
      socket.emit('agent_delivers_sdk', {
        sdk: base64SDK,
        name: `${data.name || 'AxiomAgent'}-SDK.zip`,
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

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down Socket.io server...');
  server.close(() => {
    console.log('✅ Socket.io server closed');
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`📡 Socket.io server running on port ${PORT}`);
  console.log(`🔗 Health check endpoint: http://localhost:${PORT}/health`);
});

export { io, server, app };