import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  gems: number;
  elo: number;
  wins: number;
  losses: number;
  totalGames: number;
  bestScore: number;
  username: string;
  avatar: string;
  dailyStreak: number;
  lastLogin: Date | null;
  hasCompletedTutorial: boolean;
  setGems: (gems: number) => void;
  addGems: (amount: number) => void;
  setElo: (elo: number) => void;
  incrementWins: () => void;
  incrementLosses: () => void;
  updateBestScore: (score: number) => void;
  setUsername: (username: string) => void;
  setAvatar: (avatar: string) => void;
  updateDailyStreak: () => void;
  setHasCompletedTutorial: (completed: boolean) => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      gems: 10,
      elo: 1000,
      wins: 0,
      losses: 0,
      totalGames: 0,
      bestScore: 0,
      username: "Player1",
      avatar: "/avatar-placeholder.png",
      dailyStreak: 0,
      lastLogin: null,
      hasCompletedTutorial: false,
      setGems: (gems) => set({ gems }),
      addGems: (amount) => set({ gems: get().gems + amount }),
      setElo: (elo) => set({ elo }),
      incrementWins: () =>
        set({ wins: get().wins + 1, totalGames: get().totalGames + 1 }),
      incrementLosses: () =>
        set({ losses: get().losses + 1, totalGames: get().totalGames + 1 }),
      updateBestScore: (score) => {
        if (score > get().bestScore) set({ bestScore: score });
      },
      setUsername: (username) => set({ username }),
      setAvatar: (avatar) => set({ avatar }),
      updateDailyStreak: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last = get().lastLogin;
        let newStreak = get().dailyStreak;
        let gemsToAdd = 0;

        if (!last) {
          newStreak = 1;
          gemsToAdd = 5;
        } else {
          const lastNormalized = new Date(last);
          lastNormalized.setHours(0, 0, 0, 0);

          const daysDiff = Math.floor(
            (today.getTime() - lastNormalized.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 0) return;

          if (daysDiff === 1) {
            newStreak += 1;
            gemsToAdd = 5 * newStreak;
          } else {
            newStreak = 1;
            gemsToAdd = 5;
          }
        }

        set({ dailyStreak: newStreak, lastLogin: today });
        if (gemsToAdd > 0) get().addGems(gemsToAdd);
      },
      setHasCompletedTutorial: (completed) =>
        set({ hasCompletedTutorial: completed }),
      resetPlayer: () => set({
        gems: 10,
        elo: 1000,
        wins: 0,
        losses: 0,
        totalGames: 0,
        bestScore: 0,
        dailyStreak: 0,
        lastLogin: null,
        hasCompletedTutorial: false
      }),
    }),
    { name: "player-storage" }
  )
);
