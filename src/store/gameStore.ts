import { create } from 'zustand';

export type GameState = 'home' | 'playing' | 'victory';

export interface GameStats {
    timeElapsed: number;
    attempts: number;
    matches: number;
}

interface GameStore {
    gameState: GameState;
    gameStats: GameStats;
    startGame: () => void;
    endGame: (stats: GameStats) => void;
    goHome: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
    gameState: 'home',
    gameStats: { timeElapsed: 0, attempts: 0, matches: 0 },

    startGame: () =>
        set({
            gameState: 'playing',
            gameStats: { timeElapsed: 0, attempts: 0, matches: 0 },
        }),

    endGame: (stats) =>
        set({
            gameState: 'victory',
            gameStats: stats,
        }),

    goHome: () => set({ gameState: 'home' }),
}));
