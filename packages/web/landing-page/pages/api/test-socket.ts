// pages/api/test-socket.ts - API route to test socket connection
import { NextApiRequest, NextApiResponse } from 'next';
import { io } from 'socket.io-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to the Socket.io server
    const socket = io('http://localhost:3001');
    
    // Wait for connection
    await new Promise((resolve, reject) => {
      socket.on('connect', resolve);
      setTimeout(() => reject(new Error('Connection timeout')), 5000);
    });
    
    // Send a test message
    socket.emit('user_sends_speech', {
      text: 'Test message from API route',
      timestamp: new Date().toISOString()
    });
    
    // Disconnect
    socket.disconnect();
    
    res.status(200).json({ message: 'Socket connection test successful' });
  } catch (error) {
    res.status(500).json({ message: 'Socket connection test failed', error: (error as Error).message });
  }
}