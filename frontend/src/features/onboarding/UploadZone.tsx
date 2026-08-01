import React, { useState, useRef } from 'react';
import { useUploadDocument } from '../../hooks/useRoleCraftApi';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, FileCode } from 'lucide-react';
import { motion } from 'motion/react';

interface UploadZoneProps {
  sessionId: string;
  onUploadStarted: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ sessionId, onUploadStarted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [showTextOption, setShowTextOption] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDocument(sessionId);

  const handleFileSelect = async (file: File) => {
    setUploadError(null);

    const allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(ext)) {
      setUploadError('Only .pdf, .docx, and .txt files are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds maximum limit of 10MB.');
      return;
    }

    try {
      await uploadMutation.mutateAsync(file);
      onUploadStarted();
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || 'Failed to process document upload. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    try {
      await uploadMutation.mutateAsync({
        file_name: 'Pasted_CV_Content.txt',
        file_text: pastedText,
        file_size: pastedText.length,
      });
      onUploadStarted();
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || 'Failed to submit CV text.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {uploadError && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {!showTextOption ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer relative overflow-hidden ${
            isDragging
              ? 'border-indigo-500 bg-indigo-950/20 shadow-md'
              : 'border-slate-800/80 bg-[#0e1422] hover:border-slate-700/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-white tracking-tight mb-1">
            Upload your existing CV or Resume
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6 leading-relaxed font-light">
            Drag and drop your document here, or click to browse. AI will extract your experience into structured representations for your review.
          </p>

          <div className="inline-flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>Supported: PDF, DOCX, TXT</span>
            <span>•</span>
            <span>Max size: 10MB</span>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/60 flex justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTextOption(true);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Or paste plain text directly</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleTextSubmit} className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Paste Resume Text</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowTextOption(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Back to File Upload
            </button>
          </div>

          <textarea
            rows={10}
            required
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw resume text here (Work history, Education, Skills, Headline)..."
            className="w-full p-3.5 text-xs font-mono bg-slate-900/80 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />

          <button
            type="submit"
            disabled={uploadMutation.isPending}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {uploadMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Submit Text for AI Extraction</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
