"use client";
import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { usePlayerStore } from '@/store/playerStore';
import { MatchEntry } from '@/components/game/MatchEntry';
import { GameCanvas } from '@/components/game/GameCanvas';
import { PostMatch } from '@/components/game/PostMatch';
import { GameHUD } from '@/components/game/GameHUD';
import { TutorialOverlay } from '@/components/game/TutorialOverlay';
import { ControlsOverlay } from '@/components/game/ControlsOverlay';
import { AnimatePresence, motion } from 'framer-motion';

type GamePhase = 'entry' | 'tutorial' | 'playing' | 'results';

export default function GamePage() {
  const [phase, setPhase] = useState<GamePhase>('entry');
  const [isPractice, setIsPractice] = useState(true);
  const [betAmount, setBetAmount] = useState(0);

  const { resetGame, startGame, gameStatus, endGame, score } = useGameStore();
  const { gems, addGems, hasCompletedTutorial, setHasCompletedTutorial, updateBestScore } = usePlayerStore();
  useEffect(() => {
    if (!hasCompletedTutorial) {
        setPhase('tutorial');
    }
  }, [hasCompletedTutorial]);

  // Reset game state on mount to ensure clean slate
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Handle Match Results for Tutorial Completion
  useEffect(() => {
    // Only trigger results if we were actually playing (prevents stale state issues)
    if (phase === 'playing' && (gameStatus === 'game_over' || gameStatus === 'victory')) {
      const isTutorialMatch = !hasCompletedTutorial;
      setPhase('results');
      
      // Update High Score
      updateBestScore(score);

      // COMPLETE TUTORIAL if this was the first run
      if (isTutorialMatch) {
          setHasCompletedTutorial(true);
      }

      // Handle Winnings (Mock Logic)
      if (!isPractice && gameStatus === 'victory') {
         // ... existing win logic
      }
    }
  }, [gameStatus, score, isPractice, hasCompletedTutorial, updateBestScore, setHasCompletedTutorial, phase]);

  const handleStartMatch = (practice: boolean, bet: number) => {
    // Block regular entry if tutorial isn't done (double safeguard)
    if (!hasCompletedTutorial) return;

    if (!practice && gems < bet) {
      alert("Not enough gems!");
      return;
    }
    
    if (!practice) {
       addGems(-bet); // Deduct entry fee
    }

    setIsPractice(practice);
    setBetAmount(bet);
    setPhase('playing');
    startGame();
  };

  const handleTutorialComplete = () => {
    // User finished carousel -> Start FORCED Practice Match
    setIsPractice(true);
    setBetAmount(0);
    setPhase('playing');
    startGame();
  };
  
  const handleReplay = () => {
     setPhase('entry');
     resetGame();
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
       <AnimatePresence mode="wait">
          {phase === 'entry' && (
             <MatchEntry onStart={handleStartMatch} key="entry" />
          )}

          {phase === 'tutorial' && (
             <motion.div 
               key="tutorial"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 z-50"
             >
                <TutorialOverlay onComplete={handleTutorialComplete} />
             </motion.div>
          )}

          {phase === 'playing' && (
             <motion.div key="playing" className="flex-1 w-full h-full relative">
                {!hasCompletedTutorial && <ControlsOverlay />}
                <GameHUD isPractice={isPractice} />
                <GameCanvas />
             </motion.div>
          )}

          {phase === 'results' && (
             <PostMatch 
                key="results"
                score={score} 
                isPractice={isPractice} 
                bet={betAmount} 
                onReplay={handleReplay} 
             />
          )}
       </AnimatePresence>
    </div>
  );
}
