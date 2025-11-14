// api/test-sdk-generation.mjs - Test script for SDK generation through Socket.io
import { io } from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:3001');

console.log('🔌 Connecting to Socket.io server...');

socket.on('connect', () => {
  console.log('✅ Connected to server with ID:', socket.id);
  
  // Test SDK generation
  console.log('🔧 Requesting SDK generation...');
  socket.emit('user_requests_sdk', {
    name: 'TestAgent',
    type: 'defi',
    description: 'A test DeFi agent',
    timestamp: new Date().toISOString()
  });
});

socket.on('agent_connected', (data) => {
  console.log('🤖 Agent connected:', data.message);
});

socket.on('agent_building_sdk', (data) => {
  console.log('⚙️ Building SDK:', data.message);
});

socket.on('agent_delivers_sdk', (data) => {
  console.log('📦 SDK delivered:', data.message);
  console.log('   SDK name:', data.name);
  console.log('   SDK size:', data.sdk ? `${data.sdk.length} characters (base64)` : 'No SDK data');
  console.log('✅ Test completed successfully');
  
  // Disconnect after test
  socket.disconnect();
});

socket.on('agent_error', (data) => {
  console.error('❌ Agent error:', data.message);
  socket.disconnect();
});

socket.on('disconnect', () => {
  console.log('📴 Disconnected from server');
  process.exit(0);
});