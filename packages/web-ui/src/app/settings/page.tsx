'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { Settings, Bell, Shield, Database, User, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">System Settings</h1>
        <p className="text-gray-400">Configure your Axiom Command Center</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold mb-6">Configuration</h2>
          <nav>
            <ul className="space-y-2">
              {[
                { icon: Settings, label: 'General', active: true },
                { icon: Bell, label: 'Notifications' },
                { icon: Shield, label: 'Security' },
                { icon: Database, label: 'Data Management' },
                { icon: User, label: 'User Access' },
                { icon: Palette, label: 'Appearance' }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                      item.active 
                        ? 'bg-axiom-glass text-axiom-cyan border border-axiom-cyan/30' 
                        : 'hover:bg-axiom-glass'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">General Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">System Name</label>
                <input 
                  type="text" 
                  defaultValue="Axiom Command Center" 
                  className="w-full glass-panel p-3 rounded-lg border border-gray-700 focus:border-axiom-cyan focus:outline-none focus:ring-1 focus:ring-axiom-cyan bg-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select className="w-full glass-panel p-3 rounded-lg border border-gray-700 focus:border-axiom-cyan focus:outline-none focus:ring-1 focus:ring-axiom-cyan bg-transparent">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>EST (Eastern Standard Time)</option>
                  <option>PST (Pacific Standard Time)</option>
                  <option>CET (Central European Time)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Data Retention</label>
                <select className="w-full glass-panel p-3 rounded-lg border border-gray-700 focus:border-axiom-cyan focus:outline-none focus:ring-1 focus:ring-axiom-cyan bg-transparent">
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>1 year</option>
                  <option>Indefinite</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
                <div>
                  <h3 className="font-medium">Real-time Monitoring</h3>
                  <p className="text-sm text-gray-400">Enable live updates for agent status</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axiom-cyan"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
                <div>
                  <h3 className="font-medium">Automated Alerts</h3>
                  <p className="text-sm text-gray-400">Receive notifications for critical events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-axiom-cyan"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-6">System Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-4">
                <div className="text-sm text-gray-400 mb-1">Version</div>
                <div className="font-mono">v2.4.1</div>
              </div>
              
              <div className="glass-panel p-4">
                <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                <div className="font-mono">2023-05-15</div>
              </div>
              
              <div className="glass-panel p-4">
                <div className="text-sm text-gray-400 mb-1">Agents Connected</div>
                <div className="font-mono">24/24</div>
              </div>
              
              <div className="glass-panel p-4">
                <div className="text-sm text-gray-400 mb-1">System Status</div>
                <div className="font-mono text-green-500">Operational</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}