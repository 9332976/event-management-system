import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Star,
  Zap
} from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { EventCard } from '../../components/events/EventCard';
import { RegistrationModal } from '../../components/common/RegistrationModal';
import { getCategoryIcon } from '../../utils/formatters';

const rotatingWords = [
  { word: "Events.", gradient: "from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400" },
  { word: "Style.", gradient: "from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400" },
  { word: "Passions.", gradient: "from-amber-500 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400" },
  { word: "Network.", gradient: "from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400" },
  { word: "Future.", gradient: "from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400" },
  { word: "Stories.", gradient: "from-rose-500 via-pink-600 to-violet-600 dark:from-rose-400 dark:via-pink-400 dark:to-violet-400" },
  { word: "Vibe.", gradient: "from-fuchsia-600 via-purple-600 to-pink-600 dark:from-fuchsia-400 dark:via-purple-400 dark:to-pink-400" },
];

export const HomePage = () => {
  const { events, categories, registerForEvent } = useEvents();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedReg, setSelectedReg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Featured events (6 cards)
  const featuredEvents = events.filter((e) => e.isFeatured).slice(0, 6);
  // Upcoming events
  const upcomingEvents = events.slice(0, 4);

  const handleRegisterClick = async (event) => {
    const reg = await registerForEvent(event.id, currentUser);
    if (reg) {
      setSelectedReg(reg);
      setModalOpen(true);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 bg-grid-pattern">
        
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-r from-indigo-500/10 via-purple-500/15 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span>The Premier Campus Event Ecosystem</span>
              </div>

              {/* Heading with Dynamic Animated Rotating Words */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Your Campus. <br className="hidden sm:inline" />
                <span className="inline-flex items-center justify-center lg:justify-start flex-wrap gap-x-3">
                  <span>Your</span>
                  <span className="relative inline-flex overflow-hidden h-[1.22em] min-w-[190px] sm:min-w-[240px] lg:min-w-[280px] items-center justify-center lg:justify-start">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={rotatingWords[wordIndex].word}
                        initial={{ y: 40, opacity: 0, filter: 'blur(4px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: -40, opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className={`inline-block bg-clip-text text-transparent bg-gradient-to-r ${rotatingWords[wordIndex].gradient}`}
                      >
                        {rotatingWords[wordIndex].word}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
                <br />
                Your Community.
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover exciting college events, register instantly, generate digital QR passes, and stay connected with everything happening across 35+ campus clubs.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/events"
                  className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore Events</span>
                </Link>

                {currentUser?.role === 'admin' ? (
                  <Link
                    to="/admin/create-event"
                    className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>Create an Event</span>
                  </Link>
                ) : (
                  <Link
                    to="/calendar"
                    className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-soft hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>View Calendar</span>
                  </Link>
                )}
              </div>

              {/* Micro proof points */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Registration Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant QR Check-ins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified Club Badges</span>
                </div>
              </div>

            </motion.div>

            {/* Right Visual Composition with Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Hero Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                    alt="Campus event community"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Featured Event Today
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Live On Stage
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      InnovateX National Hackathon 2026
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Main Computing Lab • 218 Participants Joined
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1: 120+ Events */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-5 -left-4 sm:-left-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">120+ Events</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Hosted this semester</p>
                  </div>
                </motion.div>

                {/* Floating Badge 2: 2,500+ Students */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">2,500+ Students</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Active participants</p>
                  </div>
                </motion.div>

                {/* Floating Badge 3: 50+ Organizers */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                  className="absolute top-1/2 -right-4 sm:-right-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-2 px-3.5 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-800 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    50+ Organizers
                  </span>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-indigo-600/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-indigo-500/40">
            
            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl sm:text-4xl font-extrabold font-display">120+</h3>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1">Campus Events</p>
            </div>

            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl sm:text-4xl font-extrabold font-display">2,500+</h3>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1">Registered Students</p>
            </div>

            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl sm:text-4xl font-extrabold font-display">50+</h3>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1">Faculty & Organizers</p>
            </div>

            <div className="pt-4 md:pt-0">
              <h3 className="text-3xl sm:text-4xl font-extrabold font-display">35+</h3>
              <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1">Collegiate Clubs</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED EVENTS (6 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
              Featured Events
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top competitions, festivals, and workshops happening on campus this month.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            <span>View All 16+ Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onRegisterClick={handleRegisterClick}
            />
          ))}
        </div>
      </section>

      {/* 4. EVENT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Explore By Interest
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
            Event Categories
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Find the perfect events matching your passion, major, or extracurricular goals.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/events?category=${cat.slug}`)}
              className="group p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700/60 transition-all text-left flex flex-col justify-between h-44 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md`}>
                  {getCategoryIcon(cat.slug, "w-6 h-6")}
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.count} Events
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
              How CampusConnect Works
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              No paper forms, no waiting in lines. Participate in campus activities seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft relative overflow-hidden group hover:border-indigo-400 transition-all">
              <span className="text-6xl font-extrabold font-display text-slate-100 dark:text-slate-800/80 absolute top-4 right-4 pointer-events-none group-hover:text-indigo-50 dark:group-hover:text-indigo-950/30 transition-colors">
                01
              </span>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-5 shadow-sm">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                01 – Discover
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Browse through categorized feeds of hackathons, cultural festivals, sports tournaments, and workshops happening across campus.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft relative overflow-hidden group hover:border-indigo-400 transition-all">
              <span className="text-6xl font-extrabold font-display text-slate-100 dark:text-slate-800/80 absolute top-4 right-4 pointer-events-none group-hover:text-purple-50 dark:group-hover:text-purple-950/30 transition-colors">
                02
              </span>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-5 shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                02 – Register
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Reserve your spot in 1-click. Instantly receive your verified digital ticket pass complete with your unique QR code and seat confirmation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft relative overflow-hidden group hover:border-indigo-400 transition-all">
              <span className="text-6xl font-extrabold font-display text-slate-100 dark:text-slate-800/80 absolute top-4 right-4 pointer-events-none group-hover:text-emerald-50 dark:group-hover:text-emerald-950/30 transition-colors">
                03
              </span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-5 shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                03 – Participate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Show your pass at the venue entrance for automated check-in, join the activities, win prizes, and earn verified participation credentials.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Mark Your Calendar
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white mt-1">
              Upcoming Events
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>See Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {upcomingEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="relative h-40">
                <img
                  src={evt.banner}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md">
                  {evt.categoryLabel}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    {evt.formattedDate}
                  </p>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                    {evt.venue}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {evt.seatsLeft} seats left
                  </span>
                  <Link
                    to={`/events/${evt.id}`}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* 8. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              Ready to create unforgettable campus experiences?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of students across campus. Discover workshops, competitions, festivals, and seminars, and collect every ticket in one dashboard.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/events"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Browse All Events
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none hidden md:block" />
        </div>
      </section>

      {/* Registration Confirmation Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        registration={selectedReg}
      />

    </div>
  );
};
