import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareerSessionStatus, useCVDraft } from '../hooks/useRoleCraftApi';
import { UploadZone } from '../features/onboarding/UploadZone';
import { ProcessingLoader } from '../features/onboarding/ProcessingLoader';
import { PendingReviewForm } from '../features/onboarding/PendingReviewForm';
import { CheckCircle2, Sparkles, FileSearch, Upload, ArrowLeft } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { session_id } = useParams<{ session_id: string }>();
  const navigate = useNavigate();

  // Polling setup per section 4 of specification: 3000ms when uploaded & not yet confirmed
  const [shouldPoll, setShouldPoll] = useState(false);

  const { data: status, isLoading: isStatusLoading } = useCareerSessionStatus(
    session_id,
    shouldPoll ? 3000 : false
  );

  const { data: draft, isLoading: isDraftLoading } = useCVDraft(
    status?.pending_review ? session_id : undefined
  );

  useEffect(() => {
    if (status) {
      if (status.draft_confirmed) {
        // Redirection rule 4: Route automatically to editor workspace /session/{session_id}
        navigate(`/session/${session_id}`, { replace: true });
      } else if (status.document_uploaded && !status.pending_review) {
        setShouldPoll(true);
      } else if (status.pending_review) {
        setShouldPoll(false);
      }
    }
  }, [status, session_id, navigate]);

  if (isStatusLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono">Loading Session Status...</p>
      </div>
    );
  }

  const isUploadingState = !status?.document_uploaded;
  const isProcessingState = status?.document_uploaded && !status?.pending_review && !status?.draft_confirmed;
  const isPendingReviewState = status?.pending_review && !status?.draft_confirmed;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Stepper */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        {/* Workflow Stepper */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
          <div className={`flex items-center gap-1.5 ${isUploadingState ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">1</span>
            <span>Upload CV</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className={`flex items-center gap-1.5 ${isProcessingState ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">2</span>
            <span>AI Extraction</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className={`flex items-center gap-1.5 ${isPendingReviewState ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">3</span>
            <span>Human Review</span>
          </div>
        </div>
      </div>

      {/* Main Dynamic View State */}
      {isUploadingState && (
        <div className="py-8">
          <UploadZone
            sessionId={session_id!}
            onUploadStarted={() => setShouldPoll(true)}
          />
        </div>
      )}

      {isProcessingState && (
        <ProcessingLoader fileName={status?.file_name} />
      )}

      {isPendingReviewState && (
        isDraftLoading || !draft ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono">Loading extracted draft payload...</p>
          </div>
        ) : (
          <PendingReviewForm
            sessionId={session_id!}
            initialDraft={draft}
            onConfirmed={() => navigate(`/session/${session_id}`)}
          />
        )
      )}
    </div>
  );
};
