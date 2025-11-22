'use client';

import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useHologramStore, Widget } from '../../stores/hologramStore';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Mock Widget Components
const AgentStatusWidget = () => (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-axiom-cyan font-mono text-sm">SYSTEM STATUS</h3>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="flex-1 bg-black/20 rounded p-2 font-mono text-xs text-gray-300 space-y-1 overflow-hidden">
            <p>CPU Load: 12%</p>
            <p>Memory: 4.2GB / 16GB</p>
            <p>Network: CONNECTED</p>
            <p>Active Agents: 3</p>
            <p>Next Payout: 2h 15m</p>
        </div>
    </div>
);

const TradingWidget = () => (
    <div className="h-full flex flex-col">
        <h3 className="text-axiom-cyan font-mono text-sm mb-2">MARKET ANALYSIS</h3>
        <div className="flex-1 bg-gradient-to-b from-transparent to-axiom-cyan/5 rounded relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 flex items-end justify-around px-2 pb-2 opacity-50">
                {[40, 60, 45, 70, 65, 85, 80, 95, 60, 75].map((h, i) => (
                    <div key={i} className="w-4 bg-axiom-cyan" style={{ height: `${h}%` }} />
                ))}
            </div>
            <p className="text-2xl font-bold text-white z-10">$AXIOM: $1.24 <span className="text-green-400 text-sm">(+5.2%)</span></p>
        </div>
    </div>
);

const TerminalWidget = () => (
    <div className="h-full flex flex-col">
        <h3 className="text-axiom-cyan font-mono text-sm mb-2">COMMAND LOG</h3>
        <div className="flex-1 bg-black rounded p-2 font-mono text-xs text-green-500 overflow-y-auto">
            <p>Initializing Holographic Interface...</p>
            <p>Connecting to Solana Mainnet...</p>
            <p>Loading Agent Personas...</p>
            <p>Ready.</p>
            <span className="animate-pulse">_</span>
        </div>
    </div>
);

export const HoloGrid = () => {
    const { layout, updateLayout } = useHologramStore();

    const renderWidgetContent = (type: Widget['type']) => {
        switch (type) {
            case 'AGENT_STATUS': return <AgentStatusWidget />;
            case 'TRADING': return <TradingWidget />;
            case 'TERMINAL': return <TerminalWidget />;
            default: return <div className="text-gray-500">Widget Content</div>;
        }
    };

    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            onLayoutChange={(currentLayout) => {
                // Map back to our Widget type structure if needed, 
                // for now just logging or syncing basic props
                // In a real app, we'd map the react-grid-layout ItemLayout back to our store
                console.log('Layout changed:', currentLayout);
            }}
            isDraggable={true}
            isResizable={true}
            margin={[16, 16]}
        >
            {layout.map((item) => (
                <div
                    key={item.i}
                    className="holo-card rounded-xl p-4 backdrop-blur-md bg-white/5 border border-white/10 shadow-lg hover:border-axiom-cyan/50 transition-colors group relative overflow-hidden"
                >
                    {/* Glass Reflection Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 pointer-events-none mix-blend-overlay" />

                    {/* Drag Handle */}
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/10 cursor-grab active:cursor-grabbing hover:bg-axiom-cyan/50" />

                    {renderWidgetContent(item.type)}
                </div>
            ))}
        </ResponsiveGridLayout>
    );
};
