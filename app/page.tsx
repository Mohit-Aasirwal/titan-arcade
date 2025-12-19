"use client";
import Link from "next/link";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/Button";
import { DailyReward } from "@/components/hub/DailyReward";
import { GemsDisplay } from "@/components/hub/GemsDisplay";
import { Trophy, User, Rocket, PlayCircle } from "lucide-react";

export default function Home() {
  const { gems, elo, username } = usePlayerStore();

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white flex flex-col p-4 max-w-md mx-auto relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-secondary/10 rounded-full blur-[80px]" />

      {/* Header */}
      <header className="flex justify-between items-center py-4 relative z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                <User size={24} className="text-slate-300"/>
            </div>
            <div>
                <h2 className="font-bold text-sm leading-none">{username}</h2>
                <span className="text-xs text-slate-400 font-mono">ELO {elo}</span>
            </div>
        </div>
        <GemsDisplay amount={gems} />
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6 relative z-10 pt-4">
        
        {/* Daily Reward Section */}
        <section>
            <DailyReward />
        </section>

        {/* Featured Game Tile (The MVP Game) */}
        <section className="mt-2 text-center">
             <h3 className="text-left text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Featured Game</h3>
             
             <div className="group relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 bg-slate-800">
                {/* Image Placeholder / Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-950 group-hover:scale-105 transition-transform duration-500" />
                
                {/* Game Art Elements (CSS only for speed) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-blue-400 rounded-full shadow-[0_0_50px_var(--primary-glow)] flex items-center justify-center">
                    <Rocket size={64} className="text-white drop-shadow-lg" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end items-start text-left">
                    <h1 className="text-3xl font-black italic tracking-tighter text-white mb-1">SPACE<br/>SHOOTER</h1>
                    <p className="text-sm text-slate-300 mb-6 max-w-[80%]">Blast enemies, dodge obstacles, and dominate the leaderboard.</p>
                    
                    <Link href="/game" className="w-full">
                        <Button variant="primary" size="xl" className="w-full group-hover:bg-blue-400 transition-colors animate-pulse-glow">
                           <PlayCircle size={24} className="mr-2" />
                           PLAY NOW
                        </Button>
                    </Link>
                </div>
             </div>
        </section>

        {/* Secondary Links (Profile, Leaderboard) */}
        <div className="grid grid-cols-2 gap-4 mt-auto pb-6">
            <Link href="/profile">
                <div className="glass p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all cursor-pointer">
                    <User className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">Profile</span>
                </div>
            </Link>
            <Link href="/leaderboard">
                 <div className="glass p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition-all cursor-pointer">
                        <Trophy className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-300">Ranks</span>
                </div>
            </Link>
        </div>

      </div>
    </main>
  );
}
