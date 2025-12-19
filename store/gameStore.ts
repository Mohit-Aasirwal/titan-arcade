import { create } from 'zustand';

// --- Game State Store ---
// Manages the state within a single game session

interface GameState {
  isPlaying: boolean;
  score: number;
  lives: number;
  timeRemaining: number; // in seconds
  isPaused: boolean;
  gameStatus: 'idle' | 'playing' | 'paused' | 'game_over' | 'victory';
  
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (victory?: boolean) => void;
  resetGame: () => void;
  
  addScore: (amount: number) => void;
  loseLife: () => void;
  tickTimer: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  score: 0,
  lives: 3,
  timeRemaining: 60,
  isPaused: false,
  gameStatus: 'idle',

  startGame: () => set({ 
    isPlaying: true, 
    score: 0, 
    lives: 3, 
    timeRemaining: 60, // Default 60s matching
    isPaused: false,
    gameStatus: 'playing' 
  }),

  pauseGame: () => set({ isPaused: true, gameStatus: 'paused' }),
  resumeGame: () => set({ isPaused: false, gameStatus: 'playing' }),
  
  endGame: (victory = false) => set({ 
    isPlaying: false, 
    gameStatus: victory ? 'victory' : 'game_over' 
  }),

  resetGame: () => set({
    isPlaying: false,
    score: 0,
    lives: 3,
    timeRemaining: 60,
    isPaused: false,
    gameStatus: 'idle'
  }),

  addScore: (amount) => set((state) => ({ score: state.score + amount })),
  
  loseLife: () => set((state) => {
    const newLives = state.lives - 1;
    return { 
      lives: newLives, 
      gameStatus: newLives <= 0 ? 'game_over' : state.gameStatus,
      isPlaying: newLives > 0
    };
  }),

  tickTimer: () => set((state) => {
    if (state.isPaused || !state.isPlaying) return {};
    const newTime = state.timeRemaining - 1;
    return { 
      timeRemaining: newTime,
      gameStatus: newTime <= 0 ? 'game_over' : state.gameStatus,
      isPlaying: newTime > 0
    };
  }),
}));

// Note: Player Store (gems, etc) is already in @/store/playerStore (assumed based on earlier view_file)
