"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, User, Trophy, Users, ArrowLeft } from 'lucide-react';
import { GameStorage } from '@/lib/storage';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // Mock Data or Load from Storage
    const loadData = async () => {
        // We will seed some mock data for the MVP "Global" board
        const mockGlobal = [
            { id: '1', username: 'CyberNinja', elo: 1540, avatar: '' },
            { id: '2', username: 'NeonRider', elo: 1420, avatar: '' },
            { id: '3', username: 'GlitchMaster', elo: 1350, avatar: '' },
            { id: '4', username: 'PixelPete', elo: 1280, avatar: '' },
            { id: '5', username: 'RetroRex', elo: 1100, avatar: '' },
        ];
        // Combine with local player if needed, but for now just show mock
        setLeaderboard(mockGlobal);
    };
    loadData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 max-w-md mx-auto flex flex-col">
       
       <header className="flex items-center gap-4 mb-6">
            <Link href="/">
                <Button variant="ghost" size="sm" className="text-slate-400">
                    <ArrowLeft size={20} />
                </Button>
            </Link>
            <h1 className="text-xl font-bold">Leaderboards</h1>
       </header>

       {/* Tabs */}
       <div className="flex p-1 bg-slate-800 rounded-xl mb-6">
            <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'global' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setActiveTab('global')}
            >
                Global
            </button>
            <button 
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'friends' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                onClick={() => setActiveTab('friends')}
            >
                Friends
            </button>
       </div>

       {/* List */}
       <div className="flex-1 space-y-3">
            {activeTab === 'friends' ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-center">
                    <Users size={48} className="mb-2 opacity-50" />
                    <p className="font-bold">No friends yet</p>
                    <p className="text-xs">Invite friends to compete!</p>
                    <Button variant="secondary" size="sm" className="mt-4">Invite</Button>
                </div>
            ) : (
                leaderboard.map((player, index) => (
                    <div key={player.id} className="glass-card p-3 flex items-center gap-4">
                        <div className={`w-8 h-8 flex items-center justify-center font-black italic text-lg ${index < 3 ? 'text-yellow-400' : 'text-slate-500'}`}>
                            #{index + 1}
                        </div>
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border border-white/10">
                            <User size={20} className="text-slate-300"/>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-slate-100">{player.username}</p>
                            <p className="text-xs text-slate-400">Pro League</p>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-blue-400">{player.elo}</p>
                            <p className="text-[10px] text-slate-500 uppercase">ELO</p>
                        </div>
                    </div>
                ))
            )}
       </div>

    </div>
  );
}
