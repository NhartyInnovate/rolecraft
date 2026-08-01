import React from 'react';
import { CareerSession } from '../../types';
import { SessionCard } from './SessionCard';
import { Briefcase, Plus } from 'lucide-react';

interface SessionGridProps {
  sessions: CareerSession[];
  onCreateNew: () => void;
}

export const SessionGrid: React.FC<SessionGridProps> = ({ sessions, onCreateNew }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-12 text-center my-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight mb-2">No career sessions yet</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Let's build your next opportunity. Create a session to upload your CV, extract structured insights, and collaborate with your AI Coach.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Career Session</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
};
