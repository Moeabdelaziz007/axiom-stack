'use client';

import React from 'react';
import { 
  Database, 
  Search, 
  AlertCircle, 
  FilePlus, 
  Users, 
  TrendingUp, 
  Wallet 
} from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'database' | 'search' | 'alert' | 'file' | 'users' | 'trending' | 'wallet';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon = 'database', action }: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'database': return <Database className="w-12 h-12 text-gray-600" />;
      case 'search': return <Search className="w-12 h-12 text-gray-600" />;
      case 'alert': return <AlertCircle className="w-12 h-12 text-gray-600" />;
      case 'file': return <FilePlus className="w-12 h-12 text-gray-600" />;
      case 'users': return <Users className="w-12 h-12 text-gray-600" />;
      case 'trending': return <TrendingUp className="w-12 h-12 text-gray-600" />;
      case 'wallet': return <Wallet className="w-12 h-12 text-gray-600" />;
      default: return <Database className="w-12 h-12 text-gray-600" />;
    }
  };

  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}