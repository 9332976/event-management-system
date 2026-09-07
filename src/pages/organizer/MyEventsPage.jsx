import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import {
  Calendar,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  CheckSquare,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { getCategoryBadgeStyle } from '../../utils/formatters';

export const MyEventsPage = () => {
  const { events, deleteEvent } = useEvents();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.categoryLabel.toLowerCase().includes(search.toLowerCase()) ||
    e.venue.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeletePrompt = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Manage Campus Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            View, edit, track registrations, and manage live attendance rosters.
          </p>
        </div>

        <Link
          to="/organizer/create-event"
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter organized events..."
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Events Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date & Venue</th>
                <th className="px-6 py-4">Occupancy</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEvents.map((evt) => {
                const percent = Math.min(
                  100,
                  Math.round((evt.registeredCount / (evt.maxParticipants || 100)) * 100)
                );
                return (
                  <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    
                    {/* Title & Banner */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.banner}
                          alt={evt.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {evt.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            ID: {evt.id} • {evt.type}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold border text-[10px] ${getCategoryBadgeStyle(evt.category)}`}>
                        {evt.categoryLabel}
                      </span>
                    </td>

                    {/* Date & Venue */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{evt.formattedDate}</p>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{evt.venue}</p>
                    </td>

                    {/* Capacity / Progress */}
                    <td className="px-6 py-4">
                      <div className="w-32 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-900 dark:text-white">{evt.registeredCount}</span>
                          <span className="text-slate-400">/ {evt.maxParticipants}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              percent > 90 ? 'bg-rose-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={evt.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/events/${evt.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/organizer/edit-event/${evt.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <Link
                          to="/organizer/attendance"
                          className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Live Attendance"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDeletePrompt(evt)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Campus Event?"
        message={`Are you sure you want to permanently delete "${eventToDelete?.title}"? All participant bookings and notifications for this event will be removed.`}
        confirmText="Yes, Delete Event"
        cancelText="Cancel"
        type="danger"
      />

    </div>
  );
};
