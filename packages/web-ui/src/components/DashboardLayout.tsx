'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Bot, 
  AlertTriangle, 
  Settings, 
  BarChart3, 
  Users, 
  Shield,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-axiom-dark text-white">
      {/* Animated grid background */}
      <div className="dashboard-grid"></div>
      
      {/* Sidebar */}
      <aside className="glass-panel w-20 flex flex-col h-full py-6 px-3 transition-all duration-300 group hover:w-64 fixed left-0 top-0 z-50">
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden group-hover:block transition-opacity duration-300">
              AXIOM
            </span>
          </div>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {[
              { icon: Activity, label: 'Overview', href: '/' },
              { icon: Bot, label: 'Agents', href: '/agents' },
              { icon: AlertTriangle, label: 'Alerts', href: '/alerts' },
              { icon: BarChart3, label: 'Analytics', href: '/analytics' },
              { icon: Users, label: 'Users', href: '/users' },
              { icon: Shield, label: 'Security', href: '/security' },
            ].map((item, index) => (
              <li key={index}>
                <Link 
                  href={item.href}
                  className="flex items-center p-3 rounded-lg hover:bg-axiom-glass transition-all duration-200 group/item"
                >
                  <item.icon className="w-5 h-5 text-primary group-hover/item:text-secondary transition-colors" />
                  <span className="ml-4 hidden group-hover:block transition-opacity duration-300">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto">
          <Link 
            href="/settings"
            className="flex items-center p-3 rounded-lg hover:bg-axiom-glass transition-all duration-200 group/item"
          >
            <Settings className="w-5 h-5 text-axiom-cyan group-hover/item:text-axiom-purple transition-colors" />
            <span className="ml-4 hidden group-hover:block transition-opacity duration-300">
              Settings
            </span>
          </Link>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 ml-20">
        {/* Status Bar */}
        <header className="glass-panel h-16 flex items-center justify-between px-6 mb-6 mt-6 mr-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-axiom-cyan to-axiom-purple bg-clip-text text-transparent">
              Command Center
            </h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">All Systems Operational</span>
            </div>
            
            <div className="flex items-center">
              <Bot className="w-4 h-4 text-axiom-cyan mr-2" />
              <span className="text-sm">24 Active Agents</span>
            </div>
            
            <div className="flex items-center">
              <Activity className="w-4 h-4 text-axiom-purple mr-2" />
              <span className="text-sm">98.7% Uptime</span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}