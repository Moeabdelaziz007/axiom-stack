// Wallet hook for the Axiom Command Center

import { useWallet as useWalletContext, WalletContextType } from '@/contexts/WalletContext';

export const useWallet = (): WalletContextType => {
  return useWalletContext();
};