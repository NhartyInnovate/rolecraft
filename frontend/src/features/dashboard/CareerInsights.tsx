import React from 'react';
import { Sparkles, TrendingUp, Target, Award, CheckCircle2 } from 'lucide-react';

export const CareerInsights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-4 relative">
        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-mono uppercase tracking-widest mb-1.5 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>ATS Strength Index</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1">88<span className="text-xs font-normal text-slate-500">/100</span></div>
        <p className="text-xs text-slate-400 leading-relaxed font-light">
          High keyword density for Senior Systems & Full Stack roles. Quantify leadership metrics to reach 95+.
        </p>
      </div>

      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-4 relative">
        <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-1.5 font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>Executive Readiness</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1">Strong</div>
        <p className="text-xs text-slate-400 leading-relaxed font-light">
          Headline and summary demonstrate clear ownership and high-scale impact messaging.
        </p>
      </div>

      <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-4 relative">
        <div className="flex items-center gap-2 text-amber-400 text-[10px] font-mono uppercase tracking-widest mb-1.5 font-medium">
          <Target className="w-3.5 h-3.5" />
          <span>AI Coach Focus</span>
        </div>
        <div className="text-2xl font-bold text-white mb-1">Action Verbs</div>
        <p className="text-xs text-slate-400 leading-relaxed font-light">
          Replace 2 passive descriptions with metric-driven verbs like <span className="text-indigo-300 italic">"Architected"</span> or <span className="text-indigo-300 italic">"Spearheaded"</span>.
        </p>
      </div>
    </div>
  );
};
