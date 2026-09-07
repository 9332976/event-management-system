import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import {
  Calendar,
  Users,
  CheckSquare,
  TrendingUp,
  PlusCircle,
  BarChart3,
  ArrowRight,
  ExternalLink,
  Sparkles
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const OrganizerDashboard = () => {
  const { currentUser } = useAuth();
  const { events, attendees } = useEvents();

  // Filter events created by or relevant to organizer
  const myEvents = events.slice(0, 5);

  const presentCount = attendees.filter(a => a.attendance === 'Present').length;
  const totalCount = attendees.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 92;

  return (
    <div className="space-y-8">
      
      {/* 1. Header with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty & Club Convener Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Welcome back, {currentUser?.name || 'Prof. Sharma'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-time registrations, launch new events, and manage live venue check-ins.
          </p>
        </div>

        <Link
          to="/organizer/create-event"
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Host New Event</span>
        </Link>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Events"
          value={events.length}
          icon={Calendar}
          color="indigo"
          trend={18}
          trendLabel="vs last semester"
        />
        <StatsCard
          title="Upcoming Events"
          value={events.filter(e => e.seatsLeft > 0).length}
          icon={Calendar}
          color="purple"
          subtitle="Open for registrations"
        />
        <StatsCard
          title="Total Participants"
          value="1,840"
          icon={Users}
          color="emerald"
          trend={24}
          trendLabel="student footfall"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={CheckSquare}
          color="amber"
          trend={5.2}
          trendLabel="check-in consistency"
        />
      </div>

      {/* 3. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Line Chart: Registrations Growth (8-Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
                Registration Trends & Footfall
              </h3>
              <p className="text-xs text-slate-400">Monthly student participation across all campus departments</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
              +38% Growth
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
                  name="Registrations"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366F1' }}
                  activeDot={{ r: 6 }}
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

        {/* Donut Chart: Events by Category (4-Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Events by Category
            </h3>
            <p className="text-xs text-slate-400">Distribution across active campus clubs</p>
          </div>

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

      {/* 4. Bar Chart: Attendance by Department */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Departmental Attendance Breakdown
            </h3>
            <p className="text-xs text-slate-400">Comparison of registered vs verified present students per branch</p>
          </div>
          <Link
            to="/organizer/attendance"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Live Attendance Manager →
          </Link>
        </div>

        <div className="h-64 sm:h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockAnalytics.departmentAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="department" stroke="#94A3B8" fontSize={12} />
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
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Bar dataKey="registered" name="Registered" fill="#818CF8" radius={[6, 6, 0, 0]} />
              <Bar dataKey="present" name="Present" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Quick Events List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">
              Recent Organized Events
            </h3>
            <p className="text-xs text-slate-400">Quick status and registration progress</p>
          </div>
          <Link
            to="/organizer/events"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Manage all events →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {myEvents.map((evt) => (
            <div key={evt.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={evt.banner}
                  alt={evt.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {evt.formattedDate} • {evt.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{evt.registeredCount}</span>
                  <span className="text-slate-400"> / {evt.maxParticipants}</span>
                </div>
                <StatusBadge status={evt.status} />
                <Link
                  to={`/organizer/edit-event/${evt.id}`}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
