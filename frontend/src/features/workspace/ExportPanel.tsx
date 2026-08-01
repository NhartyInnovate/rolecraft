import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ExportTemplate } from '../../types';
import { useGenerateExport } from '../../hooks/useRoleCraftApi';
import { Download, X, Check, Sparkles, FileText, Layout, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExportPanelProps {
  sessionId: string;
  candidateName?: string;
  targetRole?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  sessionId,
  candidateName,
  targetRole,
  isOpen,
  onClose,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('executive');
  const [exportData, setExportData] = useState<any>(null);

  const generateExportMutation = useGenerateExport(sessionId);

  if (!isOpen) return null;

  const templates: Array<{ id: ExportTemplate; title: string; desc: string }> = [
    { id: 'executive', title: 'Executive Template', desc: 'Classic serif typography with clean high-contrast spacing for leadership roles.' },
    { id: 'modern', title: 'Modern Clean', desc: 'Sleek sans-serif headers with indigo accent dividers.' },
    { id: 'minimal', title: 'Minimalist Editorial', desc: 'Generous white space, centered header, and strict mathematical proportions.' },
    { id: 'corporate', title: 'Corporate Standard', desc: 'Traditional two-column layout ideal for finance and enterprise environments.' },
    { id: 'creative', title: 'Creative Portfolio', desc: 'Modern typography with left accent rail for tech and design professionals.' },
  ];

  const handleExport = async () => {
    try {
      const res = await generateExportMutation.mutateAsync({
        template: selectedTemplate,
        file_type: 'PDF',
      });

      setExportData(res);

      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handlePrintWindow = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          className="w-full max-w-2xl bg-[#0e1422] border border-slate-800/80 rounded-2xl p-6 sm:p-7 text-slate-100 relative overflow-hidden shadow-xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Generate Executive Document</h2>
                <p className="text-xs text-slate-400 font-light">Select export layout & generate high-resolution PDF</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!exportData ? (
            <div className="space-y-5">
              <div className="space-y-2.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  Select Layout Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {templates.map((tpl) => {
                    const isSelected = selectedTemplate === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500/80 text-white'
                            : 'bg-slate-900/60 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-white mb-1">
                          <span>{tpl.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-light">{tpl.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-mono">
                  <span>Format: PDF</span> • <span>300 DPI High Density</span>
                </div>
                <button
                  onClick={handleExport}
                  disabled={generateExportMutation.isPending}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {generateExportMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate PDF Export</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center py-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Document Ready</h3>
                <p className="text-xs text-slate-300 font-mono">
                  {exportData.file_name} • {selectedTemplate.toUpperCase()} TEMPLATE
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/60 border border-slate-800/60 rounded-xl text-left text-xs space-y-2">
                <div className="flex items-center justify-between font-medium text-slate-200">
                  <span className="text-slate-400">Candidate</span>
                  <span>{candidateName || 'Alex Vance'}</span>
                </div>
                <div className="flex items-center justify-between font-medium text-slate-200">
                  <span className="text-slate-400">Target Role</span>
                  <span>{targetRole || 'Executive Professional'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-slate-800/60">
                <button
                  onClick={handlePrintWindow}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>

                <a
                  href={exportData.download_url}
                  download={exportData.file_name}
                  onClick={(e) => {
                    e.preventDefault();
                    window.print();
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
