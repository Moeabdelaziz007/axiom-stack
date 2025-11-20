import { io, Socket } from 'socket.io-client';

// Socket.io client instance
export const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001', {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 10000,
});

// Event types for type safety
export const SOCKET_EVENTS = {
  AGENT_UPDATE: 'agent:update',
  LOG_NEW: 'log:new',
  METRICS_UPDATE: 'metrics:update',
  AGENT_CREATED: 'agent:created',
  AGENT_DELETED: 'agent:deleted',
  CONNECTION_STATUS: 'connection:status',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];

// Event payload types
export interface AgentUpdatePayload {
  agentId: string;
  status: 'active' | 'inactive' | 'busy';
  metrics?: {
    roi?: number;
    winRate?: number;
    trades24h?: number;
  };
}

export interface LogPayload {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  agentId?: string;
  metadata?: Record<string, any>;
}

export interface MetricsUpdatePayload {
  cpu: number;
  memory: number;
  activeAgents: number;
  totalTransactions?: number;
}

// Helper functions
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const isSocketConnected = () => socket.connected;