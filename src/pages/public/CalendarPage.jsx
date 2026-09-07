import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Users,
  Filter,
  ArrowRight,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { getCategoryBadgeStyle } from '../../utils/formatters';
import { RegistrationModal } from '../../components/common/RegistrationModal';
import { useAuth } from '../../context/AuthContext';

export const CalendarPage = () => {
  const { events, registerForEvent } = useEvents();
  const { currentUser } = useAuth();

  const [selectedMonth, setSelectedMonth] = useState(8); // September (0-indexed: 8)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  // Filter events for calendar
  const filteredEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    const matchesMonth = eventDate.getMonth() === selectedMonth && eventDate.getFullYear() === selectedYear;
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesMonth && matchesCategory;
  });

  // Calculate days in month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 is Sun

  const daysArray = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Get events on a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    return filteredEvents.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === day;
    });
  };

  const handleRegisterClick = (event) => {
    const reg = registerForEvent(event.id, currentUser);
    if (reg) {
      setSelectedReg(reg);
      setModalOpen(true);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Master Schedule</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
            Campus Event Calendar
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse upcoming conferences, hackathons, concerts, and workshops with venue schedules & overlap tracking.
          </p>
        </div>

        {/* Controls: Month Switcher & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Event Categories</option>
            <option value="hackathon">Hackathons</option>
            <option value="technical">Technical & Coding</option>
            <option value="cultural">Cultural & Concerts</option>
            <option value="workshop">Workshops & Bootcamps</option>
            <option value="seminar">Seminars & Keynotes</option>
            <option value="sports">Sports & Tournaments</option>
          </select>

          {/* Month Switcher */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 text-xs font-bold text-slate-900 dark:text-white min-w-[130px] text-center">
              {months[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Grid View: 7 Columns (Sun - Sat) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 text-center py-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
            <div key={day} className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
          {daysArray.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isToday = day === 15 && selectedMonth === 8 && selectedYear === 2026;
            const hasOverlappingVenues = dayEvents.length > 1;

            return (
              <div
                key={index}
                className={`min-h-[120px] sm:min-h-[140px] p-2 sm:p-2.5 transition-colors ${
                  !day ? 'bg-slate-50/40 dark:bg-slate-950/20' : 'hover:bg-indigo-50/20 dark:hover:bg-slate-800/30'
                }`}
              >
                {day && (
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold rounded-lg w-6 h-6 flex items-center justify-center ${
                          isToday
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {day}
                      </span>
                      {hasOverlappingVenues && (
                        <span
                          title="Multiple events scheduled on this day"
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1"
                        >
                          <Layers className="w-2.5 h-2.5" />
                          <span>{dayEvents.length} Events</span>
                        </span>
                      )}
                    </div>

                    {/* Events inside this day */}
                    <div className="space-y-1 mt-1.5 flex-1">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <Link
                          key={ev.id}
                          to={`/events/${ev.id}`}
                          className="group block p-1.5 rounded-lg bg-indigo-50/80 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-950 border border-indigo-100 dark:border-slate-700 text-left transition-all"
                        >
                          <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {ev.title}
                          </p>
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5 shrink-0" />
                            <span>{ev.time}</span>
                          </p>
                        </Link>
                      ))}

                      {dayEvents.length > 2 && (
                        <button
                          onClick={() => setSelectedDayEvents({ day, events: dayEvents })}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline block text-left pt-0.5"
                        >
                          +{dayEvents.length - 2} more events
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Scheduled Events Cards below Calendar */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Scheduled Events in {months[selectedMonth]} {selectedYear} ({filteredEvents.length})</span>
          </h2>
          <Link to="/events" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            View List Format →
          </Link>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            No events scheduled for the selected month or filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getCategoryBadgeStyle(ev.category)}`}>
                      {ev.categoryLabel || ev.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {ev.price}
                    </span>
                  </div>

                  <Link to={`/events/${ev.id}`}>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors line-clamp-1">
                      {ev.title}
                    </h3>
                  </Link>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{ev.formattedDate || ev.date} • {ev.time}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate">{ev.venue}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                      <span>{ev.registeredCount} / {ev.maxParticipants} Registered</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <Link
                    to={`/events/${ev.id}`}
                    className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRegisterClick(ev)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    Instant E-Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Confirmation Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        registration={selectedReg}
      />
    </div>
  );
};
