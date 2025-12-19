import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { usePlayerStore } from '@/store/playerStore';
import { Gem, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

interface MatchEntryProps {
  onStart: (isPractice: boolean, bet: number) => void;
}

export const MatchEntry: React.FC<MatchEntryProps> = ({ onStart }) => {
  const { gems } = usePlayerStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col p-6 bg-slate-900 h-full relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
         <Link href="/">
           <Button variant="ghost" size="sm" className="text-slate-400">Back</Button>
         </Link>
         <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
            <Gem className="text-yellow-400" size={16} />
            <span className="font-bold">{gems}</span>
         </div>
      </div>

      <div className="text-center mb-8">
         <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-2">Space Shooter</h1>
         <p className="text-slate-400 text-sm">Select your challenge</p>
      </div>

      <div className="space-y-4 max-w-sm mx-auto w-full">
         {/* Practice Mode */}
         <div className="glass-card p-4 flex items-center justify-between border-l-4 border-l-green-400">
            <div>
               <h3 className="font-bold text-white flex items-center gap-2">
                 <ShieldCheck size={18} className="text-green-400" />
                 Practice
               </h3>
               <p className="text-xs text-slate-400 mt-1">Warm up. No gems required.</p>
            </div>
            <Button variant="secondary" onClick={() => onStart(true, 0)}>
               Play Free
            </Button>
         </div>

         {/* Rookie League */}
         <div className="glass-card p-4 flex items-center justify-between border-l-4 border-l-blue-500 relative overflow-hidden">
             {/* Gradient Shine */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full translate-x-10 -translate-y-10" />
             
            <div className="relative">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <Zap size={18} className="text-blue-500" fill="currentColor" />
                 Rookie Duel
               </h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-400">Entry:</span>
                  <div className="flex items-center gap-1 text-red-400 font-bold text-sm">
                     <Gem size={12} fill="currentColor"/> 3
                  </div>
                  <span className="text-slate-600">|</span>
                  <span className="text-xs text-slate-400">Prize:</span>
                   <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                     <Gem size={12} fill="currentColor"/> 5
                  </div>
               </div>
            </div>
            <Button 
                variant={gems >= 3 ? "primary" : "ghost"} 
                disabled={gems < 3}
                onClick={() => onStart(false, 3)}
            >
               {gems >= 3 ? "Battle" : "No Gems"}
            </Button>
         </div>

         {/* Pro League - Locked/Mock */}
         <div className="glass-card p-4 flex items-center justify-between border-l-4 border-l-purple-500 opacity-60 grayscale-[0.5]">
             <div className="relative">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <Zap size={18} className="text-purple-500" fill="currentColor" />
                 Pro Duel
               </h3>
               <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-400">Entry:</span>
                  <div className="flex items-center gap-1 text-red-400 font-bold text-sm">
                     <Gem size={12} fill="currentColor"/> 6
                  </div>
                  <span className="text-slate-600">|</span>
                  <span className="text-xs text-slate-400">Prize:</span>
                   <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                     <Gem size={12} fill="currentColor"/> 10
                  </div>
               </div>
            </div>
             <Button variant="ghost" disabled className="text-xs">Coming Soon</Button>
         </div>

      </div>

      <p className="text-center text-xs text-slate-600 mt-auto">
        Matchmaking is asynchronous. Compete against ghosts of players in your skill bracket.
      </p>

    </motion.div>
  );
};
