'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
    text: string;
    className?: string;
    as?: any;
}

export function GlitchText({ text, className, as: Component = 'span' }: GlitchTextProps) {
    return (
        <Component className={cn('relative inline-block group', className)}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-axiom-cyan opacity-0 group-hover:opacity-70 animate-pulse-fast translate-x-[2px]">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-axiom-red opacity-0 group-hover:opacity-70 animate-pulse-fast -translate-x-[2px] delay-75">
                {text}
            </span>
        </Component>
    );
}
