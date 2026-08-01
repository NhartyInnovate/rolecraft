import React, { useState } from 'react';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import {
  Sliders,
  Sun,
  Moon,
  Monitor,
  Bell,
  Bot,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  Download,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gemini-3.6-flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">Workspace & Appearance Settings</h1>
            <p className="text-xs text-slate-400 font-light">
              Customize theme preference, AI engine model selection, and privacy controls.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* SECTION 1: Appearance Theme System */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
          <Sun className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white">Appearance Theme</h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border text-xs flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-400" />
            <span className="font-medium">Light Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border text-xs flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="font-medium">Dark Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border text-xs flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'system'
                ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-5 h-5 text-slate-400" />
            <span className="font-medium">System Auto</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: AI Intelligence Engine */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
          <Bot className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">AI Intelligence Engine</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Active Gemini Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="gemini-3.6-flash">Gemini 3.6 Flash (Recommended — Ultra Fast Response)</option>
              <option value="gemini-3.6-pro">Gemini 3.6 Pro (Deep Executive Reasoning)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-medium text-slate-200 block">Proactive Coach Suggestions</span>
              <span className="text-[11px] text-slate-400 font-light block">
                Allow AI Coach to propose bullet point improvements automatically during edits.
              </span>
            </div>
            <input
              type="checkbox"
              checked={aiSuggestionsEnabled}
              onChange={(e) => setAiSuggestionsEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Notifications & Data Sovereignty */}
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white">Security & Data Privacy</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-slate-200 block">Workspace Notifications</span>
              <span className="text-[11px] text-slate-400 font-light block">
                Receive alerts when document extractions and export builds complete.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-slate-400" />
              <span className="font-light text-slate-300">Bank-Grade TLS 1.3 Data Encryption</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
