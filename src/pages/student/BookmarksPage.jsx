import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { Bookmark, BookmarkX, Sparkles } from 'lucide-react';
import { EventGrid } from '../../components/events/EventGrid';
import { RegistrationModal } from '../../components/common/RegistrationModal';

export const BookmarksPage = () => {
  const { events, bookmarks, registerForEvent } = useEvents();
  const { currentUser } = useAuth();

  const [selectedReg, setSelectedReg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter events by bookmarked IDs
  const bookmarkedEvents = events.filter((e) => bookmarks.includes(e.id));

  const handleRegisterClick = (event) => {
    const reg = registerForEvent(event.id, currentUser);
    if (reg) {
      setSelectedReg(reg);
      setModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Saved Events & Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Keep track of campus competitions, festivals, and workshops you want to join.
          </p>
        </div>

        <Link
          to="/events"
          className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          Explore More Events
        </Link>
      </div>

      {/* Grid */}
      <EventGrid
        events={bookmarkedEvents}
        onRegisterClick={handleRegisterClick}
        emptyTitle="No saved events yet"
        emptyDescription="Click the bookmark heart icon on any event card across CampusConnect to save it here for quick access."
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
