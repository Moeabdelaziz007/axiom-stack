'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { SocketProvider } from '@/contexts/SocketContext';
import { CommandPalette } from '@/components/command/CommandPalette';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <SocketProvider>
      <div className="min-h-screen bg-axiom-dark">
        <div className="dashboard-grid" />
        <Sidebar />
        <div className="ml-20 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>

        {/* Command Palette */}
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </SocketProvider>
  );
}