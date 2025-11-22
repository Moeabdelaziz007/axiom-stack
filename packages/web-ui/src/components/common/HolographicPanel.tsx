'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HolographicPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'glass';
  glowOnHover?: boolean;
}

/**
 * HolographicPanel - True floating panel with depth and neon glow
 * Replaces the old glass-card with enhanced holographic aesthetics
 */
export const HolographicPanel = React.forwardRef<HTMLDivElement, HolographicPanelProps>(
  ({ children, className, variant = 'default', glowOnHover = true, ...props }, ref) => {
    const baseClasses = 'relative rounded-2xl transition-all duration-300';
    
    const variantClasses = {
      default: 'holographic-panel',
      premium: 'glass-panel-premium',
      glass: 'glass-panel'
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          glowOnHover && 'hover:shadow-[0_8px_80px_rgba(0,255,255,0.3)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HolographicPanel.displayName = 'HolographicPanel';

export default HolographicPanel;