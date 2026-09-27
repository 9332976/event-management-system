import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { EventFilterPanel } from '../../components/events/EventFilterPanel';
import { EventGrid } from '../../components/events/EventGrid';
import { RegistrationModal } from '../../components/common/RegistrationModal';
import { Calendar } from 'lucide-react';

const DEFAULTS = {
  search: '',
  category: 'all',
  date: 'all',
  type: 'all',
  availability: 'all',
};

export const EventsPage = () => {
  const { events, registerForEvent, loading } = useEvents();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || DEFAULTS.search,
    category: searchParams.get('category') || DEFAULTS.category,
    date: searchParams.get('date') || DEFAULTS.date,
    type: searchParams.get('type') || DEFAULTS.type,
    availability: searchParams.get('availability') || DEFAULTS.availability,
  }));

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep filters in sync when the URL changes externally (navbar, home page links)
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || DEFAULTS.search,
      category: searchParams.get('category') || DEFAULTS.category,
      date: searchParams.get('date') || DEFAULTS.date,
      type: searchParams.get('type') || DEFAULTS.type,
      availability: searchParams.get('availability') || DEFAULTS.availability,
    });
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    const next = {};
    Object.entries(updated).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== DEFAULTS[k]) next[k] = v;
    });
    setSearchParams(next, { replace: true });
  };

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULTS);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(startOfToday.getTime() + 86400000);
    const endOfWeek = new Date(startOfToday.getTime() + 7 * 86400000);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return events.filter((event) => {
      // 1. Search: title, description, venue, department, tags
      if (filters.search.trim()) {
        const q = filters.search.trim().toLowerCase();
        const haystack = [
          event.title,
          event.description,
          event.venue,
          event.department,
          event.category,
          ...(event.tags || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // 2. Category
      if (filters.category !== 'all' && event.category !== filters.category) return false;

      // 3. Mode
      if (filters.type !== 'all' && event.type !== filters.type) return false;

      // 4. Seat availability
      if (filters.availability !== 'all') {
        if (filters.availability === 'Available' && event.status !== 'Available') return false;
        if (filters.availability === 'Almost Full' && event.status !== 'Almost Full') return false;
        if (filters.availability === 'Registration Closed' && event.seatsLeft > 0) return false;
      }

      // 5. Date window
      if (filters.date !== 'all') {
        const evtDate = new Date(event.date);
        if (Number.isNaN(evtDate.getTime())) return true;
        if (filters.date === 'today' && (evtDate < startOfToday || evtDate >= endOfToday)) return false;
        if (filters.date === 'this-week' && (evtDate < startOfToday || evtDate >= endOfWeek)) return false;
        if (filters.date === 'this-month' && (evtDate < startOfToday || evtDate >= endOfMonth)) return false;
        if (filters.date === 'upcoming' && evtDate < startOfToday) return false;
      }

      return true;
    });
  }, [events, filters]);

  // Opening the modal collects preferences first; nothing is posted yet.
  const handleRegisterClick = (event) => {
    if (!currentUser) {
      navigate('/login?redirect=/events');
      return;
    }
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleSubmitApplication = async (formData) => {
    if (!selectedEvent) return null;
    setIsSubmitting(true);
    try {
      return await registerForEvent(selectedEvent.id, currentUser, formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Campus Calendar 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
          Discover Campus Events
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Find workshops, competitions, festivals, hackathons, seminars and club activities.
        </p>
      </div>

      <EventFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredEvents.length}
      />

      <EventGrid
        events={filteredEvents}
        loading={loading}
        onRegisterClick={handleRegisterClick}
        onResetFilters={handleResetFilters}
      />

      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitApplication={handleSubmitApplication}
        eventPrice={selectedEvent?.price}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
