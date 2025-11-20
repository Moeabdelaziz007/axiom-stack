'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { SOCKET_EVENTS, type MetricsUpdatePayload } from '@/lib/socket';

interface SystemMetrics {
  cpu: number;
  memory: number;
  activeAgents: number;
  totalTransactions: number;
  timestamp: string;
}

const fetcher = async (url: string): Promise<SystemMetrics> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch system metrics');
  return res.json();
};

export function useSystemMetrics() {
  const { socket, connected } = useSocket();

  const { data, error, mutate } = useSWR<SystemMetrics>(
    process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/metrics/system` : null,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      fallbackData: {
        cpu: 0,
        memory: 0,
        activeAgents: 0,
        totalTransactions: 0,
        timestamp: new Date().toISOString(),
      },
    }
  );

  // Listen for real-time updates via Socket.io
  useEffect(() => {
    if (!connected) return;

    const handleMetricsUpdate = (payload: MetricsUpdatePayload) => {
      mutate(
        (current: SystemMetrics | undefined) => ({
          ...current!,
          cpu: payload.cpu,
          memory: payload.memory,
          activeAgents: payload.activeAgents,
          totalTransactions: payload.totalTransactions || current!.totalTransactions,
          timestamp: new Date().toISOString(),
        }),
        false // Don't revalidate
      );
    };

    socket.on(SOCKET_EVENTS.METRICS_UPDATE, handleMetricsUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.METRICS_UPDATE, handleMetricsUpdate);
    };
  }, [socket, connected, mutate]);

  return {
    cpu: data?.cpu || 0,
    memory: data?.memory || 0,
    activeAgents: data?.activeAgents || 0,
    totalTransactions: data?.totalTransactions || 0,
    timestamp: data?.timestamp,
    loading: !data && !error,
    error,
    refresh: mutate,
  };
}