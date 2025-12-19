import { create } from "zustand";

interface GameState {
  player: {
    id: string;
    username: string;
    gems: number;
    elo: number;
    gamesPlayed: number;
    wins: number;
    losses: number;
    bestScore: number;
    lastLogin: string;
    tutorialComplete: boolean;
  } | null;

  currentMatch: {
    entryFee: number;
    prizePool: number;
    opponent: any;
    gameStarted: boolean;
  } | null;

  setPlayer: (player: any) => void;
  updateGems: (amount: number) => void;
  startMatch: (entryFee: number, opponent: any) => void;
  endMatch: (result: any) => void;
}

export const useGameStore = create<GameState>((set) => ({
  player: null,
  currentMatch: null,

  setPlayer: (player) => set({ player }),

  updateGems: (amount) =>
    set((state) => ({
      player: state.player
        ? { ...state.player, gems: state.player.gems + amount }
        : null,
    })),

  startMatch: (entryFee, opponent) =>
    set({
      currentMatch: {
        entryFee,
        prizePool: entryFee * 2,
        opponent,
        gameStarted: true,
      },
    }),

  endMatch: (result) =>
    set((state) => {
      // Update player stats based on result
      return { currentMatch: null };
    }),
}));
