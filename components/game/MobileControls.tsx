import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Smartphone, Rotate3d, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MobileControlsProps {
    onInput: (direction: 'left' | 'right', active: boolean) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onInput }) => {
    const [mode, setMode] = useState<'arrows' | 'tilt'>('arrows');
    const [showSettings, setShowSettings] = useState(false);
    
    // Tilt Logic
    useEffect(() => {
        if (mode !== 'tilt') return;

        const handleOrientation = (e: DeviceOrientationEvent) => {
            const gamma = e.gamma || 0; // Left/Right tilt (-90 to 90)
            
            // Deadzone of 5 degrees
            if (gamma < -15) {
                onInput('left', true);
                onInput('right', false);
            } else if (gamma > 15) {
                onInput('right', true);
                onInput('left', false);
            } else {
                onInput('left', false);
                onInput('right', false);
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [mode, onInput]);

    // Request Permission for iOS 13+
    const requestTiltPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const response = await (DeviceOrientationEvent as any).requestPermission();
                if (response === 'granted') {
                    setMode('tilt');
                } else {
                    alert('Permission denied');
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            setMode('tilt');
        }
    };

    return (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-end pb-8 px-4">
            
            {/* Settings Toggle */}
            <div className="absolute top-20 right-4 pointer-events-auto">
                <Button 
                    variant="glass" 
                    size="icon" 
                    onClick={() => setShowSettings(!showSettings)}
                    className="rounded-full bg-slate-900/50 backdrop-blur"
                >
                    <Settings size={20} className="text-slate-400" />
                </Button>
                
                {showSettings && (
                     <div className="absolute top-12 right-0 bg-slate-900 border border-white/10 p-2 rounded-xl flex flex-col gap-2 min-w-[140px] shadow-xl">
                        <span className="text-xs text-slate-500 font-bold px-2 uppercase tracking-wider">Controls</span>
                        
                        <button 
                            onClick={() => setMode('arrows')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'arrows' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                        >
                            <ArrowLeft size={16} /> Arrows
                        </button>
                        
                        <button 
                             onClick={requestTiltPermission}
                             className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'tilt' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                        >
                            <Rotate3d size={16} /> Tilt
                        </button>
                     </div>
                )}
            </div>

            {/* Arrow Controls */}
            {mode === 'arrows' && (
                <div className="flex justify-between items-end w-full px-2 gap-4">
                    <button
                        className="pointer-events-auto w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/20 active:scale-95 transition-all shadow-lg shadow-black/20"
                        onPointerDown={() => onInput('left', true)}
                        onPointerUp={() => onInput('left', false)}
                        onPointerLeave={() => onInput('left', false)}
                        onTouchStart={(e) => { e.preventDefault(); onInput('left', true); }}
                        onTouchEnd={(e) => { e.preventDefault(); onInput('left', false); }}
                    >
                         <ArrowLeft size={48} className="text-white/80" />
                    </button>

                    <button
                        className="pointer-events-auto w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/20 active:scale-95 transition-all shadow-lg shadow-black/20"
                        onPointerDown={() => onInput('right', true)}
                        onPointerUp={() => onInput('right', false)}
                        onPointerLeave={() => onInput('right', false)}
                         onTouchStart={(e) => { e.preventDefault(); onInput('right', true); }}
                         onTouchEnd={(e) => { e.preventDefault(); onInput('right', false); }}
                    >
                         <ArrowRight size={48} className="text-white/80" />
                    </button>
                </div>
            )}
            
            {/* Tilt Hint */}
             {mode === 'tilt' && (
                <div className="flex justify-center w-full pb-8 pointer-events-none opacity-50 animate-pulse">
                     <div className="flex flex-col items-center gap-2">
                        <Smartphone size={48} className="text-white rotate-12" />
                        <span className="text-sm font-bold text-white uppercase tracking-widest">Tilt to move</span>
                     </div>
                </div>
            )}

        </div>
    );
};
