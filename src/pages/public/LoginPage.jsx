import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Lock,
  Mail,
  GraduationCap,
  UserCheck,
  Shield,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const LoginPage = () => {
  const { login, switchRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('debjit.banerjee@campus.edu');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('student');
  const [rememberMe, setRememberMe] = useState(true);

  const handleRegularLogin = (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your college email', 'error');
      return;
    }

    login(email, password, role);
    showToast(`Logged in successfully as ${role.toUpperCase()}!`, 'success');

    if (role === 'organizer') navigate('/organizer/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/student/dashboard');
  };

  const handleDemoLogin = (targetRole) => {
    switchRole(targetRole);
    showToast(`Switched persona to ${targetRole.toUpperCase()}`, 'success');

    if (targetRole === 'organizer') navigate('/organizer/dashboard');
    else if (targetRole === 'admin') navigate('/admin/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Col (Desktop Visual Composition) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          <div className="relative z-10 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">
                CampusConnect
              </span>
            </Link>

            <div className="pt-8 space-y-3">
              <h2 className="text-2xl font-bold font-display leading-snug">
                The All-in-One University Event Platform
              </h2>
              <p className="text-indigo-100 text-xs leading-relaxed">
                Connect with collegiate hackathons, sports leagues, cultural fests, and hands-on workshops with instant QR passes.
              </p>
            </div>
          </div>

          {/* Quick checklist */}
          <div className="relative z-10 space-y-2.5 pt-8 text-xs text-indigo-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Role-based access for Students, Clubs & Faculty</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Real-time seat occupancy & attendance tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Integrated E-Ticket Pass generation</span>
            </div>
          </div>

          {/* Decorative background glow */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-500/30 rounded-full blur-2xl" />
        </div>

        {/* Right Col (Login Form & 1-Click Persona Switches) */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-8 flex flex-col justify-center">
          
          <div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sign in to your campus account or use a 1-click demo persona.
            </p>
          </div>

          {/* 1-Click Demo Persona Quick Switch Buttons */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ⚡ Quick Fill Credentials
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('debjit.banerjee@campus.edu');
                  setPassword('student123');
                  setRole('student');
                  handleDemoLogin('student');
                }}
                className="p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[10px] font-bold text-indigo-500">Student Portal</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  Debjit Banerjee
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">debjit.banerjee@campus.edu</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('dean.studentaffairs@campus.edu');
                  setPassword('admin123');
                  setRole('admin');
                  handleDemoLogin('admin');
                }}
                className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-800/80 bg-rose-50/60 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-[10px] font-bold text-rose-500">Admin Console</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  Dr. Rajesh K. Verma (Dean)
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">admin@campus.edu</p>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
              Or Sign In With Email
            </span>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleRegularLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campus.edu"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => showToast('Password reset link simulated for your campus email.', 'info')}
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Login to CampusConnect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Register Link */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create student account
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};
