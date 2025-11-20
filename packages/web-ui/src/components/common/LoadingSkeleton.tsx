'use client';

import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'chart' | 'table';
  count?: number;
}

export function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="glass-panel p-6 rounded-lg animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            </div>
            <div className="flex gap-2 mt-6">
              <div className="h-8 bg-gray-700 rounded-full w-20"></div>
              <div className="h-8 bg-gray-700 rounded-full w-20"></div>
            </div>
          </div>
        );
      
      case 'list':
        return Array.from({ length: count }).map((_, index) => (
          <div key={index} className="glass-panel p-4 rounded-lg animate-pulse mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-700 rounded"></div>
                <div>
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        ));
      
      case 'chart':
        return (
          <div className="glass-panel p-6 rounded-lg animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 bg-gray-700 rounded w-1/4"></div>
              <div className="h-8 bg-gray-700 rounded w-32"></div>
            </div>
            <div className="h-64 bg-gray-700 rounded"></div>
            <div className="flex justify-between mt-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-4 bg-gray-700 rounded w-12"></div>
              ))}
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="glass-panel rounded-lg animate-pulse overflow-hidden">
            <div className="h-12 bg-gray-700"></div>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="h-16 bg-gray-800 border-t border-gray-700"></div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return <>{renderSkeleton()}</>;
}