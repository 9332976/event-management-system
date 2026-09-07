import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  LayoutDashboard,
  Calendar,
  Bookmark,
  Bell,
  User,
  PlusCircle,
  Users,
  CheckSquare,
  BarChart3,
  Shield,
  Layers,
  FileText,
  Settings,
  LogOut,
  Compass,
  ChevronRight,
  ExternalLink,
  Home,
  Award
} from 'lucide-react';

export const DashboardSidebar = ({ isOpen, onClose }) => {
  const { currentUser, currentRole, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation Links based on Current Role
  const studentNavItems = [
    { label: 'Public Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Explore Events', path: '/events', icon: Compass },
    { label: 'Event Calendar', path: '/student/calendar', icon: Calendar },
    { label: 'My Registrations', path: '/student/registrations', icon: CheckSquare },
    { label: 'Saved Events', path: '/student/bookmarks', icon: Bookmark },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
    { label: 'My Profile', path: '/student/profile', icon: User },
  ];

  const organizerNavItems = [
    { label: 'Public Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/organizer/dashboard', icon: LayoutDashboard },
    { label: 'Event Calendar', path: '/organizer/calendar', icon: Calendar },
    { label: 'My Events', path: '/organizer/events', icon: Layers },
    { label: 'Create Event', path: '/organizer/create-event', icon: PlusCircle },
    { label: 'Venues & Logistics', path: '/organizer/venues', icon: Layers },
    { label: 'Sponsors & Expo', path: '/organizer/sponsors', icon: Award },
    { label: 'Team Operations', path: '/organizer/collaborate', icon: CheckSquare },
    { label: 'Participants', path: '/organizer/participants', icon: Users },
    { label: 'Live Attendance', path: '/organizer/attendance', icon: CheckSquare },
  ];

  const adminNavItems = [
    { label: 'Public Home', path: '/', icon: Home },
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Host New Event', path: '/admin/create-event', icon: PlusCircle },
    { label: 'Event Moderation', path: '/admin/events', icon: Layers },
    { label: 'Master Calendar', path: '/admin/calendar', icon: Calendar },
    { label: 'Campus Venues', path: '/admin/venues', icon: Layers },
    { label: 'Sponsors & Expo', path: '/admin/sponsors', icon: Award },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Registrations', path: '/admin/registrations', icon: CheckSquare },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Analytics Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const navItems =
    currentRole === 'admin'
      ? adminNavItems
      : currentRole === 'organizer'
      ? organizerNavItems
      : studentNavItems;

  const roleColors = {
    student: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    organizer: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    admin: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 sm:h-20 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                Campus<span className="text-gradient">Connect</span>
              </span>
            </Link>
          </div>

          {/* Current Persona Badge */}
          <div className="px-5 py-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Guest User'}
                </p>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${roleColors[currentRole] || roleColors.student}`}>
                  {currentRole}
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="px-4 space-y-1 mt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/student/dashboard' || item.path === '/organizer/dashboard' || item.path === '/admin/dashboard'}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 opacity-40" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Campus Public Home</span>
            </span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 w-full px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
