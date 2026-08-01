import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  FileText,
  Shield,
  Zap,
  UserCheck,
  Briefcase,
  Layers,
  ChevronRight,
  Sun,
  Moon,
  UploadCloud,
  Cpu,
  Edit3,
  MessageSquare,
  Globe,
  Award,
  Lock,
  Compass,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* FIXED NAVIGATION BAR */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/60 px-6 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            R
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">RoleCraft</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 font-mono text-[9px] uppercase tracking-widest rounded">
              CAREER OS
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#workspace-preview" className="hover:text-white transition-colors">
            Workspace
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors">
            Testimonials
          </a>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
          <a href="#pricing" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span>Pricing</span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-800/60 rounded">
              Coming Soon
            </span>
          </a>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900/80 border border-slate-800 text-xs transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-slate-300 hover:text-white font-medium text-xs rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-16">
        {/* HERO SECTION */}
        <section className="relative px-6 lg:px-12 pt-16 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-mono mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Executive Career Partner</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12] max-w-4xl"
          >
            Build the Career You'll Be Proud Of.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl font-light leading-relaxed"
          >
            RoleCraft is your AI Executive Career Partner. Upload your CV, receive intelligent feedback, optimize your professional profile, collaborate with an AI Executive Coach, and generate interview-ready career documents.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
            </Link>
          </motion.div>

          {/* REALISTIC WORKSPACE PREVIEW MOCKUP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-14 w-full max-w-5xl rounded-2xl bg-[#0e1422] border border-slate-800/80 p-3 sm:p-4 shadow-2xl overflow-hidden relative"
          >
            {/* Window Topbar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 text-xs px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-slate-500 font-mono text-[11px] ml-2 hidden sm:inline">
                  rolecraft.app / workspace / senior-staff-architect
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-mono text-[10px] uppercase">AI Sync Active</span>
              </div>
            </div>

            {/* Inner Dashboard Canvas Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 text-left">
              {/* Left Column: CV Draft & Metrics */}
              <div className="lg:col-span-2 space-y-3 bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Alex Vance</span>
                    <span className="text-[11px] font-mono text-indigo-400">Target Role: Staff Systems Architect</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono rounded font-bold">
                    98% ATS Compliance
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  Engineered multi-region cloud platform processing 25M+ requests/day. Spearheaded Kubernetes microservice migration, reducing container latencies by 38% and cloud infrastructure spend by $120k annually.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-md text-[10px] font-mono">
                    Distributed Systems
                  </span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-md text-[10px] font-mono">
                    Go / Rust
                  </span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-md text-[10px] font-mono">
                    Kubernetes / Istio
                  </span>
                  <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-md text-[10px] font-mono">
                    System Architecture
                  </span>
                </div>
              </div>

              {/* Right Column: AI Executive Coach Interactive Snippet */}
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">AI Executive Coach</span>
                    <span className="text-[10px] font-mono text-slate-500 ml-auto">Gemini 3.6</span>
                  </div>
                  <div className="p-3 bg-slate-950/90 border border-slate-800/80 rounded-lg text-[11px] text-slate-300 leading-relaxed font-light">
                    "Alex, your achievements demonstrate clear executive scale. I recommend highlighting your $120k cost optimization metric directly in your executive summary."
                  </div>
                </div>
                <div className="pt-2 flex items-center justify-between text-[10px] text-indigo-400 font-mono">
                  <span>• Quantify leadership impact</span>
                  <span>Apply Edit →</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 bg-[#090d16]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                Platform Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Four Pillars of RoleCraft Excellence
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Everything you need to turn past experiences into executive narrative authority.
              </p>
            </div>

            {/* 4 Premium Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Resume Intelligence</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                  Upload any existing CV or resume and automatically extract structured professional experience, core skills, impact achievements, and education into an editable draft.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Executive AI Coach</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                  Collaborate in real time with an AI coach powered by Gemini 3.6. Receive tailored advice, metric quantification suggestions, and interview preparation questions.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Professional Profile Hub</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                  Build and maintain a living professional profile synchronized automatically with your confirmed CV drafts, contact details, web presence, and career target goals.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Career Workspace</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                  Manage all career sessions, documents, exports, and AI strategy conversations in one unified, high-performance workspace canvas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 max-w-7xl mx-auto">
          <div className="space-y-14">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                Simplified Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How RoleCraft Elevates Your Career
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                From raw document upload to executive coaching in four seamless steps.
              </p>
            </div>

            {/* 4-Step Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 space-y-4 relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                  01
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Upload Your CV</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Drop your current resume, PDF, or draft into a new RoleCraft career session.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 space-y-4 relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                  02
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">AI Structuring</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    AI parses text into structured contact info, work experiences, skills, and summary.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 space-y-4 relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                  03
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Review & Confirm</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Inspect the parsed draft, edit bullet points, refine skills, and confirm your baseline.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-[#0e1422] border border-slate-800/70 rounded-2xl p-6 space-y-4 relative">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 text-xs font-mono font-bold flex items-center justify-center">
                  04
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">AI Executive Coach</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Collaborate with your dedicated AI coach to refine narratives, prepare for interviews, and export documents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE PREVIEW SECTION */}
        <section id="workspace-preview" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 bg-[#090d16]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                Unified Canvas
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Designed for Focus & Precision
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                No cluttered tabs or disjointed tools. Everything is connected in one high-performance workspace.
              </p>
            </div>

            <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                    <Layers className="w-4 h-4" />
                    <span>Session Intelligence</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Create separate sessions tailored to different target executive roles without mixing up career histories.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                    <Globe className="w-4 h-4" />
                    <span>Profile Synchronization</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Confirmed CV data automatically updates your primary executive profile hub and web links.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                    <Award className="w-4 h-4" />
                    <span>ATS Metric Scoring</span>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    Real-time keyword matching and metric analysis ensure your application survives recruiter screens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY ROLECRAFT SECTION */}
        <section id="why-rolecraft" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 max-w-7xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                The RoleCraft Distinction
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                More Than Just a Resume Builder
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Generic resume builders only format text. RoleCraft combines six critical executive tools into one integrated platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'AI Resume Intelligence', desc: 'Automatic extraction & structuring from raw PDF/text CVs.' },
                { title: 'Executive Career Coaching', desc: 'Real-time conversational advice powered by Gemini 3.6.' },
                { title: 'Professional Identity Management', desc: 'A living, editable profile synced with confirmed credentials.' },
                { title: 'ATS Optimization Engine', desc: 'Keyword density and quantitative metric enhancement.' },
                { title: 'Document Generation', desc: 'Clean, professional PDF & text export formats.' },
                { title: 'Executive Career Guidance', desc: 'Tailored interview questions & positioning strategy.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0e1422] border border-slate-800/70 rounded-xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="text-xs font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION (COMING SOON) */}
        <section id="pricing" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 bg-[#090d16]">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <span className="px-2.5 py-1 bg-indigo-950 border border-indigo-800 text-indigo-400 text-[10px] font-mono rounded-full uppercase tracking-wider">
                Transparent Pricing • Free Tier Available
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Invest in Your Executive Future
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Free Tier */}
              <div className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Starter Free Tier</h3>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-mono rounded">Active</span>
                </div>
                <p className="text-3xl font-bold text-white">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
                <ul className="space-y-2 text-xs text-slate-300 font-light">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full CV Parsing & Structuring</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Executive Profile Hub Access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Basic AI Coach Strategy Sessions</li>
                </ul>
                <Link
                  to="/register"
                  className="block w-full py-2.5 text-center bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro Tier (Coming Soon) */}
              <div className="bg-[#0e1422] border border-indigo-500/30 rounded-2xl p-6 space-y-4 relative overflow-hidden">
                <div className="absolute -right-12 top-6 bg-indigo-600 text-white text-[9px] font-mono uppercase tracking-widest py-1 px-12 rotate-45 shadow-sm">
                  Coming Soon
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Executive Pro</h3>
                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-400 text-[10px] font-mono rounded">Upcoming</span>
                </div>
                <p className="text-3xl font-bold text-white">$19 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
                <ul className="space-y-2 text-xs text-slate-300 font-light">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Unlimited AI Coach Consultations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Advanced ATS Optimization Benchmarks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> One-Click Executive PDF Document Exports</li>
                </ul>
                <button
                  disabled
                  className="w-full py-2.5 bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed"
                >
                  Join Waitlist (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section id="testimonials" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 bg-[#090d16] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
          <div className="max-w-7xl mx-auto space-y-12 relative z-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
                Executive Social Proof
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Trusted by Senior Engineering Leaders
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                Here is how RoleCraft helped executives command narrative authority and land principal roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "RoleCraft helped me translate complex multi-cloud migrations into quantifiable business metrics. My AI Executive Coach caught gaps in my executive summary that standard templates miss completely.",
                  name: "Marcus Vance",
                  title: "Staff Systems Architect",
                  company: "CloudScale Inc.",
                },
                {
                  quote: "The profile synchronization between my parsed CV draft and my living digital identity saved me hours. The interview preparation coach generated questions tailored specifically to my target Principal role.",
                  name: "Elena Rostova",
                  title: "VP of Product Engineering",
                  company: "Apex Dynamics",
                },
                {
                  quote: "Instead of staring at a blank resume page, RoleCraft extracted my 12-year career into structured impact achievements in under 30 seconds. The ATS compliance scoring gave me total confidence.",
                  name: "David Chen",
                  title: "Lead Infrastructure Lead",
                  company: "FinTech Global",
                },
              ].map((t, i) => (
                <div key={i} className="bg-[#0e1422] border border-slate-800/80 rounded-[22px] p-6 space-y-4 shadow-sm flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed italic">
                    "{t.quote}"
                  </p>
                  <div className="pt-4 border-t border-slate-800/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.name}</h4>
                      <p className="text-[11px] font-mono text-slate-400">{t.title} • {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              Clear answers about RoleCraft's executive parsing, security, and AI coaching.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does RoleCraft parse and structure my existing CV?",
                a: "RoleCraft uses Gemini 3.6 structured extraction to analyze uploaded PDFs or raw text files. It breaks down your background into verified contact details, target career goal, work history bullet points with quantitative impact metrics, skills, and education.",
              },
              {
                q: "Is my personal career data private and secure?",
                a: "Yes. RoleCraft treats your professional identity with strict privacy controls. Your credentials are only stored in your private workspace and are never shared or used to train public models.",
              },
              {
                q: "Can I manually edit fields after AI extraction?",
                a: "Absolutely. Human control is a core pillar of our Design DNA. You can review and edit every single field, bullet point, or skill before confirming your baseline CV or profile.",
              },
              {
                q: "How does the AI Executive Coach assist me?",
                a: "The AI Coach operates alongside your workspace canvas. You can ask for advice on quantifying leadership impact, optimizing headlines for specific roles, drafting executive elevator pitches, or generating target role interview questions.",
              },
              {
                q: "What export formats are supported?",
                a: "You can export confirmed career sessions to executive ATS-compliant PDFs, clean markdown, or plain text versions ready for immediate job application submission.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#0e1422] border border-slate-800/80 rounded-2xl p-5 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-950 border border-indigo-800/80 text-indigo-400 text-xs font-mono flex items-center justify-center font-bold shrink-0">
                    ?
                  </span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed pl-7">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-20 px-6 lg:px-12 border-t border-slate-800/50 max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 font-semibold">
            Our Mission
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Empowering Leaders with Narrative Authority
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-2xl mx-auto">
            RoleCraft was built on the belief that senior professionals shouldn't struggle to articulate their impact. By combining deep structured parsing with real-time Gemini AI coaching, we help leaders land roles worthy of their ambition.
          </p>
        </section>

        {/* CTA BANNER */}
        <section className="py-16 px-6 lg:px-12 border-t border-slate-800/50 bg-indigo-950/30">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to Command Your Career Narrative?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-xl mx-auto">
              Create your free account now and start building your executive profile with RoleCraft.
            </p>
            <div>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/50 px-6 lg:px-12 py-10 bg-[#080c14] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              R
            </div>
            <span className="font-bold text-slate-200">RoleCraft</span>
            <span className="text-slate-600">|</span>
            <span>© 2026 RoleCraft Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
