import React, { useState } from 'react';
import { useCareerSessions } from '../hooks/useRoleCraftApi';
import { AICoachChat } from '../features/workspace/AICoachChat';
import { Bot, Sparkles, ChevronDown, Zap } from 'lucide-react';

export const CoachPage: React.FC = () => {
  const { data: sessions, isLoading } = useCareerSessions();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Auto pick first session if available
  const activeSessionId = selectedSessionId || (sessions && sessions.length > 0 ? sessions[0].id : null);
  const selectedSession = sessions?.find((s) => s.id === activeSessionId);

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col font-sans max-w-5xl mx-auto">
      {/* Sleek Context Sub-Header (No double layout clutter) */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">Active Session Context:</span>

          {isLoading ? (
            <span className="text-xs text-slate-500 font-mono animate-pulse">Loading sessions...</span>
          ) : sessions && sessions.length > 0 ? (
            <div className="relative">
              <select
                value={activeSessionId || ''}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 rounded-lg text-xs font-semibold text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer transition-colors max-w-[240px] sm:max-w-md truncate"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                    {s.title} ({s.target_role})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-mono">No Active Session</span>
          )}
        </div>

        {/* AI Model & Readiness Status */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/50 rounded-full text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Ready</span>
          </div>
          <div className="px-2.5 py-1 bg-indigo-950/40 border border-indigo-800/50 rounded-full text-[11px] font-mono text-indigo-300 flex items-center gap-1">
            <Zap className="w-3 h-3 text-indigo-400" />
            <span>Gemini 3.6</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Workspace Canvas */}
      <div className="flex-1 min-h-0 pt-2">
        {activeSessionId ? (
          <AICoachChat sessionId={activeSessionId} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">No Career Session Selected</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Please create or select a career session from the dropdown above to launch context-aware AI coaching.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
