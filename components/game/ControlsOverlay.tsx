import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const ControlsOverlay = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 6000); // Hide after 6s
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 pointer-events-none z-40 flex justify-between items-center px-8 md:px-20"
                >
                    {/* Left Control Hint */}
                    <div className="flex flex-col items-center gap-2 animate-pulse-glow">
                        <div className="w-16 h-16 rounded-xl border-2 border-white/30 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                             <ArrowLeft className="text-blue-400" size={32} />
                        </div>
                        <span className="text-white font-bold text-shadow-sm">A / LEFT</span>
                    </div>

                    {/* Right Control Hint */}
                    <div className="flex flex-col items-center gap-2 animate-pulse-glow">
                        <div className="w-16 h-16 rounded-xl border-2 border-white/30 bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                             <ArrowRight className="text-blue-400" size={32} />
                        </div>
                        <span className="text-white font-bold text-shadow-sm">D / RIGHT</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
