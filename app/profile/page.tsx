"use client";
import React from 'react';
import Link from 'next/link';
import { usePlayerStore } from '@/store/playerStore';
import { Button } from '@/components/ui/Button';
import { User, Trophy, Sword, Target, Home, Settings } from 'lucide-react';
import { GemsDisplay } from '@/components/hub/GemsDisplay';

export default function ProfilePage() {
  const { username, elo, wins, losses, totalGames, bestScore, gems } = usePlayerStore();
  
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 max-w-md mx-auto flex flex-col">
       
       <header className="flex justify-between items-center mb-8">
            <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-400">
                    <Home size={20} />
                </Button>
            </Link>
            <h1 className="text-lg font-bold">Profile</h1>
            <Link href="/settings">
                <Button variant="ghost" size="sm" className="text-slate-400">
                    <Settings size={20} />
                </Button>
            </Link>
       </header>

       <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl p-1 mb-4">
                 <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                    <User size={48} className="text-slate-300" />
                 </div>
            </div>
            <h2 className="text-2xl font-bold">{username}</h2>
            <div className="flex items-center gap-2 mt-2">
                 <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/30">
                    Rookie League
                 </span>
                 <GemsDisplay amount={gems} />
            </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4 flex flex-col items-center">
                 <Trophy className="text-yellow-400 mb-2" size={24} />
                 <span className="text-2xl font-black">{elo}</span>
                 <span className="text-xs text-slate-400 uppercase tracking-wider">ELO Rating</span>
            </div>
            <div className="glass-card p-4 flex flex-col items-center">
                 <Target className="text-red-400 mb-2" size={24} />
                 <span className="text-2xl font-black">{bestScore.toLocaleString()}</span>
                 <span className="text-xs text-slate-400 uppercase tracking-wider">High Score</span>
            </div>
            <div className="glass-card p-4 flex flex-col items-center">
                 <Sword className="text-blue-400 mb-2" size={24} />
                 <span className="text-2xl font-black">{totalGames}</span>
                 <span className="text-xs text-slate-400 uppercase tracking-wider">Matches</span>
            </div>
            <div className="glass-card p-4 flex flex-col items-center">
                 <div className="radial-progress text-green-400 mb-2 font-bold" style={{ "--value": winRate } as any}>
                    {winRate}%
                 </div>
                 {/* Fallback visual for progress if DaisyUI not present, just text */}
                 <span className="text-xs text-slate-400 uppercase tracking-wider">Win Rate</span>
            </div>
       </div>

       {/* Recent Activity (Mock) */}
       <div className="flex-1">
            <h3 className="font-bold text-slate-500 text-sm uppercase mb-4">Recent Matches</h3>
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-12 rounded-full ${i===0 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <div>
                                <p className="font-bold text-sm text-slate-200">{i===0 ? 'Victory' : 'Defeat'} vs Ghost</p>
                                <p className="text-xs text-slate-500">Space Shooter • 2m ago</p>
                            </div>
                        </div>
                        <span className={`font-mono text-sm ${i===0 ? 'text-green-400' : 'text-red-400'}`}>
                            {i===0 ? '+10' : '-3'} Gems
                        </span>
                    </div>
                ))}
            </div>
       </div>

    </div>
  );
}
