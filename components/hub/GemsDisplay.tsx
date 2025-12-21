import { Gem } from 'lucide-react';
import React from 'react';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export const GemsDisplay = ({ amount }: { amount: number }) => {
  return (
    <Link href="/get-gems">
      <div 
        aria-label={`Gems: ${amount}. Click to get more.`}
        className="group flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Gem className="text-yellow-400 group-hover:scale-110 transition-transform" size={18} fill="currentColor" aria-hidden="true" />
        <span className="font-bold text-yellow-100 font-mono tracking-wider text-sm">{amount}</span>
        <Plus size={14} className="text-white/50 group-hover:text-white transition-colors ml-1" aria-hidden="true" />
      </div>
    </Link>
  );
};
