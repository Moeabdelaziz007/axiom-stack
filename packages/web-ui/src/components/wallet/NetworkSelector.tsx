'use client';

import React from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Network } from '@/contexts/WalletContext';

export function NetworkSelector() {
  const { network, switchNetwork } = useWallet();

  const networks: { id: Network; name: string; description: string }[] = [
    { id: 'devnet', name: 'Devnet', description: 'Development network with test tokens' },
    { id: 'testnet', name: 'Testnet', description: 'Testing network with more stability' },
    { id: 'mainnet-beta', name: 'Mainnet', description: 'Live network with real tokens' },
  ];

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchNetwork(e.target.value as Network);
  };

  return (
    <div className="glass-panel p-4 rounded-lg">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Network
      </label>
      <select
        value={network}
        onChange={handleNetworkChange}
        className="w-full bg-axiom-dark-lighter border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-axiom-cyan"
        title="Select Solana network"
      >
        {networks.map((net) => (
          <option key={net.id} value={net.id}>
            {net.name}
          </option>
        ))}
      </select>
      <p className="mt-2 text-sm text-gray-400">
        {networks.find(n => n.id === network)?.description}
      </p>
    </div>
  );
}