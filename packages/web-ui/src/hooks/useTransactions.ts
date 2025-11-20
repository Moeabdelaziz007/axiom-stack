// Transactions hook for the Axiom Command Center

import { useState, useEffect, useCallback } from 'react';
import { MockTransaction } from '@/lib/solana';
import { getMockTransactions } from '@/lib/api/mockServices';
import { useToast } from '@/components/common/Toast';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<MockTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMockTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
      addToast('Failed to fetch transactions', 'error');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const sendPayment = async (to: string, amount: number) => {
    try {
      // In a real implementation, this would send an actual transaction
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate occasional failures
      if (Math.random() < 0.1) {
        throw new Error('Transaction failed due to network error');
      }
      
      const newTransaction: MockTransaction = {
        id: `tx_${Date.now()}`,
        type: 'payment',
        amount,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
        from: 'user_wallet_address',
        to,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      addToast(`Successfully sent ${amount} tokens`, 'success');
      return newTransaction;
    } catch (err) {
      addToast('Failed to send payment', 'error');
      console.error('Error sending payment:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    sendPayment,
  };
};