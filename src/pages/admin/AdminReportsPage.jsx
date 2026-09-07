import React from 'react';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Calendar,
  Users,
  Trophy,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { mockAnalytics } from '../../data/mockAnalytics';
import { downloadCsv } from '../../utils/exportCsv';
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
  Cell,
  Legend
} from 'recharts';

export const AdminReportsPage = () => {
  const { events, registrations } = useEvents();
  const { showToast } = useToast();

  const handleExportFullReport = () => {
    const reportData = events.map((e) => ({
      'Event ID': e.id,
      'Title': e.title,
      'Category': e.categoryLabel,
      'Date': e.date,
      'Venue': e.venue,
      'Format': e.type,
      'Registrations': e.registeredCount,
      'Max Capacity': e.maxParticipants,
      'Seats Left': e.seatsLeft,
      'Status': e.status,
      'Approval': e.approvalStatus || 'Approved',
      'Organizer': e.organizer?.name,
      'Department': e.department,
    }));
    downloadCsv(reportData, `University-Event-Analytics-Report-2026.csv`);
    showToast('Comprehensive University Analytics Report downloaded as CSV!', 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Campus Analytics & Executive Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Key performance indicators, participation growth metrics, and audit datasets.
          </p>
        </div>

        <button
          onClick={handleExportFullReport}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Full Analytics CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Events Hosted"
          value="124"
          icon={Calendar}
          color="indigo"
          trend={18}
          trendLabel="YoY Growth"
        />
        <StatsCard
          title="Total Student Footfall"
          value="4,890"
          icon={Users}
          color="purple"
          trend={26}
          trendLabel="registrations"
        />
        <StatsCard
          title="Campus Attendance Rate"
          value="89.6%"
          icon={CheckCircle2}
          color="emerald"
          subtitle="Check-in conversion"
        />
        <StatsCard
          title="Top Category"
          value="Technical (38%)"
          icon={Trophy}
          color="amber"
          subtitle="Highest student interest"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Monthly Registrations and Attendance (8-Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Semester Registration & Turnout Growth
          </h3>
          <div className="h-64 sm:h-72 w-full pt-2">
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  name="Total Registrations"
                  stroke="#4F46E5"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="attendees"
                  name="Verified Attendees"
                  stroke="#10B981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share (4-Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4 flex flex-col justify-between">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
            Participation by Category
          </h3>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalytics.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockAnalytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '1rem',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            {mockAnalytics.categoryDistribution.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top 5 Most Popular Events Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
          🏆 Top 5 Highest Footfall Events on Campus
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Event Title</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Registrations</th>
                <th className="px-6 py-3">Capacity Fill Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {events.slice(0, 5).map((evt, idx) => (
                <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                    #{idx + 1}
                  </td>
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-white">
                    {evt.title}
                  </td>
                  <td className="px-6 py-3">
                    {evt.categoryLabel}
                  </td>
                  <td className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {evt.registeredCount} Students
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.round((evt.registeredCount / evt.maxParticipants) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
