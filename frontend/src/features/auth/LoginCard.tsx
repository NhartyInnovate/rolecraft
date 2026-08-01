import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/api';
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const LoginCard: React.FC = () => {
  const [email, setEmail] = useState('alex.developer@rolecraft.io');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const { data } = await apiClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Temporarily store token for context initialization
      localStorage.setItem('rc_access_token', data.access_token);
      localStorage.setItem('rc_refresh_token', data.refresh_token);

      // Fetch user profile info
      const profileResp = await apiClient.get('/profile', {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      });

      login(
        {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
        },
        profileResp.data
      );
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid login credentials. Please try again.');
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
          Welcome back
        </h1>
        <p className="text-xs text-slate-400">
          Sign in to access your intelligent career workspace.
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
            Work or Personal Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
              Password
            </label>
            <a href="#forgot" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
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
              <span>Sign in to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span>Don't have an account?</span>
        <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
          Create free account
        </Link>
      </div>

      <div className="mt-5 p-2.5 bg-indigo-950/20 border border-indigo-900/30 rounded-lg text-[11px] text-indigo-300 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span>Pre-filled with demo credentials for instant access.</span>
      </div>
    </motion.div>
  );
};
