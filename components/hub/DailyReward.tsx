import React, { useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { motion } from 'framer-motion';
import { Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const DailyReward = () => {
  const { dailyStreak, lastLogin, updateDailyStreak } = usePlayerStore();
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!lastLogin) {
      setCanClaim(true);
      return;
    }

    const last = new Date(lastLogin);
    last.setHours(0, 0, 0, 0);
    
    // Check if Last Login was yesterday or before
    // If today > last login date
    if (today.getTime() > last.getTime()) {
      setCanClaim(true);
    } else {
        setCanClaim(false);
    }
  }, [lastLogin]);

  const handleClaim = () => {
    updateDailyStreak();
    setCanClaim(false);
  };

  return (
    <div className="glass-card w-full max-w-sm border-t-4 border-t-yellow-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Gift size={80} />
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-200 flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" fill="currentColor" />
          Daily Rewards
        </h3>
        <span className="text-sm font-mono text-slate-400">Day {canClaim ? dailyStreak + 1 : dailyStreak}</span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
           <div className="text-3xl font-black text-white text-glow">
             +{canClaim ? (dailyStreak + 1) * 5 : 5} <span className="text-sm text-yellow-500">GEM</span>
           </div>
           <p className="text-xs text-slate-400 mt-1">
             {canClaim ? "Ready to claim!" : "Come back tomorrow"}
           </p>
        </div>
        
        <Button 
            disabled={!canClaim} 
            onClick={handleClaim}
            variant={canClaim ? "accent" : "secondary"}
            size="sm"
            className={canClaim ? "animate-pulse-glow" : ""}
        >
          {canClaim ? "Claim" : "Claimed"}
        </Button>
      </div>
    </div>
  );
};
