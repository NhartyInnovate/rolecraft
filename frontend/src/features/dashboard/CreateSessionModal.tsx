import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateSession } from '../../hooks/useRoleCraftApi';
import { X, Sparkles, Briefcase, Target, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createSessionMutation = useCreateSession();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !targetRole.trim()) {
      setError('Title and Target Role are required fields');
      return;
    }

    try {
      const newSession = await createSessionMutation.mutateAsync({
        title: title.trim(),
        target_role: targetRole.trim(),
        career_goal: careerGoal.trim() || `Position for ${targetRole.trim()}`,
      });

      onClose();
      // Auto-redirect to Onboarding Upload screen for the new session
      navigate(`/session/${newSession.id}/onboarding`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create career session. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-lg bg-[#0e1422] border border-slate-800/80 rounded-xl shadow-2xl p-6 sm:p-7 text-slate-100 relative"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">Create Career Session</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium mb-1.5">
                Session Title <span className="text-indigo-400">*</span>
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Staff Engineer Application 2026"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium mb-1.5">
                Target Role <span className="text-indigo-400">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Principal Systems Architect"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium mb-1.5">
                Career Goal or Objective (Optional)
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <textarea
                  rows={3}
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Transition from lead engineering into enterprise distributed systems architecture."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800/60 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createSessionMutation.isPending}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {createSessionMutation.isPending ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create & Launch Upload</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
