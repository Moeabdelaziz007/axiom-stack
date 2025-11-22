'use client';

import React from 'react';
import Spline from '@splinetool/react-spline';

interface HolographicAvatarProps {
    agentName?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    riskLevel?: number; // 0-100, determines outline color
}

// Map agent names to specific Spline scene URLs
// Ideally these would be props or fetched from a backend
const avatarScenes: { [key: string]: string } = {
    'Helios': 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode', // Placeholder
    'Content Creator AI': 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode', // Placeholder
    'DeFi Trader AI': 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode', // Placeholder
};

const HolographicAvatar: React.FC<HolographicAvatarProps> = ({ 
    agentName = 'Helios', 
    className = '', 
    size = 'md',
    riskLevel = 50 
}) => {
    const sceneUrl = avatarScenes[agentName] || 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'; // Default placeholder

    let dimensions = { width: '100%', height: '100%' };
    // If className sets dimensions, we might not need inline styles, but keeping for safety if size prop is used
    if (size === 'sm') dimensions = { width: '48px', height: '48px' };
    if (size === 'md') dimensions = { width: '80px', height: '80px' };
    if (size === 'lg') dimensions = { width: '120px', height: '120px' };

    // Determine outline color based on risk level
    const getOutlineColor = () => {
        if (riskLevel >= 70) return 'shadow-[0_0_20px_rgba(255,0,60,0.6)]'; // Red for high risk
        if (riskLevel >= 40) return 'shadow-[0_0_20px_rgba(252,238,10,0.6)]'; // Yellow for medium
        return 'shadow-[0_0_20px_rgba(0,255,148,0.6)]'; // Green for low risk
    };

    const getRingColor = () => {
        if (riskLevel >= 70) return 'bg-axiom-red/60';
        if (riskLevel >= 40) return 'bg-axiom-warning/60';
        return 'bg-axiom-success/60';
    };

    // If className is provided, we assume it handles sizing, otherwise use default dimensions
    const style = className ? {} : dimensions;

    return (
        <div className={`holo-avatar-container relative overflow-hidden rounded-full ${className} ${getOutlineColor()}`} style={style}>
            <Spline scene={sceneUrl} />

            {/* Holographic Overlay/Glow */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,255,255,0.3)] pointer-events-none mix-blend-screen"></div>

            {/* Dynamic Ring Glow - Color based on risk level */}
            <div className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[120%] h-5 rounded-full blur-lg ${getRingColor()} animate-[ring-pulse_2s_ease-in-out_infinite]`}></div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-20 pointer-events-none"></div>
        </div>
    );
};

export default HolographicAvatar;
