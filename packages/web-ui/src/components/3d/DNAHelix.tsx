'use client';

import React, { useRef } from 'react';
import Spline from '@splinetool/react-spline';

interface DNAHelixProps {
    isMinting: boolean;
    agentName: string;
}

const DNAHelix: React.FC<DNAHelixProps> = ({ isMinting, agentName }) => {
    // In a real implementation, you would use the onLoad callback to control the scene
    // const splineRef = useRef<any>(null);
    // const onLoad = (splineApp: any) => {
    //   splineRef.current = splineApp;
    // };

    return (
        <div className="relative w-full h-full">
            {/* Spline Viewer */}
            {/* Using a placeholder scene URL - User needs to replace this with their actual Spline export */}
            <Spline
                scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            />

            {/* Overlay for text and glow effects */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none 
                   ${isMinting ? 'glow-effect animate-pulse' : ''}`}>
                <h2 className="text-3xl font-orbitron text-white z-10 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
                    {isMinting ? 'QUANTUM GENESIS' : 'GENE LAB'}
                </h2>
            </div>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 font-rajdhani text-sm whitespace-nowrap">
                {agentName || 'New Quantum Agent'} DNA Blueprint
            </p>
        </div>
    );
};

export default DNAHelix;
