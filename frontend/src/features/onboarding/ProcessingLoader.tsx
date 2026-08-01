import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface ProcessingLoaderProps {
  fileName?: string;
}

export const ProcessingLoader: React.FC<ProcessingLoaderProps> = ({ fileName }) => {
  const steps = [
    'Reading document structure',
    'Extracting full text and layout sections',
    'Understanding career progression & achievements',
    'Identifying education & credentials',
    'Detecting core competencies & skills',
    'Organizing structured JSON representation',
    'Preparing human review interface',
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-xl mx-auto bg-[#0e1422] border border-slate-800/80 rounded-2xl p-8 text-slate-100 my-6 shadow-xl">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3 animate-pulse">
          <Bot className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight mb-1">
          AI Document Analysis in Progress
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          {fileName || 'Uploaded_CV.pdf'} • Gemini Intelligence Engine
        </p>
      </div>

      <div className="space-y-2.5 max-w-md mx-auto">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : isCurrent
                  ? 'bg-indigo-950/40 border-indigo-500/40 text-white font-medium'
                  : 'bg-slate-900/30 border-slate-800/40 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0" />
                )}
                <span>{step}</span>
              </div>

              {isDone && <span className="text-[10px] font-mono text-emerald-400 uppercase">Complete</span>}
              {isCurrent && <span className="text-[10px] font-mono text-indigo-400 uppercase animate-pulse">Analyzing</span>}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-slate-900/60 border border-slate-800/60 rounded-lg text-xs text-slate-400 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Almost ready! You will review all extracted sections in the next step.</span>
      </div>
    </div>
  );
};
