import { Gem } from 'lucide-react';
import React from 'react';

export const GemsDisplay = ({ amount }: { amount: number }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-inner">
      <Gem className="text-yellow-400" size={20} fill="currentColor" />
      <span className="font-bold text-yellow-100 font-mono tracking-wider">{amount}</span>
    </div>
  );
};
