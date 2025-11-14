// api/test-socket-connection.mjs - Test script for Socket.io connection
import { io } from 'socket.io-client';

// Connect to the server
const socket = io('http://localhost:3001');

console.log('🔌 Connecting to Socket.io server...');

socket.on('connect', () => {
  console.log('✅ Connected to server with ID:', socket.id);
  
  // Test sending a voice message
  console.log('🎤 Sending test message...');
  socket.emit('user_sends_speech', {
    text: 'Hello, Axiom Holo-Partner!',
    timestamp: new Date().toISOString()
  });
});

socket.on('agent_connected', (data) => {
  console.log('🤖 Agent connected:', data.message);
});

socket.on('agent_processing', (data) => {
  console.log('⚙️ Processing:', data.message);
});

socket.on('agent_speaks_response', (data) => {
  console.log('💬 Agent response:', data.text);
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