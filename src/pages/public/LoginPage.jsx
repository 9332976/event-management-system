import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock
} from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState(null);

  const redirectForRole = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    return '/student/dashboard';
  };

  const handleRegularLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!email || !password) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    setSubmitting(true);
    setBlocked(null);
    try {
      const user = await login(email, password);
      showToast(`Logged in successfully as ${user.role.toUpperCase()}!`, 'success');
      const fallback = redirectForRole(user.role);
      const safeRedirect = redirectTo && redirectTo.startsWith('/') ? redirectTo : fallback;
      navigate(safeRedirect, { replace: true });
    } catch (error) {
      const message = error.message || 'Login failed. Please try again.';
      if (error.statusCode === 403) {
        setBlocked({ message, isPending: /pending|approval/i.test(message) });
      } else {
        showToast(message, 'error');
      }
    } finally {
      setSubmitting(false);
    }
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
              Sign in with the email address registered to your campus account.
            </p>
          </div>

          {/* Blocked account notice (pending / deactivated) */}
          {blocked && (
            <div
              className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border ${
                blocked.isPending
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
              }`}
            >
              {blocked.isPending ? (
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`text-xs font-bold ${
                    blocked.isPending
                      ? 'text-amber-900 dark:text-amber-200'
                      : 'text-rose-900 dark:text-rose-200'
                  }`}
                >
                  {blocked.isPending ? 'Account pending approval' : 'Account deactivated'}
                </p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    blocked.isPending
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {blocked.message}
                </p>
              </div>
            </div>
          )}
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
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Signing in...' : 'Login to CampusConnect'}</span>
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
