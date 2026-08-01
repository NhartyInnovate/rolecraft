import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bot,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Search,
  Bell,
  Sparkles,
  Menu,
  X,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CreateSessionModal } from '../features/dashboard/CreateSessionModal';
import { motion } from 'motion/react';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { label: 'Home Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Career Journeys', path: '/sessions', icon: Briefcase },
    { label: 'AI Executive Coach', path: '/coach', icon: Bot },
    { label: 'Document Assets', path: '/documents', icon: FileText },
    { label: 'Executive Profile', path: '/profile', icon: UserIcon },
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const mobileBottomItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Journeys', path: '/sessions', icon: Briefcase },
    { label: 'Coach', path: '/coach', icon: Bot },
    { label: 'Assets', path: '/documents', icon: FileText },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const notifications = [
    { id: 1, title: 'AI Extraction Complete', message: 'Your CV document was parsed with 98% confidence.', time: '10m ago' },
    { id: 2, title: 'Coach Recommendation', message: 'Coach suggested 3 new action verbs for your lead engineer role.', time: '1h ago' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col lg:flex-row font-sans antialiased selection:bg-indigo-500/30 selection:text-white relative overflow-x-hidden">
      {/* Subtle Background Radial Glow - One per section */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0e1422] border-b border-slate-800/60 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/30">
            R
          </div>
          <span className="font-bold text-base text-white tracking-tight">RoleCraft</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* DESKTOP FLOATING VERTICAL DOCK (Inspired by Design DNA Section 11) */}
      <aside
        className={`fixed lg:sticky top-4 left-4 z-40 my-4 ml-4 hidden lg:flex flex-col justify-between bg-[#090d16]/95 border border-slate-800/80 rounded-[28px] p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 h-[calc(100vh-2rem)] shrink-0 ${
          isDockExpanded ? 'w-60' : 'w-20'
        }`}
      >
        <div className="space-y-4">
          {/* Dock Header & Expand Toggle */}
          <div className="flex items-center justify-between p-2 pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-600/30 shrink-0">
                R
              </div>
              {isDockExpanded && (
                <div className="min-w-0">
                  <span className="text-sm font-bold tracking-tight text-white block truncate leading-none">RoleCraft</span>
                  <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1 block">
                    CAREER OS
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsDockExpanded(!isDockExpanded)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer hidden lg:block"
              title={isDockExpanded ? 'Collapse Dock' : 'Expand Dock'}
            >
              {isDockExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* New Session Action Button */}
          <div className="px-1">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={`w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 ${
                !isDockExpanded && 'px-0'
              }`}
              title="New Career Session"
            >
              <Plus className="w-4 h-4 shrink-0" />
              {isDockExpanded && <span>New Session</span>}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 px-1">
            {isDockExpanded && (
              <div className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                Modules
              </div>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  title={!isDockExpanded ? item.label : undefined}
                  className={({ isActive: navActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                      navActive || isActive
                        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                    } ${!isDockExpanded ? 'justify-center px-0' : ''}`
                  }
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {isDockExpanded && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-2 pt-3 border-t border-slate-800/60 space-y-2">
          {isDockExpanded ? (
            <div className="flex items-center gap-2.5 px-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.target_career || user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className={`w-full py-2 bg-slate-900/90 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/50 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isDockExpanded && 'px-0'
            }`}
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {isDockExpanded && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE FULL SCREEN MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0b0f19]/95 backdrop-blur-xl p-6 flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                R
              </div>
              <span className="font-bold text-lg text-white">RoleCraft</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            <button
              onClick={() => {
                setIsCreateModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-indigo-600 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Career Session</span>
            </button>

            <nav className="space-y-1.5 pt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-indigo-600/20 text-indigo-400 font-bold border border-indigo-500/30' : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <button
            onClick={logout}
            className="w-full py-3 bg-slate-900 text-rose-400 border border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* MAIN WORKSPACE CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b0f19]">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex items-center justify-between h-16 px-8 border-b border-slate-800/40 bg-[#0b0f19]/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3 w-80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions, skills, documents..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/60 border border-slate-800/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/60 rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              <span className="text-[11px] font-mono text-slate-400 uppercase">{theme}</span>
            </button>

            {/* Quick Readiness Pill */}
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs rounded-full font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px]">AI Coach Ready</span>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800/60 rounded-xl transition-all relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl p-4 z-50">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/60">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">Notifications</span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-slate-950/80 border border-slate-800/60 rounded-xl text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-200 font-medium">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed font-light">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/60 rounded-xl text-xs text-slate-300 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <span className="font-bold text-white max-w-[120px] truncate">{user?.full_name}</span>
            </button>
          </div>
        </header>

        {/* Main Content Workspace Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* PERSISTENT MOBILE BOTTOM NAVIGATION (Design DNA Section 11: Home, Journeys, Coach, Assets, Profile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e1422]/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-2 flex justify-around items-center">
        {mobileBottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-medium transition-all ${
                isActive ? 'text-indigo-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Create Session Modal */}
      <CreateSessionModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};


