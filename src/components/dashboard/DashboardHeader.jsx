import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useEvents } from '../../context/EventContext';
import { Menu, Sun, Moon, Bell, Search, Plus, Home, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const DashboardHeader = ({ onToggleSidebar, onOpenSearch }) => {
  const { currentUser, currentRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { notifications } = useEvents();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

      {/* Left: Mobile Toggle, Return Home & Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Return to Public Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
          title="Return to CampusConnect Home"
        >
          <Home className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Home</span>
        </Link>

        {/* Public Header Nav Links */}
        <nav className="hidden md:flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-700">
          <Link
            to="/events"
            className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Events
          </Link>
          <Link
            to="/calendar"
            className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Calendar
          </Link>
        </nav>

        {/* Portal Indicator */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-semibold text-slate-400">Portal:</span>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {currentRole} Center
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Quick Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition-all border border-slate-200 dark:border-slate-700"
          title="Search events (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Quick Search...</span>
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* View Website Badge Link */}
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-all"
          title="Go to Public Website"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public Site</span>
        </Link>

        {/* Admin Shortcut to Create Event */}
        {currentRole === 'admin' && (
          <Link
            to="/admin/events/new"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate(currentRole === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2 pl-1" title={currentUser?.name}>
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/30"
          />
        </div>

      </div>
    </header>
  );
};
