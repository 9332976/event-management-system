import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { EventFilterPanel } from '../../components/events/EventFilterPanel';
import { EventGrid } from '../../components/events/EventGrid';
import { RegistrationModal } from '../../components/common/RegistrationModal';
import { Sparkles, Calendar } from 'lucide-react';

export const EventsPage = () => {
  const { events, registerForEvent } = useEvents();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State initialized with query params if present
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    date: searchParams.get('date') || 'all',
    type: searchParams.get('type') || 'all',
    availability: searchParams.get('availability') || 'all',
  });

  const [loading, setLoading] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== filters.category) {
      setFilters((prev) => ({ ...prev, category: cat }));
    }
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      // Update URL search params
      if (key === 'category') {
        if (value === 'all') searchParams.delete('category');
        else searchParams.set('category', value);
        setSearchParams(searchParams);
      }
      return updated;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      date: 'all',
      type: 'all',
      availability: 'all',
    });
    setSearchParams({});
  };

  // Filtered Events Calculation
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search filter (title, description, tags, venue, organizer)
      if (filters.search.trim() !== '') {
        const query = filters.search.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDesc = event.description.toLowerCase().includes(query);
        const matchesVenue = event.venue.toLowerCase().includes(query);
        const matchesOrg = event.organizer?.name?.toLowerCase().includes(query) || event.organizer?.club?.toLowerCase().includes(query);
        const matchesTags = event.tags?.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesOrg && !matchesTags) {
          return false;
        }
      }

      // 2. Category filter
      if (filters.category !== 'all' && event.category !== filters.category) {
        return false;
      }

      // 3. Type / Mode filter
      if (filters.type !== 'all' && event.type !== filters.type) {
        return false;
      }

      // 4. Availability filter
      if (filters.availability !== 'all') {
        if (filters.availability === 'Available' && event.status !== 'Available') return false;
        if (filters.availability === 'Almost Full' && event.status !== 'Almost Full') return false;
        if (filters.availability === 'Registration Closed' && event.status !== 'Registration Closed' && event.seatsLeft > 0) return false;
      }

      // 5. Date filter (Mock logic based on event date string)
      if (filters.date !== 'all') {
        const evtDate = new Date(event.date);
        const now = new Date();

        if (filters.date === 'today') {
          // Compare day, month, year
          if (evtDate.toDateString() !== now.toDateString()) return false;
        } else if (filters.date === 'this-month') {
          if (evtDate.getMonth() !== now.getMonth() && evtDate.getMonth() !== 8) { // 8 is Sep in 0-indexed
            // Keep matching
          }
        }
      }

      return true;
    });
  }, [events, filters]);

  const handleRegisterClick = (event) => {
    const reg = registerForEvent(event.id, currentUser);
    if (reg) {
      setSelectedReg(reg);
      setModalOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner */}
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

      {/* Filter Panel Component */}
      <EventFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={filteredEvents.length}
      />

      {/* Events Grid */}
      <EventGrid
        events={filteredEvents}
        loading={loading}
        onRegisterClick={handleRegisterClick}
        onResetFilters={handleResetFilters}
      />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        registration={selectedReg}
      />

    </div>
  );
};
