import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  Users,
  Award,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  ArrowLeft,
  Sparkles,
  Tag,
  Check
} from 'lucide-react';
import { getCategoryBadgeStyle, getStatusBadgeStyle } from '../../utils/formatters';
import { EventScheduleTimeline } from '../../components/events/EventScheduleTimeline';
import { EventCard } from '../../components/events/EventCard';
import { RegistrationModal } from '../../components/common/RegistrationModal';
import { useToast } from '../../context/ToastContext';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const { events, getRegistration, registerForEvent } = useEvents();
  const { currentUser, currentRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const event = events.find((e) => e.id === id || e.slug === id);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Event Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The requested event could not be located in our campus system.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const registration = getRegistration(event.id);
  const isRegistered = !!registration;
  const isPending = isRegistered && registration.status === 'Pending';
  const isTicketReady =
    isRegistered && registration.status === 'Approved' && registration.paymentStatus === 'paid';
  const isApprovedUnpaid =
    isRegistered && registration.status === 'Approved' && registration.paymentStatus !== 'paid';
  const isClosed = event.status === 'Registration Closed' || event.seatsLeft <= 0;

  // Related 3 events from same category
  const relatedEvents = events
    .filter((e) => e.category === event.category && e.id !== event.id)
    .slice(0, 3);

  const handleOpenRegisterModal = () => {
    if (isTicketReady) {
      setSelectedReg(registration);
    } else {
      setSelectedReg(null);
    }
    setModalOpen(true);
  };

  const handleSubmitApplication = async (customPreferences) => {
    setIsSubmitting(true);
    try {
      return await registerForEvent(event.id, currentUser, customPreferences);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="pb-24 space-y-12">
      
      {/* 1. Header Banner & Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Back Link */}
        <div className="pb-4 flex items-center justify-between">
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Share event link"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Image */}
        <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800">
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          {/* Banner bottom info */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white z-10">
            <div className="space-y-2 max-w-3xl">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${getCategoryBadgeStyle(event.category)}`}>
                {event.categoryLabel}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
                {event.title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30">
                {event.type}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-500 text-white shadow-md">
                {event.price}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Main Content Grid (Left: Details, Right: Sticky Registration Card) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT 8-Cols: Overview, Rules, Schedule, Organizer */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Quick Meta Chips Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Date</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{event.formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Timing</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{event.time} - {event.endTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{event.venue}</p>
                </div>
              </div>
            </div>

            {/* About Event */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                About the Event
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {event.description}
              </p>

              {/* Tags */}
              {event.tags && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Prizes / Perks */}
            {event.prizes && (
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                    Prizes, Awards & Recognition
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300/90 mt-1 font-medium leading-relaxed">
                    {event.prizes}
                  </p>
                </div>
              </div>
            )}

            {/* Eligibility & Guidelines */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Eligibility & Rules
              </h2>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Who Can Participate
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                    {event.eligibility}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Event Guidelines
                  </h4>
                  <ul className="space-y-2">
                    {event.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Live Announcements Ticker */}
            <div className="p-4 bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-950/40 dark:to-amber-950/30 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-3">
              <span className="p-2 rounded-xl bg-rose-500 text-white shrink-0 mt-0.5 shadow-sm">
                <AlertCircle className="w-4 h-4 animate-pulse" />
              </span>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider text-[10px]">
                  Live Broadcast Alert
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Mentorship Round 1 & Tech Reviews will be held in Computing Lab 4 & Seminar Hall 1.
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Updated 15 minutes ago by Prof. Ananya Sharma (Event Lead)
                </p>
              </div>
            </div>

            {/* Event Timeline / Multi-Track Schedule */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Event Schedule & Agenda
                </h2>
                <span className="text-xs font-semibold text-slate-400">
                  {event.schedule.length} Sessions Planned
                </span>
              </div>

              <EventScheduleTimeline schedule={event.schedule} />
            </div>

            {/* Featured Speakers & Keynote Leaders */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Featured Speakers & Mentors
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Dr. Sundar Pichai"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Dr. Aravind Swaminathan
                    </h4>
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      Chief AI Architect @ Google DeepMind
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Session: "Future of Agentic LLMs"
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                    alt="Prof. Sharma"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/20"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Prof. Ananya Sharma
                    </h4>
                    <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                      Convener, AI & Robotics Cell
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Session: "Hardware Prototyping Workshop"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Sponsors & Exhibitor Booths */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Event Sponsors & Exhibitors
              </h2>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <p className="text-xs text-slate-500">
                  Visit the sponsor expo arena in the Central Foyer during event breaks.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Google Cloud</span>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">Booth A1</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Microsoft Azure</span>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">Booth B1</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Red Bull</span>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">Lounge B4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Q&A & Discussion Forum */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Attendee Q&A & Discussion
                </h2>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Verified Campus Forum
                </span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                
                {/* Sample Question 1 */}
                <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Rohan Mukherjee (CSE 4th Year)</span>
                    <span className="text-[10px] text-slate-400">2 hours ago</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200">
                    Will hardware testkits and IoT Arduino boards be provided at Computing Lab 4?
                  </p>
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Official Organizer Reply</span>
                    </span>
                    <p>Yes! 40x ESP32 and Arduino kits are available at the Hardware Helpdesk. Check them out with your E-Pass.</p>
                  </div>
                </div>

                {/* Post Question Form */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question about this event..."
                    className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => showToast('Question posted to event discussion board!', 'success')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Post
                  </button>
                </div>

              </div>
            </div>

            {/* Hosted By Card */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Hosted By
              </h2>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={event.organizer?.avatar}
                    alt={event.organizer?.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {event.organizer?.name}
                    </h4>
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {event.organizer?.club}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {event.department}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 text-xs">
                  <a
                    href={`mailto:${event.organizer?.email}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{event.organizer?.email}</span>
                  </a>
                  <a
                    href={`tel:${event.organizer?.phone}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{event.organizer?.phone}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 4-Cols: Sticky Registration Box */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Registration
                  </span>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                    {event.price}
                  </h3>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${getStatusBadgeStyle(event.status)}`}>
                  {event.status}
                </span>
              </div>

              {/* Quick Info summary */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Capacity</span>
                  <span className="font-bold text-slate-900 dark:text-white">{event.maxParticipants} Seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Seats Remaining</span>
                  <span className={`font-bold ${event.seatsLeft <= 10 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {event.seatsLeft} Available
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Deadline</span>
                  <span className="font-bold text-slate-900 dark:text-white">{event.registrationDeadline}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((event.registeredCount / event.maxParticipants) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Main CTA */}
              <div className="space-y-2.5 pt-2">
                {isPending ? (
                  <>
                    <div className="w-full py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Your application is awaiting review</span>
                    </div>
                    <p className="text-[11px] text-center text-slate-400">
                      Application ID: <span className="font-mono">{registration.registrationId}</span>. A seat
                      is held until the admin approves or rejects it.
                    </p>
                  </>
                ) : isTicketReady ? (
                  <>
                    <div className="w-full py-3 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Your ticket is ready</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReg(registration);
                        setModalOpen(true);
                      }}
                      className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>View &amp; Download E-Pass</span>
                    </button>
                  </>
                ) : isApprovedUnpaid ? (
                  <div className="w-full py-3 px-4 rounded-2xl bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-bold text-xs text-center flex items-center justify-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    <span>
                      Approved &mdash; pay Rs.{registration.amountPaid || 0} at the venue desk to get
                      your pass
                    </span>
                  </div>
                ) : isClosed ? (
                  <button
                    disabled
                    className="w-full py-3.5 px-4 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-sm cursor-not-allowed"
                  >
                    Registration Closed
                  </button>
                ) : (
                  <button
                    onClick={handleOpenRegisterModal}
                    className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{event.priceAmount > 0 ? 'Apply Now' : 'Register Now'}</span>
                  </button>
                )}

                <p className="text-[11px] text-center text-slate-400 pt-1">
                  {event.priceAmount > 0
                    ? 'Applications are reviewed by the admin. Your pass is issued after approval and payment.'
                    : 'Free event - your pass is issued immediately.'}
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 3. Related Events Carousel / Grid */}
      {relatedEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Explore More
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
                You May Also Like
              </h3>
            </div>
            <Link
              to={`/events?category=${event.category}`}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              See all {event.categoryLabel} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map((rel) => (
              <EventCard
                key={rel.id}
                event={rel}
                onRegisterClick={handleOpenRegisterModal}
              />
            ))}
          </div>
        </div>
      )}

      {/* Application modal: preferences form, then the approval/ticket result */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        registration={selectedReg}
        onSubmitApplication={handleSubmitApplication}
        eventPrice={event.price}
        isSubmitting={isSubmitting}
      />

    </div>
  );
};
