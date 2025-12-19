import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Crosshair, Shield, PlayCircle } from 'lucide-react';

interface TutorialOverlayProps {
    onComplete: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "Welcome Pilot",
            icon: <PlayCircle size={64} className="text-blue-400 mb-4" />,
            content: "Welcome to Titan Arcade using TripleSpeed technology. Prove your skill to earn rewards.",
            action: "Next"
        },
        {
            title: "Controls",
            icon: <Crosshair size={64} className="text-green-400 mb-4" />,
            content: "Drag anywhere on the screen to move your ship. Your weapons fire automatically.",
            action: "Got it"
        },
        {
            title: "Objective",
            icon: <Shield size={64} className="text-yellow-400 mb-4" />,
            content: "Destroy enemy ships to score points. Avoid incoming fire. Survive for 60 seconds.",
            action: "Understood"
        },
        {
            title: "Training Mission",
            icon: <ArrowRight size={64} className="text-purple-400 mb-4" />,
            content: "We need to calibrate your sensors. Complete one mandatory practice match to unlock the league.",
            action: "Start Training"
        }
    ];

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex flex-col items-center text-center space-y-6"
                    >
                        <div className="p-6 rounded-full bg-white/5 ring-1 ring-white/10 animate-float">
                            {steps[step].icon}
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
                                {steps[step].title}
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed">
                                {steps[step].content}
                            </p>
                        </div>

                        <div className="pt-8 w-full">
                            <div className="flex justify-center gap-2 mb-8">
                                {steps.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`} 
                                    />
                                ))}
                            </div>

                            <Button 
                                variant="primary" 
                                size="xl" 
                                onClick={nextStep}
                                className="w-full animate-pulse-glow"
                            >
                                {steps[step].action}
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
