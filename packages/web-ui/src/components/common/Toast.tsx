'use client';

import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const idCounter = useRef(0);
  
  const addToast = (message: string, type: Toast['type']) => {
    const id = `toast_${++idCounter.current}`;
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] ${
              toast.type === 'success'
                ? 'bg-axiom-success/20 text-axiom-success border border-axiom-success/30'
                : toast.type === 'error'
                ? 'bg-axiom-error/20 text-axiom-error border border-axiom-error/30'
                : toast.type === 'warning'
                ? 'bg-axiom-warning/20 text-axiom-warning border border-axiom-warning/30'
                : 'bg-axiom-cyan/20 text-axiom-cyan border border-axiom-cyan/30'
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-current opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}