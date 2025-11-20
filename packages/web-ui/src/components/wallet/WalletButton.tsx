'use client';

import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, Power, RefreshCw } from 'lucide-react';

export function WalletButton() {
  const { status, address, balance, connectWallet, disconnectWallet } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  const formatBalance = (bal: number | null) => {
    if (bal === null) return '0.00';
    return bal.toFixed(2);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {status === 'disconnected' && (
        <button
          onClick={handleConnect}
          className="flex items-center gap-2 px-4 py-3 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] font-medium"
        >
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </button>
      )}

      {status === 'connecting' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-axiom-purple/20 text-white rounded-lg border border-axiom-purple/30">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Connecting...
        </div>
      )}

      {status === 'connected' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-axiom-dark-lighter text-white rounded-lg border border-axiom-cyan/30">
            <div className="w-2 h-2 rounded-full bg-axiom-success"></div>
            <span className="text-sm font-mono">{formatAddress(address)}</span>
            <span className="text-axiom-cyan">{formatBalance(balance)} SOL</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="flex items-center gap-2 px-4 py-2 bg-axiom-error/20 text-axiom-error rounded-lg hover:bg-axiom-error/30 transition-all border border-axiom-error/30"
          >
            <Power className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-axiom-error/20 text-axiom-error rounded-lg border border-axiom-error/30">
          <Power className="w-5 h-5" />
          Connection Error
        </div>
      )}
    </div>
  );
}