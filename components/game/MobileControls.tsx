import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

export const MobileControls = () => {
    const { controlMode } = usePlayerStore();
    
    if (controlMode !== 'buttons') return null;

    // We simulate key events so GameCanvas doesn't need to change its keyboard listeners
    const triggerKey = (key: string, type: 'keydown' | 'keyup') => {
        const event = new KeyboardEvent(type, {
            key: key,
            code: key === 'ArrowLeft' ? 'ArrowLeft' : 'ArrowRight',
            bubbles: true
        });
        window.dispatchEvent(event);
    };

    return (
        <div className="absolute bottom-6 left-0 w-full px-6 flex justify-between items-end z-40 pointer-events-none">
            {/* Left Button */}
            <button
                className="w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full flex items-center justify-center active:bg-blue-500/40 active:border-blue-400 active:scale-95 transition-all pointer-events-auto touch-manipulation"
                onPointerDown={(e) => {
                    e.preventDefault();
                    triggerKey('ArrowLeft', 'keydown');
                }}
                onPointerUp={(e) => {
                    e.preventDefault();
                    triggerKey('ArrowLeft', 'keyup');
                }}
                onPointerLeave={(e) => {
                    e.preventDefault();
                    triggerKey('ArrowLeft', 'keyup');
                }}
            >
                <ArrowLeft size={32} className="text-white/80" />
            </button>

            {/* Right Button */}
            <button
                className="w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-full flex items-center justify-center active:bg-blue-500/40 active:border-blue-400 active:scale-95 transition-all pointer-events-auto touch-manipulation"
                onPointerDown={(e) => {
                    e.preventDefault();
                    triggerKey('ArrowRight', 'keydown');
                }}
                onPointerUp={(e) => {
                    e.preventDefault();
                    triggerKey('ArrowRight', 'keyup');
                }}
                onPointerLeave={(e) => {
                    e.preventDefault();
                    triggerKey('ArrowRight', 'keyup');
                }}
            >
                <ArrowRight size={32} className="text-white/80" />
            </button>
        </div>
    );
};
