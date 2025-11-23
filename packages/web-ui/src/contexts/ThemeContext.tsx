'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'void' | 'solar' | 'matrix' | 'nebula';

interface ThemeContextType {
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState<Theme>('void');

    useEffect(() => {
        // Load theme from local storage
        const savedTheme = localStorage.getItem('axiom-theme') as Theme;
        if (savedTheme) {
            setCurrentTheme(savedTheme);
        }
    }, []);

    const setTheme = (theme: Theme) => {
        setCurrentTheme(theme);
        localStorage.setItem('axiom-theme', theme);

        // Update CSS variables based on theme
        const root = document.documentElement;
        switch (theme) {
            case 'solar':
                root.style.setProperty('--cyber-cyan', '#00FF7F'); // Spring Green
                root.style.setProperty('--neon-purple', '#FFD700'); // Gold
                root.style.setProperty('--dark-void', '#0a1a1a'); // Dark Jungle Green
                root.style.setProperty('--holo-blue', '#00BFFF'); // Deep Sky Blue
                break;
            case 'matrix':
                root.style.setProperty('--cyber-cyan', '#00FF00'); // Matrix Green
                root.style.setProperty('--neon-purple', '#003300'); // Dark Green
                root.style.setProperty('--dark-void', '#000000'); // Black
                root.style.setProperty('--holo-blue', '#008F11'); // Darker Green
                break;
            case 'nebula':
                root.style.setProperty('--cyber-cyan', '#FF00FF'); // Magenta
                root.style.setProperty('--neon-purple', '#8A2BE2'); // Blue Violet
                root.style.setProperty('--dark-void', '#1a0b2e'); // Deep Purple
                root.style.setProperty('--holo-blue', '#FF1493'); // Deep Pink
                break;
            case 'void':
            default:
                root.style.setProperty('--cyber-cyan', '#00FFFF');
                root.style.setProperty('--neon-purple', '#9D4EDD');
                root.style.setProperty('--dark-void', '#0A0E27');
                root.style.setProperty('--holo-blue', '#4FACFE');
                break;
        }
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
