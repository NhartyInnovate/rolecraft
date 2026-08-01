import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerSessions } from '../hooks/useRoleCraftApi';
import { QuickActions } from '../features/dashboard/QuickActions';
import { CareerInsights } from '../features/dashboard/CareerInsights';
import { SessionGrid } from '../features/dashboard/SessionGrid';
import { CreateSessionModal } from '../features/dashboard/CreateSessionModal';
import { Briefcase, ArrowUpRight, FileText, Download, Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: sessions = [], isLoading, isError } = useCareerSessions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const activeSession = sessions[0];

  const handleContinueLast = () => {
    if (!activeSession) return;
    if (activeSession.pending_review || !activeSession.draft_confirmed) {
      navigate(`/session/${activeSession.id}/onboarding`);
    } else {
      navigate(`/session/${activeSession.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner & Quick Actions */}
      <QuickActions
        onCreateSession={() => setIsModalOpen(true)}
        onContinueLast={handleContinueLast}
        hasActiveSession={!!activeSession}
        targetRole={activeSession?.target_role || 'Senior Engineering Leader'}
        readinessScore={activeSession?.resume_score || 82}
      />

      {/* Career Insights Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400">
            Career Health & AI Analytics
          </h2>
        </div>
        <CareerInsights />
      </div>

      {/* Recent Sessions Grid */}
      <div id="sessions" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Career Sessions</h2>
            <p className="text-xs text-slate-400">
              Your ongoing executive applications and tailored resume workspaces.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>+ New Session</span>
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 bg-slate-950 border border-slate-800 rounded-2xl animate-pulse p-6" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 bg-rose-950/40 border border-rose-900/60 rounded-2xl text-rose-300 text-xs">
            Failed to load career sessions. Please check server connection.
          </div>
        ) : (
          <SessionGrid sessions={sessions} onCreateNew={() => setIsModalOpen(true)} />
        )}
      </div>

      {/* Documents & Exports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-800/40">
        <div id="documents" className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Parsed Documents</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{sessions.filter((s) => s.document_uploaded).length} Files</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            All uploaded resumes undergo AI extraction into structured JSON representations before human review.
          </p>

          <div className="space-y-2">
            {sessions
              .filter((s) => s.document_uploaded)
              .slice(0, 3)
              .map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/session/${s.id}`)}
                  className="p-3 bg-slate-900/80 border border-slate-800/60 rounded-lg flex items-center justify-between text-xs hover:border-slate-700/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-200">{s.title}</p>
                      <p className="text-[10px] text-slate-500">{s.target_role}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
          </div>
        </div>

        <div id="exports" className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Generated Exports</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Executive PDF</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            Export polished, ATS-optimized CV PDFs in Executive, Modern, or Minimal layout templates.
          </p>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800/60 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center justify-between text-slate-200 font-medium">
              <span>Executive Template Engine</span>
              <span className="text-emerald-400 font-mono text-[10px]">Ready</span>
            </div>
            <p className="text-slate-400 text-[11px] font-light leading-relaxed">
              Ready for export inside active sessions. High-contrast typography and clean margin calculations.
            </p>
          </div>
        </div>
      </div>

      <CreateSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
