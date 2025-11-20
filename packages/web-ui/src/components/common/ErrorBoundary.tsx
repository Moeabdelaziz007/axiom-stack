'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-axiom-dark">
          <div className="text-center p-8 rounded-lg glass-panel">
            <h2 className="text-2xl font-bold text-axiom-error mb-4">Oops, there was an error!</h2>
            <p className="text-gray-300 mb-6">
              Something went wrong. Please try refreshing the page.
            </p>
            <button
              className="px-4 py-2 bg-axiom-cyan text-axiom-dark rounded-lg hover:bg-cyan-300 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}