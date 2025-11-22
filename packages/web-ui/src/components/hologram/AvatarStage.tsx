'use client';

import React, { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { useHologramStore } from '@/stores/hologramStore';

export const AvatarStage = () => {
    const { avatarState } = useHologramStore();
    const splineRef = useRef<any>(null);

    const onLoad = (spline: any) => {
        splineRef.current = spline;
        console.log('Spline loaded', spline);
    };

    useEffect(() => {
        if (splineRef.current) {
            // Trigger animations based on state
            // Note: These event names would need to match defined events in the Spline scene
            switch (avatarState) {
                case 'THINKING':
                    splineRef.current.emitEvent('mouseDown', 'Head'); // Example trigger
                    break;
                case 'TALKING':
                    splineRef.current.emitEvent('mouseHover', 'Mouth'); // Example trigger
                    break;
                default:
                    // Reset to idle
                    break;
            }
        }
    }, [avatarState]);

    return (
        <div className="w-full h-full relative">
            {/* Placeholder Spline Scene - Robot */}
            <Spline
                scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
                onLoad={onLoad}
                className="w-full h-full"
            />

            {/* Holographic Glow Base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-12 bg-axiom-cyan/20 blur-3xl rounded-full pointer-events-none" />
        </div>
    );
};
