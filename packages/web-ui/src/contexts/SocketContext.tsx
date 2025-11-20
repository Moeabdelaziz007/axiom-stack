'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { socket, connectSocket, disconnectSocket, type SocketEvent } from '@/lib/socket';
import type { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket;
  connected: boolean;
  error: string | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect socket
    connectSocket();

    // Event handlers
    const handleConnect = () => {
      setConnected(true);
      setError(null);
      console.log('Socket connected');
    };

    const handleDisconnect = () => {
      setConnected(false);
      console.log('Socket disconnected');
    };

    const handleError = (err: Error) => {
      setError(err.message);
      console.error('Socket error:', err);
    };

    const handleReconnect = (attemptNumber: number) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
      setConnected(true);
      setError(null);
    };

    const handleReconnectError = (err: Error) => {
      console.error('Socket reconnection error:', err);
      setError('Failed to reconnect to server');
    };

    // Attach event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_error', handleReconnectError);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
      socket.off('reconnect', handleReconnect);
      socket.off('reconnect_error', handleReconnectError);
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, error }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}