import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileControlsProps {
    onInput: (direction: 'left' | 'right', active: boolean) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ onInput }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-end pb-8 px-4">
            
            {/* Arrow Controls */}
            <div className="flex justify-between items-end w-full px-2 gap-4">
                <button
                    aria-label="Move left"
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
                    aria-label="Move right"
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
        </div>
    );
};

