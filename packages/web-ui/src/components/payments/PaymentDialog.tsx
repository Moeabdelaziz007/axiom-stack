'use client';

import React, { useState } from 'react';
import { X, Send, Wallet, User } from 'lucide-react';
import { ValidationService } from '@/lib/validation';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSendPayment: (to: string, amount: number) => Promise<void>;
}

export function PaymentDialog({ isOpen, onClose, onSendPayment }: PaymentDialogProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate recipient address
    if (!recipient) {
      newErrors.recipient = 'Recipient address is required';
    } else if (!ValidationService.validateWalletAddress(recipient)) {
      newErrors.recipient = 'Invalid wallet address format';
    }
    
    // Validate amount
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const amountNum = parseFloat(amount);
      await onSendPayment(recipient, amountNum);
      // Reset form
      setRecipient('');
      setAmount('');
      setMemo('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error sending payment:', error);
      setErrors({ submit: 'Failed to send payment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-axiom-dark-lighter rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Send Payment</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Recipient Address */}
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-300 mb-1">
                Recipient Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="recipient"
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 bg-axiom-dark border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    errors.recipient ? 'border-axiom-error focus:ring-axiom-error/30' : 'border-gray-700 focus:ring-axiom-cyan/30'
                  }`}
                  placeholder="Enter wallet address"
                />
              </div>
              {errors.recipient && <p className="mt-1 text-sm text-axiom-error">{errors.recipient}</p>}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-10 pr-16 py-2 bg-axiom-dark border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    errors.amount ? 'border-axiom-error focus:ring-axiom-error/30' : 'border-gray-700 focus:ring-axiom-cyan/30'
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">AXM</span>
                </div>
              </div>
              {errors.amount && <p className="mt-1 text-sm text-axiom-error">{errors.amount}</p>}
            </div>

            {/* Memo (Optional) */}
            <div>
              <label htmlFor="memo" className="block text-sm font-medium text-gray-300 mb-1">
                Memo (Optional)
              </label>
              <textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-axiom-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axiom-cyan/30"
                placeholder="Add a note for the recipient"
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-3 bg-axiom-error/20 text-axiom-error rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-axiom-dark"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}