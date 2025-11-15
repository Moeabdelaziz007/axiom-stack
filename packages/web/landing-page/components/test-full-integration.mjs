// components/test-full-integration.mjs - Test full integration of HoloCoreWidget with SDK download
import { io } from 'socket.io-client';
import { writeFileSync } from 'fs';

// Connect to the Socket.io server
// Use internal service URL in production, localhost in development
const SOCKET_SERVER_URL = process.env.SOCKET_SERVER_INTERNAL_URL || 'http://localhost:3001';
const socket = io(SOCKET_SERVER_URL);

console.log('🔌 Connecting to Socket.io server...');

socket.on('connect', () => {
  console.log('✅ Connected to server with ID:', socket.id);
  
  // Simulate clicking the "Get SDK" button in HoloCoreWidget
  console.log('🖱️  Simulating SDK download request (like clicking "Get SDK" button)...');
  socket.emit('user_requests_sdk', {
    name: 'HoloCoreAgent',
    type: 'custom',
    description: 'A holographic AI agent',
    timestamp: new Date().toISOString()
  });
});

socket.on('agent_building_sdk', (data) => {
  console.log('⚙️  Building SDK:', data.message);
});

socket.on('agent_delivers_sdk', (data) => {
  console.log('📦 SDK delivered:', data.message);
  console.log('   SDK name:', data.name);
  console.log('   SDK size:', data.sdk ? `${data.sdk.length} characters (base64)` : 'No SDK data');
  
  // Simulate saving the SDK file (like file-saver would do in the browser)
  if (data.sdk) {
    try {
      // Convert base64 to binary data
      const binaryString = atob(data.sdk);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Write to file (simulating the download)
      writeFileSync(data.name || 'AxiomAgentSDK.zip', Buffer.from(bytes));
      console.log('💾 SDK saved to:', data.name || 'AxiomAgentSDK.zip');
      console.log('✅ Full integration test completed successfully!');
    } catch (error) {
      console.error('❌ Error saving SDK:', error);
    }
  }
  
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