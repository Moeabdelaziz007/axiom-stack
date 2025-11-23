'use client';

import { BarChart, Activity, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  // Sample analytics data
  const metrics = [
    { name: 'Task Completion Rate', value: '94.2%', target: '90%', status: 'positive' },
    { name: 'Average Response Time', value: '1.8s', target: '<3s', status: 'positive' },
    { name: 'Security Incidents', value: '3', target: '0', status: 'negative' },
    { name: 'Agent Uptime', value: '98.7%', target: '99%', status: 'neutral' }
  ];

  const performanceData = [
    { hour: '00:00', tasks: 120 },
    { hour: '04:00', tasks: 85 },
    { hour: '08:00', tasks: 240 },
    { hour: '12:00', tasks: 310 },
    { hour: '16:00', tasks: 275 },
    { hour: '20:00', tasks: 190 }
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen animate-fade-in-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">System Analytics</h1>
        <p className="text-gray-400">Performance metrics and system insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            className="glass-panel p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{metric.name}</h3>
              {metric.status === 'positive' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : metric.status === 'negative' ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Activity className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div className="text-3xl font-bold mb-2">{metric.value}</div>
            <div className="text-sm text-gray-400">Target: {metric.target}</div>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="glass-panel p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Task Performance</h2>
          <div className="flex items-center text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 bg-axiom-cyan rounded-full mr-2"></div>
              <span>Tasks Completed</span>
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end space-x-2">
          {performanceData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="text-xs text-gray-400 mb-2">{data.hour}</div>
              <div
                className="w-full bg-gradient-to-t from-axiom-cyan to-axiom-purple rounded-t-lg min-h-0"
                style={{ height: `${(data.tasks / 350) * 100}%` }}
              ></div>
              <div className="text-xs font-mono mt-2">{data.tasks}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-8 h-8 text-axiom-cyan mr-3" />
            <h3 className="text-lg font-bold">System Load</h3>
          </div>
          <div className="text-3xl font-bold mb-2">72%</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-axiom-cyan h-2 rounded-full" style={{ width: '72%' }}></div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-8 h-8 text-axiom-purple mr-3" />
            <h3 className="text-lg font-bold">Success Rate</h3>
          </div>
          <div className="text-3xl font-bold mb-2">96.8%</div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-axiom-purple h-2 rounded-full" style={{ width: '96.8%' }}></div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-8 h-8 text-axiom-red mr-3" />
            <h3 className="text-lg font-bold">Active Agents</h3>
          </div>
          <div className="text-3xl font-bold mb-2">12/24</div>
          <div className="text-sm text-gray-400">50% utilization</div>
        </div>
      </div>
    </div>
  );
}