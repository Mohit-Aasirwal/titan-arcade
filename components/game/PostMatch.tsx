import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';
import { Button } from '@/components/ui/Button';
import { Gem, RefreshCw, Home, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface PostMatchProps {
  score: number;
  isPractice: boolean;
  bet: number;
  onReplay: () => void;
}

export const PostMatch: React.FC<PostMatchProps> = ({ score, isPractice, bet, onReplay }) => {
  const { addGems, username } = usePlayerStore();
  
  // Simple "win" logic for MVP: Score > 1000 = Win
  // In real app, this compares to opponent score
  const isWin = score > 500; 
  const winAmount = isWin ? (bet === 3 ? 5 : 10) : 0;

  useEffect(() => {
     if (!isPractice && isWin) {
         addGems(winAmount);
     }
  }, []);

  return (
    <motion.div 
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
    >
        <div className="mb-6">
            <h2 className={`text-5xl font-black uppercase italic tracking-tighter mb-2 ${isWin ? 'text-yellow-400 text-glow-secondary' : 'text-slate-400'}`}>
                {isWin ? "VICTORY!" : "DEFEAT"}
            </h2>
            <p className="text-slate-400 text-sm">
                {isWin ? "You crushed the opponent!" : "Better luck next time."}
            </p>
        </div>

        {/* Score Card */}
        <div className="glass-card w-full max-w-sm mb-8 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                 <div className="text-left">
                     <p className="text-xs text-slate-500 uppercase font-bold">Your Score</p>
                     <p className="text-3xl font-black text-white">{score.toLocaleString()}</p>
                 </div>
                 <div className="text-right opacity-50">
                     <p className="text-xs text-slate-500 uppercase font-bold">Opponent</p>
                     <p className="text-2xl font-bold text-white">Pending...</p>
                 </div>
            </div>

            {/* Rewards */} 
            {!isPractice && (
                 <div className="py-2 bg-white/5 rounded-lg flex items-center justify-center gap-3">
                     <span className="text-sm text-slate-300">Reward:</span>
                     <div className={`flex items-center gap-1 font-bold text-xl ${isWin ? 'text-yellow-400' : 'text-slate-600'}`}>
                        <Gem fill="currentColor" /> {isWin ? `+${winAmount}` : `-${bet}`}
                     </div>
                 </div>
            )}
             
            {isPractice && (
                <div className="py-2 bg-white/5 rounded-lg text-sm text-slate-400">
                    Practice Match - No Gems Exchanged
                </div>
            )}
        </div>

        {/* Analytics (Mock) */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm mb-8">
            <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">Accuracy</p>
                <p className="font-bold text-green-400">88%</p>
            </div>
             <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">Hits</p>
                <p className="font-bold text-blue-400">42</p>
            </div>
             <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase">Combo</p>
                <p className="font-bold text-purple-400">12x</p>
            </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
            <Button variant="primary" size="xl" onClick={onReplay} className="w-full animate-pulse-glow">
                <RefreshCw className="mr-2" size={20}/> Play Again
            </Button>
            <Link href="/" className="block w-full">
                <Button variant="secondary" size="lg" className="w-full">
                    <Home className="mr-2" size={20} /> Back to Hub
                </Button>
            </Link>
        </div>

    </motion.div>
  );
};
