'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface AgentSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function AgentSearch({ onSearch, placeholder = 'Search agents...' }: AgentSearchProps) {
  const [query, setQuery] = useState('');

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback((searchQuery: string) => {
    const timeout = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [onSearch]);

  useEffect(() => {
    const cleanup = debouncedSearch(query);
    return cleanup;
  }, [query, debouncedSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-700 rounded-lg bg-axiom-dark-lighter text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-axiom-cyan focus:border-transparent"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-white" />
        </button>
      )}
    </div>
  );
}

// Utility function for debouncing
