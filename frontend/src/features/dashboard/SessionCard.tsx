import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerSession } from '../../types';
import { useDeleteSession } from '../../hooks/useRoleCraftApi';
import { Briefcase, Clock, ArrowRight, Trash2, CheckCircle2, FileSearch, Sparkles, Award } from 'lucide-react';

interface SessionCardProps {
  session: CareerSession;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteSession();

  const completionPercentage = session.draft_confirmed ? 100 : session.pending_review ? 75 : session.document_uploaded ? 45 : 20;
  const resumeScore = session.resume_score || 88;

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'draft_confirmed':
      case 'cv_generated':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case 'pending_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-950/80 border border-amber-800/80 text-amber-400">
            <FileSearch className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-indigo-950/80 border border-indigo-800/80 text-indigo-400">
            <Sparkles className="w-3 h-3 animate-spin" />
            <span>AI Parsing</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-300">
            <span>Drafting</span>
          </span>
        );
    }
  };

  const handleAction = () => {
    if (session.pending_review || !session.draft_confirmed) {
      navigate(`/session/${session.id}/onboarding`);
    } else {
      navigate(`/session/${session.id}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete career session "${session.title}"?`)) {
      deleteMutation.mutate(session.id);
    }
  };

  return (
    <div
      onClick={handleAction}
      className="bg-[#0e1422] border border-slate-800/80 hover:border-indigo-500/40 rounded-[22px] p-5 shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between relative space-y-4"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {getStageBadge(session.current_stage)}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-mono text-[10px] rounded-md font-bold flex items-center gap-1">
              <Award className="w-3 h-3 text-indigo-400" />
              <span>{resumeScore}% Score</span>
            </span>
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors opacity-0 group-hover:opacity-100"
              title="Delete Session"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">
          {session.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-slate-300 mb-3">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium">{session.target_role}</span>
        </div>

        {/* Completion Progress Bar */}
        <div className="space-y-1.5 mb-2">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Readiness</span>
            <span className="font-bold text-slate-200">{completionPercentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated {new Date(session.updated_at).toLocaleDateString()}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAction();
          }}
          className="px-3 py-1.5 bg-indigo-600/10 group-hover:bg-indigo-600 border border-indigo-500/30 text-indigo-400 group-hover:text-white rounded-xl font-bold text-[11px] flex items-center gap-1.5 transition-all"
        >
          <span>{session.draft_confirmed ? 'Continue' : 'Start'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

