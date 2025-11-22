'use client';

import React from 'react';
import Spline from '@splinetool/react-spline';

interface HolographicAvatarProps {
    agentName?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

// Map agent names to specific Spline scene URLs
// Ideally these would be props or fetched from a backend
const avatarScenes: { [key: string]: string } = {
    'Helios': 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode', // Placeholder
    'Content Creator AI': 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode', // Placeholder
    'DeFi Trader AI': 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode', // Placeholder
};

const HolographicAvatar: React.FC<HolographicAvatarProps> = ({ agentName = 'Helios', className = '', size = 'md' }) => {
    const sceneUrl = avatarScenes[agentName] || 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'; // Default placeholder

    let dimensions = { width: '100%', height: '100%' };
    // If className sets dimensions, we might not need inline styles, but keeping for safety if size prop is used
    if (size === 'sm') dimensions = { width: '48px', height: '48px' };
    if (size === 'md') dimensions = { width: '80px', height: '80px' };
    if (size === 'lg') dimensions = { width: '120px', height: '120px' };

    // If className is provided, we assume it handles sizing, otherwise use default dimensions
    const style = className ? {} : dimensions;

    return (
        <div className={`relative overflow-hidden rounded-full ${className}`} style={style}>
            <Spline scene={sceneUrl} />

            {/* Holographic Overlay/Glow */}
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,255,255,0.3)] pointer-events-none mix-blend-screen"></div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-20 pointer-events-none"></div>
        </div>
    );
};

export default HolographicAvatar;
