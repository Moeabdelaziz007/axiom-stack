'use client';

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { useSocket } from '@/contexts/SocketContext';
import { SOCKET_EVENTS, type LogPayload } from '@/lib/socket';

export interface DecisionLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'THOUGHT';
  message: string;
  agentId?: string;
  metadata?: Record<string, any>;
  reasoning?: string; // For THOUGHT-level logs
}

const fetcher = async (url: string): Promise<DecisionLog[]> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch logs');
  const data = await res.json();
  return data.logs || [];
};

export function useDecisionLogs(limit: number = 100) {
  const { socket, connected } = useSocket();
  const [logs, setLogs] = useState<DecisionLog[]>([]);

  // Initial fetch with SWR
  const { data: initialLogs, error } = useSWR<DecisionLog[]>(
    process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/logs` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Set initial logs
  useEffect(() => {
    if (initialLogs) {
      setLogs(initialLogs.slice(0, limit));
    }
  }, [initialLogs, limit]);

  // Listen for real-time log updates via Socket.io
  useEffect(() => {
    if (!connected) return;

    const handleNewLog = (payload: LogPayload) => {
      const newLog: DecisionLog = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: payload.timestamp,
        level: payload.level,
        message: payload.message,
        agentId: payload.agentId,
        metadata: payload.metadata,
      };

      setLogs((prev) => [newLog, ...prev].slice(0, limit));
    };

    socket.on(SOCKET_EVENTS.LOG_NEW, handleNewLog);

    return () => {
      socket.off(SOCKET_EVENTS.LOG_NEW, handleNewLog);
    };
  }, [socket, connected, limit]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const filterLogs = useCallback((level?: DecisionLog['level']) => {
    if (!level) return logs;
    return logs.filter((log) => log.level === level);
  }, [logs]);

  return {
    logs,
    loading: !initialLogs && !error,
    error,
    clearLogs,
    filterLogs,
  };
}