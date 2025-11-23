'use client';

import { Settings, Bell, Shield, Database, User, Palette } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold mb-2 text-glow">System Settings</h1>
        <p className="text-gray-400">Configure your Axiom Command Center</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="glass-panel-premium p-6 rounded-2xl">
          <h2 className="text-xl font-display font-bold mb-6">Configuration</h2>
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
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${item.active
                      ? 'bg-axiom-cyan/10 text-axiom-cyan border border-axiom-cyan/30'
                      : 'hover:bg-white/5 hover:border-white/20 border border-transparent'
                      }`}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-axiom-cyan' : 'group-hover:text-axiom-cyan transition-colors'}`} />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2">
          <div className="glass-panel-premium p-8 rounded-2xl mb-6">
            <h2 className="text-2xl font-display font-bold mb-6">General Settings</h2>

            <div className="space-y-6">
              {/* Glass Input Fields */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">System Name</label>
                <input
                  type="text"
                  defaultValue="Axiom Command Center"
                  className="w-full bg-transparent border-b-2 border-gray-700 focus:border-axiom-cyan py-3 px-2 transition-all duration-300 focus:outline-none text-white placeholder-gray-500"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.05), transparent)',
                    backgroundSize: '200% 100%',
                    backgroundPosition: '-100% 0'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundPosition = '100% 0';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundPosition = '-100% 0';
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Timezone</label>
                <select className="w-full bg-black/30 border border-gray-700 focus:border-axiom-cyan p-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-axiom-cyan/50 text-white">
                  <option className="bg-[#0F111A]">UTC (Coordinated Universal Time)</option>
                  <option className="bg-[#0F111A]">EST (Eastern Standard Time)</option>
                  <option className="bg-[#0F111A]">PST (Pacific Standard Time)</option>
                  <option className="bg-[#0F111A]">CET (Central European Time)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Data Retention</label>
                <select className="w-full bg-black/30 border border-gray-700 focus:border-axiom-cyan p-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-axiom-cyan/50 text-white">
                  <option className="bg-[#0F111A]">30 days</option>
                  <option className="bg-[#0F111A]">90 days</option>
                  <option className="bg-[#0F111A]">1 year</option>
                  <option className="bg-[#0F111A]">Indefinite</option>
                </select>
              </div>

              {/* Neon Toggle Switches */}
              <div className="flex items-center justify-between p-4 glass-panel-premium rounded-xl border border-white/5 hover:border-axiom-cyan/30 transition-all duration-300">
                <div>
                  <h3 className="font-display font-medium text-white">Real-time Monitoring</h3>
                  <p className="text-sm text-gray-400 mt-1">Enable live updates for agent status</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-7 bg-gray-700/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-axiom-cyan/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-axiom-cyan peer-checked:to-axiom-purple shadow-[0_0_20px_rgba(0,240,255,0.0)] peer-checked:shadow-[0_0_20px_rgba(0,240,255,0.4)]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 glass-panel-premium rounded-xl border border-white/5 hover:border-axiom-cyan/30 transition-all duration-300">
                <div>
                  <h3 className="font-display font-medium text-white">Automated Alerts</h3>
                  <p className="text-sm text-gray-400 mt-1">Receive notifications for critical events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-14 h-7 bg-gray-700/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-axiom-cyan/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-axiom-cyan peer-checked:to-axiom-purple shadow-[0_0_20px_rgba(0,240,255,0.0)] peer-checked:shadow-[0_0_20px_rgba(0,240,255,0.4)]"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="glass-panel-premium p-8 rounded-2xl">
            <h2 className="text-2xl font-display font-bold mb-6">System Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel-premium p-4 rounded-xl border border-white/5">
                <div className="text-sm text-gray-400 mb-1">Version</div>
                <div className="font-mono text-axiom-cyan">v2.4.1</div>
              </div>

              <div className="glass-panel-premium p-4 rounded-xl border border-white/5">
                <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                <div className="font-mono text-axiom-cyan">2023-05-15</div>
              </div>

              <div className="glass-panel-premium p-4 rounded-xl border border-white/5">
                <div className="text-sm text-gray-400 mb-1">Agents Connected</div>
                <div className="font-mono text-axiom-success">24/24</div>
              </div>

              <div className="glass-panel-premium p-4 rounded-xl border border-white/5">
                <div className="text-sm text-gray-400 mb-1">System Status</div>
                <div className="font-mono text-axiom-success flex items-center">
                  <span className="w-2 h-2 bg-axiom-success rounded-full mr-2 animate-pulse"></span>
                  Operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}