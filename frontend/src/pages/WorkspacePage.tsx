import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareerSessionStatus, useCVDraft } from '../hooks/useRoleCraftApi';
import { AICoachChat } from '../features/workspace/AICoachChat';
import { CVEditorForm } from '../features/workspace/CVEditorForm';
import { ExportPanel } from '../features/workspace/ExportPanel';
import {
  ArrowLeft,
  Sparkles,
  Download,
  Bot,
  FileEdit,
  Layers,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const { session_id } = useParams<{ session_id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'editor' | 'coach'>('editor');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: status, isLoading: isStatusLoading } = useCareerSessionStatus(session_id);
  const { data: draft, isLoading: isDraftLoading } = useCVDraft(session_id);

  if (isStatusLoading || isDraftLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono">Opening RoleCraft Workspace...</p>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4">
        <p>No confirmed draft found for this session.</p>
        <button
          onClick={() => navigate(`/session/${session_id}/onboarding`)}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-xl"
        >
          Go to Onboarding & Review
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Top Workspace Bar */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900/80 border border-slate-800/80 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                {draft.personal_info.full_name}'s Career Workspace
              </h1>
              <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Confirmed Draft</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Target Role: {draft.professional_headline.text}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile View Toggle Buttons */}
          <div className="lg:hidden flex items-center bg-slate-900/80 p-1 border border-slate-800/80 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'editor' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab('coach')}
              className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
                activeTab === 'coach' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Coach</span>
            </button>
          </div>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CV</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[75vh]">
        {/* Left Side: AI Executive Coach Panel */}
        <div
          className={`lg:col-span-5 h-[75vh] ${
            activeTab === 'coach' ? 'block' : 'hidden lg:block'
          }`}
        >
          <AICoachChat sessionId={session_id!} />
        </div>

        {/* Right Side: Canva Docs / Notion Editor Panel */}
        <div
          className={`lg:col-span-7 ${
            activeTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          <CVEditorForm sessionId={session_id!} initialDraft={draft} />
        </div>
      </div>

      <ExportPanel
        sessionId={session_id!}
        candidateName={draft.personal_info.full_name}
        targetRole={draft.professional_headline.text}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
