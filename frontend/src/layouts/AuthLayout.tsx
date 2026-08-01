import React from 'react';
import { Sparkles, CheckCircle2, Shield, Bot } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#0b0f19] flex flex-col lg:flex-row overflow-x-hidden font-sans antialiased">
      {/* Editorial Branding Hero Panel */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-[#080c14] border-r border-slate-800/40 relative">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            R
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">RoleCraft</span>
            <span className="ml-2 px-2 py-0.5 bg-slate-800 text-indigo-300 border border-slate-700/60 text-[10px] uppercase font-mono font-medium rounded-md tracking-widest">
              AI CAREER OS
            </span>
          </div>
        </div>

        <div className="relative z-10 my-12 lg:my-0 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI understands. Humans decide.</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            Your Executive AI Career Workspace.
          </h1>

          <p className="text-slate-400 text-sm lg:text-base leading-relaxed font-light">
            An intelligent operating system for professionals. Extract resume insights, review structured draft representations, and refine your career narrative with a dedicated AI Coach.
          </p>

          <div className="space-y-3 pt-4 border-t border-slate-800/40">
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full human review prior to document confirmation</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Canva-Docs inspired interactive CV editor</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Executive Career Coach with real-time feedback</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/40">
          <span>© 2026 RoleCraft Inc.</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Bank-grade privacy & encryption</span>
          </div>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 bg-[#0b0f19] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
