// components/ConnectionStatusIndicator.tsx
import type React from 'react';

type Status = 'idle' | 'connecting' | 'connected' | 'error';

interface Props {
  status: Status;
  errorMessage?: string;
}

const ConnectionStatusIndicator: React.FC<Props> = ({ status, errorMessage }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'connected':
        return { text: '✅ Connected', color: 'text-green-400' };
      case 'connecting':
        return { text: '🔄 Connecting...', color: 'text-yellow-400 animate-pulse' };
      case 'error':
        return { text: `❌ Connection Failed: ${errorMessage || 'Unknown error'}`, color: 'text-red-500' };
      default:
        return { text: '⚪ Idle', color: 'text-gray-500' };
    }
  };

  const { text, color } = getStatusStyle();

  return (
    <div className={`text-sm font-medium ${color} transition-colors duration-300`}>
      {text}
    </div>
  );
};

export default ConnectionStatusIndicator;