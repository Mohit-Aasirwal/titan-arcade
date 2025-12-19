"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { DailyReward } from '@/components/hub/DailyReward';
import { Button } from '@/components/ui/Button';
import { usePlayerStore } from '@/store/playerStore';
import { GemsDisplay } from '@/components/hub/GemsDisplay';

export default function GetGemsPage() {
  const { gems, addGems } = usePlayerStore();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [purchasingBundle, setPurchasingBundle] = useState<string | null>(null);

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    // Mock Ad Duration
    setTimeout(() => {
        addGems(25);
        setIsWatchingAd(false);
        // Optional: Show toast or confetti
    }, 2000);
  };

  const handlePurchase = (id: string, amount: number) => {
    setPurchasingBundle(id);
    // Mock Purchase Delay
    setTimeout(() => {
        addGems(amount);
        setPurchasingBundle(null);
        alert(`Successfully purchased ${amount} Gems!`);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-900/30 to-transparent pointer-events-none" />

        {/* Header */}
        <header className="flex items-center justify-between p-4 relative z-10">
            <Link href="/">
                <Button variant="glass" size="icon" className="rounded-full">
                    <ArrowLeft size={20} />
                </Button>
            </Link>
            <h1 className="text-lg font-bold">Store & Rewards</h1>
            <GemsDisplay amount={gems} />
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
            
            {/* Daily Reward Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                     <Sparkles className="text-yellow-400" size={18} />
                     <h2 className="font-bold text-slate-200">Daily Login Bonus</h2>
                </div>
                <DailyReward />
            </section>

            {/* Watch Ad Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                     <PlayCircle className="text-blue-400" size={18} />
                     <h2 className="font-bold text-slate-200">Watch & Earn</h2>
                </div>
                
                <div className="glass-card p-4 flex items-center justify-between group">
                    <div>
                        <div className="font-black text-2xl text-white">+25 <span className="text-sm font-normal text-slate-400">GEMS</span></div>
                        <p className="text-xs text-slate-400">Watch a short video ad</p>
                    </div>
                    <Button 
                        onClick={handleWatchAd} 
                        disabled={isWatchingAd}
                        className="bg-blue-600 hover:bg-blue-500 min-w-[100px]"
                    >
                        {isWatchingAd ? <Loader2 className="animate-spin" size={20} /> : "WATCH"}
                    </Button>
                </div>
            </section>

            {/* Shop Section */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                     <ShoppingBag className="text-green-400" size={18} />
                     <h2 className="font-bold text-slate-200">Gem Shop</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'heap', amount: 100, price: '$0.99', color: 'bg-slate-800' },
                        { id: 'bag', amount: 550, price: '$4.99', color: 'bg-slate-800', popular: true },
                        { id: 'chest', amount: 1200, price: '$9.99', color: 'from-amber-900/50 to-amber-700/20' },
                        { id: 'vault', amount: 3000, price: '$24.99', color: 'from-purple-900/50 to-purple-700/20' },
                    ].map((bundle) => (
                        <button 
                            key={bundle.id}
                            onClick={() => handlePurchase(bundle.id, bundle.amount)}
                            disabled={!!purchasingBundle}
                            className={`
                                relative p-4 rounded-xl border border-white/10 flex flex-col items-center gap-2 transition-all active:scale-95
                                ${bundle.popular ? 'bg-gradient-to-br from-blue-900/40 to-slate-900 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-slate-900/50'}
                            `}
                        >
                            {bundle.popular && (
                                <div className="absolute -top-2.5 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                                {bundle.id}
                            </div>
                            
                            <div className="text-2xl font-black text-white text-glow-sm">
                                {bundle.amount}
                            </div>
                            
                            {purchasingBundle === bundle.id ? (
                                <Loader2 className="animate-spin text-slate-500 my-1" size={20} />
                            ) : (
                                <div className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm font-bold text-white transition-colors w-full">
                                    {bundle.price}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>
        </div>
    </main>
  );
}
