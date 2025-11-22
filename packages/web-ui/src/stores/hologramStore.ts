import { create } from 'zustand';

export type AvatarState = 'IDLE' | 'THINKING' | 'TALKING' | 'WORKING';

export interface Widget {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    type: 'TRADING' | 'TERMINAL' | 'AGENT_STATUS' | 'NOTES';
    data?: any;
}

interface HologramState {
    layout: Widget[];
    avatarState: AvatarState;
    commandQueue: string[];

    // Actions
    updateLayout: (newLayout: Widget[]) => void;
    setAvatarState: (state: AvatarState) => void;
    addCommand: (command: string) => void;
    processCommand: () => void;
}

export const useHologramStore = create<HologramState>((set) => ({
    layout: [
        { i: 'agent-status', x: 0, y: 0, w: 4, h: 6, type: 'AGENT_STATUS' },
        { i: 'trading-chart', x: 4, y: 0, w: 8, h: 8, type: 'TRADING' },
        { i: 'terminal', x: 0, y: 6, w: 4, h: 6, type: 'TERMINAL' },
        { i: 'notes', x: 4, y: 8, w: 8, h: 4, type: 'NOTES' },
    ],
    avatarState: 'IDLE',
    commandQueue: [],

    updateLayout: (newLayout) => set({ layout: newLayout }),
    setAvatarState: (state) => set({ avatarState: state }),
    addCommand: (command) => set((state) => ({ commandQueue: [...state.commandQueue, command] })),
    processCommand: () => set((state) => ({ commandQueue: state.commandQueue.slice(1) })),
}));
