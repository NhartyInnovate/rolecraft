import React, { useState } from 'react';
import { CVDraft, ConfidenceLevel, DraftExperience, DraftEducation, DraftSkill } from '../../types';
import { useConfirmDraft } from '../../hooks/useRoleCraftApi';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Edit2,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
} from 'lucide-react';
import { motion } from 'motion/react';

interface PendingReviewFormProps {
  sessionId: string;
  initialDraft: CVDraft;
  onConfirmed: () => void;
}

export const PendingReviewForm: React.FC<PendingReviewFormProps> = ({
  sessionId,
  initialDraft,
  onConfirmed,
}) => {
  const [draft, setDraft] = useState<CVDraft>(initialDraft);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const confirmMutation = useConfirmDraft(sessionId);

  const getConfidenceBadge = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <span>🟢 High Confidence</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-950/80 border border-amber-800 text-amber-400">
            <span>🟡 Medium - Review Recommended</span>
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-950/80 border border-rose-800 text-rose-400">
            <span>🔴 Low Confidence - Action Needed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmMutation.mutateAsync({ cv_draft: draft });
      onConfirmed();
    } catch (err) {
      console.error('Confirmation error:', err);
    }
  };

  // Helper updates
  const updatePersonalInfo = (field: string, val: string) => {
    setDraft((prev) => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: val,
      },
    }));
  };

  const updateExperience = (id: string, field: keyof DraftExperience, val: any) => {
    setDraft((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: val } : exp)),
    }));
  };

  const addExperienceRole = () => {
    const newExp: DraftExperience = {
      id: `exp_new_${Date.now()}`,
      title: 'New Position Title',
      company: 'Company Name',
      location: 'Location',
      start_date: '2023-01',
      end_date: '',
      current: true,
      description: 'Role overview...',
      bullet_points: ['Achieved 20% increase in productivity through process optimization.'],
      confidence: 'high',
    };
    setDraft((prev) => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const removeExperienceRole = (id: string) => {
    setDraft((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-2">
      {/* Editorial Header Banner */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-6 relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Human Review Required</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Review AI Extracted Credentials
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl font-light leading-relaxed">
              RoleCraft never auto-overwrites your career record. Review the extracted fields below, edit any section, and confirm when you are satisfied to open your interactive workspace.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={confirmMutation.isPending}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
          >
            {confirmMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Draft & Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 1: Personal Information */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">1. Personal Information</h2>
            {getConfidenceBadge(draft.personal_info.confidence)}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              value={draft.personal_info.full_name}
              onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              value={draft.personal_info.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Phone</label>
            <input
              type="text"
              value={draft.personal_info.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Location</label>
            <input
              type="text"
              value={draft.personal_info.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">LinkedIn URL</label>
            <input
              type="text"
              value={draft.personal_info.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Website / Portfolio</label>
            <input
              type="text"
              value={draft.personal_info.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Professional Headline & Summary */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">2. Headline & Executive Summary</h2>
            {getConfidenceBadge(draft.summary.confidence)}
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Professional Headline
            </label>
            <input
              type="text"
              value={draft.professional_headline.text}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  professional_headline: { ...prev.professional_headline, text: e.target.value },
                }))
              }
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Executive Career Summary
            </label>
            <textarea
              rows={4}
              value={draft.summary.text}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  summary: { ...prev.summary, text: e.target.value },
                }))
              }
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-200 leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Work Experience */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">3. Professional Experience</h2>
          </div>

          <button
            onClick={addExperienceRole}
            className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-indigo-400 border border-slate-800/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        </div>

        <div className="space-y-4">
          {draft.experience.map((exp, idx) => (
            <div
              key={exp.id}
              className="p-4 bg-slate-900/60 border border-slate-800/60 rounded-xl space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                  {getConfidenceBadge(exp.confidence)}
                </div>
                <button
                  onClick={() => removeExperienceRole(exp.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Remove Role"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Job Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Key Impact Bullet Points</label>
                <div className="space-y-2">
                  {exp.bullet_points.map((bp, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => {
                          const updated = [...exp.bullet_points];
                          updated[bIdx] = e.target.value;
                          updateExperience(exp.id, 'bullet_points', updated);
                        }}
                        className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/60">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">4. Education</h2>
          </div>

          <div className="space-y-3 text-xs">
            {draft.education.map((edu) => (
              <div key={edu.id} className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-lg space-y-1.5">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    setDraft((prev) => ({
                      ...prev,
                      education: prev.education.map((ed) => (ed.id === edu.id ? { ...ed, degree: e.target.value } : ed)),
                    }));
                  }}
                  className="w-full px-2 py-1 bg-slate-900/80 border border-slate-800/80 rounded-md text-white font-semibold"
                />
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => {
                    setDraft((prev) => ({
                      ...prev,
                      education: prev.education.map((ed) => (ed.id === edu.id ? { ...ed, institution: e.target.value } : ed)),
                    }));
                  }}
                  className="w-full px-2 py-1 bg-slate-900/80 border border-slate-800/80 rounded-md text-slate-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800/60">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">5. Skills & Competencies</h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {draft.skills.map((skl) => (
              <span
                key={skl.id}
                className="px-2.5 py-1 bg-slate-900/80 border border-slate-800/80 text-indigo-300 rounded-md font-medium text-xs"
              >
                {skl.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Bottom Floating Bar */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <p className="text-xs text-slate-400 font-light">
          Once confirmed, your draft will be loaded into the interactive Editor & AI Coach.
        </p>
        <button
          onClick={handleConfirm}
          disabled={confirmMutation.isPending}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {confirmMutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Draft & Launch Workspace</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
