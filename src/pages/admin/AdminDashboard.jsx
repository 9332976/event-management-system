import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api/client';
import {
  Users,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  IndianRupee,
  Clock,
  ArrowRight,
  Bell,
  Ticket,
  Plus,
  ClipboardCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard = () => {
  const { events, analytics, notifications } = useEvents();
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/users?limit=500&role=student');
        setStudents(data.users || []);
      } catch (error) {
        showToast(error.message || 'Could not load students.', 'error');
      }
    };
    load();
  }, [showToast]);

  const stats = analytics?.adminStats;

  const derived = useMemo(() => {
    const totalRevenue = stats?.totalRevenue ?? 0;
    const totalDue = stats?.totalDue ?? 0;
    const pending = students.filter((s) => s.status === 'pending');
    const collected = students.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
    const dues = students.reduce((sum, s) => sum + (s.totalDue || 0), 0);
    return {
      totalRevenue,
      totalDue,
      pending,
      collected: collected || totalRevenue,
      dues: dues || totalDue,
      paidStudents: stats?.studentsPaid ?? students.filter((s) => s.paidCount > 0).length,
    };
  }, [stats, students]);

  const chartData = useMemo(() => {
    const series = analytics?.monthlyRegistrations || [];
    return series.map((m) => ({ month: m.month, registrations: m.registrations }));
  }, [analytics]);

  const unread = notifications.filter((n) => !n.read);

  const latestApplications = useMemo(
    () => analytics?.latestApplications || [],
    [analytics]
  );

  const recentEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).slice(0, 5),
    [events]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Campus Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Approve students, manage events, and track payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/students"
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl shadow-soft hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Students</span>
          </Link>
          <Link
            to="/admin/events/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Pending approvals alert */}
      {derived.pending.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {derived.pending.length} student {derived.pending.length === 1 ? 'account is' : 'accounts are'} waiting for approval
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Pending students cannot sign in until you approve them.
              </p>
            </div>
          </div>
          <Link
            to="/admin/students"
            className="flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0"
          >
            Review Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <SummaryTile
          icon={Users}
          label="Active Students"
          value={stats?.activeStudents ?? students.filter((s) => s.status === 'active').length}
          tone="indigo"
        />
        <SummaryTile icon={Calendar} label="Total Events" value={stats?.totalEvents ?? events.length} tone="purple" />
        <SummaryTile icon={IndianRupee} label="Revenue Collected" value={`Rs.${derived.collected}`} tone="emerald" />
        <SummaryTile icon={Clock} label="Outstanding Dues" value={`Rs.${derived.dues}`} tone="rose" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <MiniStat icon={Ticket} label="Registrations" value={stats?.totalRegistrations ?? 0} />
        <MiniStat
          icon={ClipboardCheck}
          label="Pending Applications"
          value={stats?.pendingApplications ?? 0}
        />
        <MiniStat icon={CheckCircle2} label="Paid Students" value={derived.paidStudents} />
        <MiniStat icon={ShieldCheck} label="Pending Accounts" value={derived.pending.length} />
        <MiniStat icon={Bell} label="Unread Alerts" value={unread.length} />
      </div>

      {/* Chart + recent events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <div>
            <h2 className="text-base font-extrabold font-display text-slate-900 dark:text-white">
              Registrations This Year
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly enrolment volume</p>
          </div>

          {chartData.some((d) => d.registrations > 0) ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      fontSize: 12,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#6366f1' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              No registrations recorded yet.
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-extrabold font-display text-slate-900 dark:text-white">Latest Events</h2>
            <Link
              to="/admin/events"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {recentEvents.length === 0 && (
              <li className="px-6 py-10 text-center text-xs text-slate-400">No events yet.</li>
            )}
            {recentEvents.map((evt) => (
              <li key={evt.id} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <img src={evt.banner} alt={evt.title} className="w-10 h-10 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{evt.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {evt.formattedDate} &middot; {evt.registeredCount} enrolled
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  {evt.priceAmount > 0 ? `Rs.${evt.priceAmount}` : 'Free'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Applications awaiting review */}
      {latestApplications.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-extrabold font-display text-slate-900 dark:text-white">
                Applications Awaiting Review
              </h2>
            </div>
            <Link
              to="/admin/events"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Review all
            </Link>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {latestApplications.map((app) => (
              <li
                key={app.registrationId}
                className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {app.studentName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {app.eventTitle} &middot; {app.registrationId}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  {app.amountPaid > 0 ? `Rs.${app.amountPaid}` : 'Free'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const TONES = {
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
  purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
};

const SummaryTile = ({ icon: Icon, label, value, tone }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-5 flex items-center gap-4">
    <div className={`p-3 rounded-2xl shrink-0 ${TONES[tone]}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-extrabold font-display text-slate-900 dark:text-white leading-tight truncate">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 truncate">{label}</p>
    </div>
  </div>
);

const MiniStat = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-4 flex items-center gap-2.5">
    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
    <div className="min-w-0">
      <p className="text-sm font-extrabold font-display text-slate-900 dark:text-white leading-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 truncate">{label}</p>
    </div>
  </div>
);
