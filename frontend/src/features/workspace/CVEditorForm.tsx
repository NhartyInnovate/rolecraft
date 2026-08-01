import React, { useState, useEffect, useRef } from 'react';
import { CVDraft, DraftExperience, DraftEducation, DraftSkill, DraftProject } from '../../types';
import { useUpdateCVDraft } from '../../hooks/useRoleCraftApi';
import {
  CheckCircle2,
  CloudCheck,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  User,
  Sparkles,
  Briefcase,
  GraduationCap,
  Layers,
  Code,
  Award,
} from 'lucide-react';

interface CVEditorFormProps {
  sessionId: string;
  initialDraft: CVDraft;
}

type AutosaveState = 'idle' | 'saving' | 'saved' | 'error';

export const CVEditorForm: React.FC<CVEditorFormProps> = ({ sessionId, initialDraft }) => {
  const [draft, setDraft] = useState<CVDraft>(initialDraft);
  const [autosaveState, setAutosaveState] = useState<AutosaveState>('idle');
  const [newSkillName, setNewSkillName] = useState('');

  const updateDraftMutation = useUpdateCVDraft(sessionId);
  const isFirstRender = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced 1500ms Autosave hook
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setAutosaveState('saving');

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateDraftMutation.mutateAsync(draft);
        setAutosaveState('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        setAutosaveState('error');
      }
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [draft]);

  const renderAutosaveBadge = () => {
    switch (autosaveState) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-800/80 text-amber-400 text-xs rounded-full">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            <span>Writing updates...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Changes saved to cloud</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs rounded-full">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Autosave failed. Retrying...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>All changes synced</span>
          </div>
        );
    }
  };

  const updatePersonalInfo = (field: string, val: string) => {
    setDraft((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: val },
    }));
  };

  const updateExperienceRole = (id: string, field: keyof DraftExperience, val: any) => {
    setDraft((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    }));
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: DraftSkill = {
      id: `skl_${Date.now()}`,
      category: 'Competency',
      name: newSkillName.trim(),
      confidence: 'high',
    };
    setDraft((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
    setNewSkillName('');
  };

  const removeSkill = (id: string) => {
    setDraft((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== id) }));
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans pb-12">
      {/* Sticky Canvas Header with Autosave Badge */}
      <div className="bg-[#0e1422]/95 border border-slate-800/80 rounded-xl p-3.5 sticky top-16 z-20 backdrop-blur-md flex items-center justify-between shadow-sm">
        <div>
          <h2 className="text-xs font-bold text-white tracking-tight">Interactive Executive CV Editor</h2>
          <p className="text-[10px] text-slate-400 font-light">Edits automatically sync every 1500ms.</p>
        </div>
        {renderAutosaveBadge()}
      </div>

      {/* SECTION 1: Personal Details */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/60">
          <User className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Personal Information & Links</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
            <input
              type="text"
              value={draft.personal_info.full_name}
              onChange={(e) => updatePersonalInfo('full_name', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input
              type="email"
              value={draft.personal_info.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Phone</label>
            <input
              type="text"
              value={draft.personal_info.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Location</label>
            <input
              type="text"
              value={draft.personal_info.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">LinkedIn</label>
            <input
              type="text"
              value={draft.personal_info.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Website / Portfolio</label>
            <input
              type="text"
              value={draft.personal_info.website || ''}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Headline & Executive Summary */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/60">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Professional Headline & Summary</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Headline</label>
            <input
              type="text"
              value={draft.professional_headline.text}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  professional_headline: { ...prev.professional_headline, text: e.target.value },
                }))
              }
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Executive Summary</label>
            <textarea
              rows={4}
              value={draft.summary.text}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  summary: { ...prev.summary, text: e.target.value },
                }))
              }
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-200 font-light leading-relaxed resize-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Experience Cards */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Work Experience</h3>
          </div>
        </div>

        <div className="space-y-3.5">
          {draft.experience.map((exp) => (
            <div key={exp.id} className="p-3.5 bg-slate-900/60 border border-slate-800/60 rounded-lg space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Title</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperienceRole(exp.id, 'title', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-md text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperienceRole(exp.id, 'company', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-md text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Bullet Points</label>
                <div className="space-y-1.5">
                  {exp.bullet_points.map((bp, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs">
                      <span className="text-indigo-400 font-bold">•</span>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => {
                          const updated = [...exp.bullet_points];
                          updated[bIdx] = e.target.value;
                          updateExperienceRole(exp.id, 'bullet_points', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-md text-slate-200 font-light"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Skills Manager */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/60">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Skills & Core Competencies</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {draft.skills.map((skl) => (
            <span
              key={skl.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 border border-slate-800/80 text-indigo-300 rounded-md text-xs font-medium"
            >
              <span>{skl.name}</span>
              <button
                type="button"
                onClick={() => removeSkill(skl.id)}
                className="text-slate-500 hover:text-rose-400 ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-xs pt-1">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Add new skill..."
            className="w-full px-2.5 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-md text-xs text-white"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium shrink-0 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
