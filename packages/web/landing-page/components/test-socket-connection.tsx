// components/test-socket-connection.tsx - Simple test component for Socket.io connection
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const TestSocketConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.io connection
    // Use SOCKET_SERVER_URL if available (for internal communication), otherwise fallback to localhost
    const socketUrl = process.env.SOCKET_SERVER_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      setMessages(prev => [...prev, `Connected with ID: ${newSocket.id}`]);
    });

    newSocket.on('agent_connected', (data) => {
      setMessages(prev => [...prev, `Agent: ${data.message}`]);
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
      setMessages(prev => [...prev, 'Disconnected from server']);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.connected) {
      socket.emit('user_sends_speech', {
        text: 'Hello from frontend test!',
        timestamp: new Date().toISOString()
      });
      setMessages(prev => [...prev, 'Sent: Hello from frontend test!']);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Socket.io Connection Test</h2>
      <div className="mb-4">
        <span className="font-semibold">Status:</span> {connectionStatus}
      </div>
      <button 
        onClick={sendMessage}
        disabled={connectionStatus !== 'connected'}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded mb-4"
      >
        Send Test Message
      </button>
      <div className="bg-gray-900 p-4 rounded max-h-60 overflow-y-auto">
        <h3 className="font-semibold mb-2">Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index} className="text-sm mb-1">{msg}</div>
        ))}
      </div>
    </div>
  );
};

export default TestSocketConnection;