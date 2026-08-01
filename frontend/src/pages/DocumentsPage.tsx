import React, { useState } from 'react';
import { useCareerSessions } from '../hooks/useRoleCraftApi';
import { FileText, Download, CheckCircle2, Search, Code, Eye, Briefcase, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DocumentsPage: React.FC = () => {
  const { data: sessions, isLoading } = useCareerSessions();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'json'>('cards');
  const navigate = useNavigate();

  const selectedSession = sessions?.find((s) => s.id === selectedSessionId) || sessions?.[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-bold text-white tracking-tight">Executive Document Vault</h1>
          </div>
          <p className="text-xs text-slate-400 font-light">
            Parsed document extractions, structured draft representations, and high-resolution exports.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1 border border-slate-800/80 rounded-lg text-xs">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
              viewMode === 'cards' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Document Cards</span>
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-colors ${
              viewMode === 'json' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>JSON Payload</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading documents...</div>
      ) : !sessions || sessions.length === 0 ? (
        <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-12 text-center space-y-3">
          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-white">No documents found</p>
          <p className="text-xs text-slate-400 font-light max-w-sm mx-auto">
            Create a career session and upload your CV to generate parsed document extractions.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-[10px] font-mono rounded">
                    PARSED CV
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white tracking-tight">{s.title}</h3>
                <p className="text-xs text-slate-400 font-light flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{s.target_role}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => navigate(`/session/${s.id}`)}
                  className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800/80 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open Session</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedSessionId(s.id);
                    setViewMode('json');
                  }}
                  className="p-1.5 text-slate-400 hover:text-white"
                  title="View JSON"
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 text-xs">
            <span className="font-mono text-slate-400">
              Payload: {selectedSession?.title || 'Session Draft'}
            </span>
            <span className="text-indigo-400 font-mono">schema_v2.json</span>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800/80 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-96">
            {JSON.stringify(selectedSession || { status: 'empty' }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
