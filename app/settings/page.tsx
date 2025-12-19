"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Home, Volume2, Bell, RefreshCw, Trash2, ArrowLeft } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

export default function SettingsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { resetPlayer } = usePlayerStore();

  const handleReset = () => {
      if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
         // Perform reset action (we might need to add this to the store if missing)
         localStorage.clear();
         window.location.href = "/";
      }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 max-w-md mx-auto flex flex-col">
       
       <header className="flex items-center gap-4 mb-8">
            <Link href="/profile">
                <Button variant="ghost" size="sm" className="text-slate-400">
                    <ArrowLeft size={20} />
                </Button>
            </Link>
            <h1 className="text-xl font-bold">Settings</h1>
       </header>

       <div className="space-y-6">
            
            {/* Audio */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Audio & Haptics</h2>
                <div className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Volume2 className="text-blue-400" />
                        <span>Sound Effects</span>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={soundEnabled} 
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        className="toggle toggle-primary"
                    />
                     {/* Fallback toggle styling if daisyUI missing */}
                     <div 
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-slate-700'}`}
                     >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                     </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="space-y-3">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">General</h2>
                <div className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Bell className="text-purple-400" />
                        <span>Notifications</span>
                    </div>
                     <div 
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notificationsEnabled ? 'bg-purple-500' : 'bg-slate-700'}`}
                     >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                     </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-3 pt-8">
                <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider">Danger Zone</h2>
                <Button variant="danger" className="w-full justify-between group" onClick={handleReset}>
                    <span className="flex items-center gap-2">
                        <Trash2 size={18} />
                        Reset Progress
                    </span>
                </Button>
            </section>

            <div className="pt-8 text-center text-xs text-slate-600 font-mono">
                Titan Arcade v1.0.0
            </div>

       </div>
    </div>
  );
}
