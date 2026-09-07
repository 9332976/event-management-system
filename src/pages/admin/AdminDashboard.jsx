import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import {
  Users,
  Calendar,
  Shield,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { mockAnalytics } from '../../data/mockAnalytics';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const { events, categories } = useEvents();

  return (
    <div className="space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>University Deanery Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Campus Administration Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Oversee all campus events, audit participant rosters, and moderate student societies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-soft hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>View Reports</span>
          </Link>
          <Link
            to="/admin/events"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <span>Event Moderation Queue</span>
          </Link>
        </div>
      </div>

      {/* 2. Admin Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Campus Users"
          value="2,580"
          icon={Users}
          color="indigo"
          trend={14}
          trendLabel="active this term"
        />
        <StatsCard
          title="Campus Events"
          value={events.length}
          icon={Calendar}
          color="purple"
          subtitle="Across 35+ clubs"
        />
        <StatsCard
          title="Total Registrations"
          value="4,890"
          icon={CheckCircle2}
          color="emerald"
          trend={28}
          trendLabel="student passes"
        />
        <StatsCard
          title="Campus Attendance"
          value="89.6%"
          icon={Shield}
          color="amber"
          subtitle="Verified check-ins"
        />
      </div>

      {/* 3. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Trend Chart (8-Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                University Participation Growth
              </h3>
              <p className="text-xs text-slate-400">Total registrations and completed attendance across semesters</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-xl">
              Academic Term 2026
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalytics.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '1rem',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  name="Passes Issued"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4F46E5' }}
                />
                <Line
                  type="monotone"
                  dataKey="attendees"
                  name="Attended"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Links & Category Distribution (4-Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Campus Quick Controls
            </h3>
            <p className="text-xs text-slate-400">Direct administrative navigation</p>
          </div>

          <div className="space-y-2">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>User Directory (2,580 Students)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/admin/categories"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-purple-500" />
                <span>Category Config ({categories.length} Categories)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/admin/reports"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Export University Audit CSV</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>3 new student events pending Deanery review</span>
          </div>
        </div>

      </div>

      {/* 4. Events Moderation Preview Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Campus Events Moderation Log
            </h3>
            <p className="text-xs text-slate-400">All registered events across college clubs</p>
          </div>
          <Link
            to="/admin/events"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Moderate all →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {events.slice(0, 6).map((evt) => (
            <div key={evt.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={evt.banner}
                  alt={evt.title}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{evt.title}</p>
                  <p className="text-[10px] text-slate-400">
                    Organizer: {evt.organizer?.name} • {evt.categoryLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  {evt.registeredCount} / {evt.maxParticipants} Registered
                </span>
                <StatusBadge status={evt.approvalStatus || 'Approved'} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
