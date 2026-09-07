import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import {
  Calendar,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  QrCode,
  Bell,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { RegistrationModal } from '../../components/common/RegistrationModal';
import { StatusBadge } from '../../components/common/StatusBadge';

export const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { events, registrations, bookmarks, notifications } = useEvents();
  const navigate = useNavigate();

  const [selectedReg, setSelectedReg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Active student registrations
  const activeRegistrations = registrations.filter((r) => r.status !== 'Cancelled');
  const attendedCount = registrations.filter((r) => r.attendance === 'Present').length;

  // Next upcoming registration spotlight
  const nextRegistration = activeRegistrations[0];

  // Recommended events for student (not yet registered)
  const registeredEventIds = new Set(activeRegistrations.map((r) => r.eventId));
  const recommendedEvents = events
    .filter((e) => !registeredEventIds.has(e.id))
    .slice(0, 3);

  // Mock activity stream
  const activities = [
    { title: 'Registered for InnovateX Hackathon', time: 'Today, 10:30 AM', icon: CheckCircle2, color: 'text-emerald-500' },
    { title: 'Saved Tarang Cultural Fest to Bookmarks', time: 'Yesterday, 04:15 PM', icon: Bookmark, color: 'text-purple-500' },
    { title: 'Attendance Confirmed for AI Workshop', time: '3 days ago', icon: Award, color: 'text-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Portal • {currentUser?.department || 'Engineering'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight">
            Welcome back, {currentUser?.name || 'Debjit'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            You have <span className="font-bold underline">{activeRegistrations.length} active event registrations</span> this month. Keep your passes handy for fast check-in!
          </p>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <Link
            to="/events"
            className="px-5 py-2.5 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Discover Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/student/registrations"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 backdrop-blur-md transition-all text-center"
          >
            View E-Passes
          </Link>
        </div>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Registered Events"
          value={activeRegistrations.length}
          icon={Calendar}
          color="indigo"
          subtitle="Active passes"
        />
        <StatsCard
          title="Upcoming Schedule"
          value={activeRegistrations.length > 0 ? 'Next in 4d' : 'None'}
          icon={Clock}
          color="purple"
          subtitle="Event pipeline"
        />
        <StatsCard
          title="Attended Events"
          value={attendedCount}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Verified attendance"
        />
        <StatsCard
          title="Saved Events"
          value={bookmarks.length}
          icon={Bookmark}
          color="amber"
          subtitle="In your wishlist"
        />
      </div>

      {/* 3. Next Upcoming Registration Spotlight */}
      {nextRegistration && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Next Upcoming Event
              </span>
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                {nextRegistration.eventTitle}
              </h2>
            </div>
            <StatusBadge status={nextRegistration.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Date & Time</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {nextRegistration.eventDate} • {nextRegistration.eventTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <MapPin className="w-5 h-5 text-purple-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Venue</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {nextRegistration.venue}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
              <QrCode className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Ticket Pass ID</p>
                <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {nextRegistration.registrationId}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedReg(nextRegistration);
                setModalOpen(true);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Show Digital QR Pass</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Grid: Recommended For You & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recommended Events (8-Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Recommended For You
            </h2>
            <Link
              to="/events"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Browse all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-32">
                  <img
                    src={evt.banner}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                    {evt.categoryLabel}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {evt.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      {evt.formattedDate}
                    </p>
                  </div>

                  <Link
                    to={`/events/${evt.id}`}
                    className="w-full py-1.5 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl hover:bg-indigo-100 transition-colors block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Quick Notifications (4-Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
            <h3 className="text-sm font-bold font-display text-slate-900 dark:text-white">
              Recent Activity
            </h3>

            <div className="space-y-3">
              {activities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${act.color}`} />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {act.title}
                      </p>
                      <p className="text-[10px] text-slate-400">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notification Widget */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                Latest Alerts
              </span>
              <Link
                to="/student/notifications"
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </Link>
            </div>

            {notifications.slice(0, 2).map((n) => (
              <div key={n.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl text-xs space-y-0.5 border border-indigo-100 dark:border-indigo-900/40">
                <p className="font-bold text-slate-900 dark:text-white truncate">{n.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{n.message}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Digital QR Pass Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        registration={selectedReg}
      />

    </div>
  );
};
