import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Pause, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const GameHUD = ({ isPractice }: { isPractice: boolean }) => {
  const { score, timeRemaining, lives, pauseGame, resumeGame, isPaused } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full p-4 z-40 pointer-events-none flex justify-between items-start">
      
      <div className="flex flex-col gap-1">
         <div className="text-4xl font-black text-white italic tracking-tighter text-glow" style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.8)' }}>
            {score.toLocaleString()}
         </div>
         {isPractice && (
            <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded w-max border border-green-500/30">
                PRACTICE MODE
            </div>
         )}
         <div className="flex gap-1 mt-1">
            {[...Array(3)].map((_, i) => (
                <Heart 
                    key={i} 
                    size={16} 
                    className={i < lives ? "text-red-500 fill-red-500" : "text-slate-700"} 
                />
            ))}
         </div>
      </div>

      <div className="flex flex-col items-end gap-2 pointer-events-auto">
         <div className={`text-2xl font-bold font-mono ${timeRemaining < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
         </div>
         <Button variant="glass" size="sm" onClick={pauseGame} className="w-10 h-10 p-0 rounded-full flex items-center justify-center">
         <Button variant="glass" size="sm" onClick={isPaused ? resumeGame : pauseGame} className="w-10 h-10 p-0 rounded-full flex items-center justify-center">
             {isPaused ? <div className="ml-1 w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent" /> : <Pause size={16} />}
         </Button>
         </Button>
      </div>

    </div>
  );
};
