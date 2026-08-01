import React from 'react';
import { Plus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface QuickActionsProps {
  onCreateSession: () => void;
  onContinueLast: () => void;
  hasActiveSession: boolean;
  targetRole?: string;
  readinessScore?: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateSession,
  onContinueLast,
  hasActiveSession,
  targetRole = 'Senior Engineering Leader',
  readinessScore = 82,
}) => {
  const { user } = useAuth();
  
  // Greeting based on time of day
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.full_name?.split(' ')[0] || 'Executive';

  return (
    <div className="bg-[#0e1422] border border-slate-800/80 rounded-[22px] p-6 sm:p-7 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-[11px] font-mono tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Executive Guidance</span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {timeGreeting}, {firstName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light leading-relaxed">
              You're <span className="font-bold text-emerald-400 font-mono">{readinessScore}% ready</span> for your <span className="text-white font-medium">{targetRole}</span> application.
            </p>
          </div>

          {/* Today's Focus Checklist (Design DNA Section 13) */}
          <div className="pt-2">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-semibold mb-2">
              Today's Focus:
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Improve Executive Summary</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ATS Optimization</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-950/50 border border-indigo-800/50 text-indigo-300 rounded-lg font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>Interview Practice</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {hasActiveSession && (
            <button
              onClick={onContinueLast}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/25"
            >
              <span>Continue Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onCreateSession}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-400" />
            <span>New Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};

