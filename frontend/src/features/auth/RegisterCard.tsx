import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';
import { ArrowRight, Lock, Mail, User, Briefcase, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const RegisterCard: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetCareer, setTargetCareer] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Register user (only email/password matching UserCreate)
      await apiClient.post('/auth/register', {
        email,
        password,
      });

      // 2. Perform form url-encoded login
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const loginResp = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const tokens = loginResp.data;
      localStorage.setItem('rc_access_token', tokens.access_token);
      localStorage.setItem('rc_refresh_token', tokens.refresh_token);

      // 3. Initialize profile and optionally set full_name
      let profileData;
      if (fullName.trim()) {
        const profileResp = await apiClient.put(
          '/profile',
          { full_name: fullName.trim() },
          {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          }
        );
        profileData = profileResp.data;
      } else {
        const profileResp = await apiClient.get('/profile', {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });
        profileData = profileResp.data;
      }

      login(
        {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_type: tokens.token_type,
        },
        profileData
      );
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto bg-[#0e1422] border border-slate-800/60 rounded-xl p-8 shadow-2xl shadow-black/40"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          R
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Role<span className="text-indigo-400">Craft</span>
        </span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
          Create your Career Workspace
        </h1>
        <p className="text-xs text-slate-400">
          Join thousands of professionals building their future with AI.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-rose-950/40 border border-rose-900/60 rounded-lg text-xs font-medium text-rose-300 flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. Sarah Jenkins"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
            Target Role or Career Goal
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              required
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="e.g. Senior Product Manager"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
            Work Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="sarah@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest mb-1.5">
            Set Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-sm"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span>Already registered?</span>
        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign in instead
        </Link>
      </div>
    </motion.div>
  );
};
