import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useUpdateUserProfile, useCareerSessions, useCVDraft } from '../hooks/useRoleCraftApi';
import { useAuth } from '../contexts/AuthContext';
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Save,
  CheckCircle2,
  Shield,
  Settings,
  RefreshCw,
  Sparkles,
  Linkedin,
  Github,
  Globe,
  Phone,
  MapPin,
  Bot,
  Award,
  Zap,
  TrendingUp,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const { data: sessions } = useCareerSessions();
  const { updateUser } = useAuth();

  // Find latest confirmed session for CV sync reference
  const confirmedSession = sessions?.find((s) => s.draft_confirmed) || sessions?.[0];
  const { data: cvDraft } = useCVDraft(confirmedSession?.id);

  // Form State
  const [fullName, setFullName] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [website, setWebsite] = useState('');
  const [bio, setBio] = useState('');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Populate state from profile API
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTargetCareer(profile.target_career || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setLinkedin(profile.linkedin || '');
      setGithub(profile.github || '');
      setWebsite(profile.website || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  // Handle manual sync from confirmed CV draft
  const handleManualSync = () => {
    if (cvDraft) {
      if (cvDraft.personal_info?.full_name) setFullName(cvDraft.personal_info.full_name);
      if (cvDraft.personal_info?.email) setEmail(cvDraft.personal_info.email);
      if (cvDraft.personal_info?.phone) setPhone(cvDraft.personal_info.phone);
      if (cvDraft.personal_info?.location) setLocation(cvDraft.personal_info.location);
      if (cvDraft.personal_info?.linkedin) setLinkedin(cvDraft.personal_info.linkedin);
      if (cvDraft.personal_info?.github) setGithub(cvDraft.personal_info.github);
      if (cvDraft.personal_info?.website) setWebsite(cvDraft.personal_info.website);
      if (cvDraft.summary?.text) setBio(cvDraft.summary.text);
      if (confirmedSession?.target_role) setTargetCareer(confirmedSession.target_role);

      setSyncNotice(`Synchronized profile fields from session: "${confirmedSession.title}"`);
      setTimeout(() => setSyncNotice(null), 4000);
    } else if (confirmedSession) {
      if (confirmedSession.target_role) setTargetCareer(confirmedSession.target_role);
      setSyncNotice(`Synced target career from session: "${confirmedSession.title}"`);
      setTimeout(() => setSyncNotice(null), 4000);
    } else {
      setSyncNotice('No confirmed CV draft available yet to sync.');
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    try {
      const updated = await updateProfileMutation.mutateAsync({
        full_name: fullName,
        target_career: targetCareer,
        email,
        phone,
        location,
        linkedin,
        github,
        website,
        bio,
        last_synced_at: new Date().toISOString(),
        synced_session_title: confirmedSession?.title || 'User Workspace Baseline',
      });

      updateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Calculate completeness score
  const fields = [fullName, email, targetCareer, phone, location, linkedin || github || website, bio];
  const filledCount = fields.filter((f) => Boolean(f && f.trim())).length;
  const completeness = Math.round((filledCount / fields.length) * 100);

  if (isProfileLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 font-mono text-xs">
        Loading executive identity profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-bold text-xl flex items-center justify-center shrink-0">
              {fullName.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">Executive Identity Hub</h1>
                <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-mono rounded flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CV SYNCED</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Intelligently initialized and synchronized from your confirmed career sessions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sync from latest confirmed session"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sync from CV</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800/80 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Sync Metadata & Source Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/60">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Sync Source</span>
            <span className="text-slate-200 font-medium truncate block">
              {confirmedSession ? confirmedSession.title : 'Default Workspace Baseline'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Last Sync Status</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{profile?.last_synced_at ? new Date(profile.last_synced_at).toLocaleDateString() : 'Active Auto-Sync'}</span>
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Readiness Score</span>
            <span className="text-indigo-400 font-medium font-mono">{completeness}% Executive Ready</span>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {saveSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Profile identity settings updated successfully!</span>
        </div>
      )}

      {syncNotice && (
        <div className="p-3 bg-indigo-950/60 border border-indigo-800/80 rounded-lg text-indigo-300 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* GRID LAYOUT: LEFT INSIGHTS & RIGHT EDITABLE PROFILE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Profile Completeness & AI Insights */}
        <div className="space-y-4">
          {/* Completeness Gauge Card */}
          <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Profile Completeness</span>
              <span className="text-xs font-mono font-bold text-indigo-400">{completeness}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-indigo-500 h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${completeness}%` }}
              />
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${fullName ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Personal Contact Info</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{fullName ? 'Complete' : 'Pending'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${targetCareer ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Target Career Goal</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{targetCareer ? 'Complete' : 'Pending'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${linkedin || github || website ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Professional Links</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{linkedin || github || website ? 'Complete' : 'Pending'}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${bio ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span>Executive Bio</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{bio ? 'Complete' : 'Pending'}</span>
              </div>
            </div>
          </div>

          {/* AI Profile Insights Card */}
          <div className="bg-[#0e1422] border border-slate-800/60 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
              <Bot className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold text-white">AI Profile Intelligence</h3>
            </div>

            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Gemini 3.6 continuously evaluates your identity profile against executive market benchmarks.
            </p>

            <div className="p-3 bg-slate-950/80 border border-slate-800/60 rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>Executive Positioning Tip</span>
              </div>
              <p className="text-[11px] text-slate-300 font-light">
                Your target role ({targetCareer || 'Executive'}) aligns strongly with parsed leadership metrics. Keep your LinkedIn link updated for instant recruiter verification.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN EDITABLE FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-[#0e1422] border border-slate-800/80 rounded-xl p-5 sm:p-6 space-y-5">
            {/* Section 1: Contact Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Personal & Contact Identity</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@vance.io"
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Primary Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA / Remote"
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Career Positioning & Bio */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Career Positioning & Target Role</h2>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Target Role / Executive Goal
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={targetCareer}
                      onChange={(e) => setTargetCareer(e.target.value)}
                      placeholder="e.g. VP of Engineering / Lead Cloud Architect"
                      className="w-full pl-10 pr-3.5 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Executive Bio / Synchronized Career Summary
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="High-impact overview of leadership experience, core architecture strengths, and quantitative outcomes..."
                    className="w-full p-3 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Professional Presence Links */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                <Globe className="w-4 h-4 text-indigo-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. Professional Links & Web Presence</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full pl-10 pr-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">GitHub Profile</label>
                  <div className="relative">
                    <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full pl-10 pr-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Portfolio / Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://vance.io"
                      className="w-full pl-10 pr-3 py-2 bg-slate-900/80 border border-slate-800/80 rounded-lg text-white font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-800/60">
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>RoleCraft Encrypted Data Sovereignty</span>
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {updateProfileMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Identity</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
