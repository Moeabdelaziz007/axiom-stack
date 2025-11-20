'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { AlertTriangle, Shield, Clock, User } from 'lucide-react';

export default function AlertsPage() {
  // Sample alert data
  const alerts = [
    {
      id: 'alert-001',
      type: 'security',
      severity: 'high',
      title: 'Unauthorized Access Attempt',
      description: 'Agent agent-a1f5b3 attempted to access restricted resource',
      timestamp: '2023-05-15T14:30:00Z',
      resolved: false
    },
    {
      id: 'alert-002',
      type: 'performance',
      severity: 'medium',
      title: 'High Load Factor',
      description: 'Agent agent-9e6c27 load factor exceeded 90%',
      timestamp: '2023-05-15T13:45:00Z',
      resolved: false
    },
    {
      id: 'alert-003',
      type: 'system',
      severity: 'low',
      title: 'Scheduled Maintenance',
      description: 'System maintenance completed successfully',
      timestamp: '2023-05-15T12:00:00Z',
      resolved: true
    },
    {
      id: 'alert-004',
      type: 'security',
      severity: 'critical',
      title: 'Data Integrity Check Failed',
      description: 'Discrepancy detected between on-chain and off-chain data',
      timestamp: '2023-05-15T11:20:00Z',
      resolved: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Security Alerts</h1>
        <p className="text-gray-400">Monitor and respond to system alerts</p>
      </div>
      
      <div className="glass-panel p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-axiom-red mr-3" />
              <div>
                <div className="text-2xl font-mono font-bold">8</div>
                <div className="text-sm text-gray-400">Active Alerts</div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-axiom-purple mr-3" />
              <div>
                <div className="text-2xl font-mono font-bold">3</div>
                <div className="text-sm text-gray-400">Security Issues</div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-axiom-cyan mr-3" />
              <div>
                <div className="text-2xl font-mono font-bold">12</div>
                <div className="text-sm text-gray-400">Pending Review</div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-4">
            <div className="flex items-center">
              <User className="w-8 h-8 text-axiom-cyan mr-3" />
              <div>
                <div className="text-2xl font-mono font-bold">42</div>
                <div className="text-sm text-gray-400">Resolved Today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left p-4">Alert</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Severity</th>
              <th className="text-left p-4">Time</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={index} className="border-b border-gray-800 hover:bg-axiom-glass">
                <td className="p-4">
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-sm text-gray-400">{alert.description}</div>
                </td>
                <td className="p-4">
                  <span className="capitalize">{alert.type}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)} mr-2`}></div>
                    <span className="capitalize">{alert.severity}</span>
                  </div>
                </td>
                <td className="p-4">
                  {new Date(alert.timestamp).toLocaleString()}
                </td>
                <td className="p-4">
                  {alert.resolved ? (
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">Resolved</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">Active</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}