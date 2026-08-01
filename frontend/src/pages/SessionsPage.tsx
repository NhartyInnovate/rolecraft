import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerSessions } from '../hooks/useRoleCraftApi';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Filter,
} from 'lucide-react';
import { CreateSessionModal } from '../features/dashboard/CreateSessionModal';

export const SessionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useCareerSessions();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in_progress' | 'confirmed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSessions = (sessions || []).filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.target_role.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'confirmed') return matchesSearch && s.draft_confirmed;
    if (filterStatus === 'in_progress') return matchesSearch && !s.draft_confirmed;

    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">Career Sessions Directory</h1>
          </div>
          <p className="text-xs text-slate-400 font-light">
            Manage your executive career positioning workflows, resume parsed drafts, and active coach sessions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Career Session</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0e1422]/60 p-3 rounded-xl border border-slate-800/60">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions or target roles..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            All ({sessions?.length || 0})
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterStatus === 'confirmed'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilterStatus('in_progress')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterStatus === 'in_progress'
                ? 'bg-indigo-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading career sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-12 text-center space-y-3">
          <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-white">No sessions found</p>
          <p className="text-xs text-slate-400 font-light max-w-sm mx-auto">
            {searchQuery
              ? 'No sessions match your search criteria. Try clearing search filters.'
              : 'Create your first career session to start extracting resume insights and coaching.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Session</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const isConfirmed = session.draft_confirmed;
            return (
              <div
                key={session.id}
                onClick={() =>
                  navigate(
                    isConfirmed
                      ? `/session/${session.id}`
                      : `/session/${session.id}/onboarding`
                  )
                }
                className="bg-[#0e1422] border border-slate-800/60 hover:border-indigo-500/40 rounded-xl p-5 space-y-4 cursor-pointer transition-all hover:shadow-lg group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 ${
                        isConfirmed
                          ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-400'
                          : 'bg-amber-950/60 border border-amber-800/60 text-amber-400'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Confirmed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Pending Review</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(session.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {session.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-light flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{session.target_role}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
                  <span>{isConfirmed ? 'Open Workspace' : 'Continue Review'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CreateSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
