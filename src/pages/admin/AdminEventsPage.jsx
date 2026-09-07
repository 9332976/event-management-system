import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Sparkles,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { getCategoryBadgeStyle } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export const AdminEventsPage = () => {
  const { events, updateEvent, deleteEvent } = useEvents();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const filteredEvents = events.filter((e) => {
    if (statusFilter !== 'all' && (e.approvalStatus || 'Approved') !== statusFilter) return false;
    if (
      search.trim() &&
      !e.title.toLowerCase().includes(search.toLowerCase()) &&
      !e.organizer?.name?.toLowerCase().includes(search.toLowerCase()) &&
      !e.categoryLabel.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleApprove = (evt) => {
    updateEvent(evt.id, { approvalStatus: 'Approved' });
    showToast(`Event "${evt.title}" has been APPROVED by Deanery!`, 'success');
  };

  const handleReject = (evt) => {
    updateEvent(evt.id, { approvalStatus: 'Rejected' });
    showToast(`Event "${evt.title}" has been marked REJECTED.`, 'error');
  };

  const handleToggleFeatured = (evt) => {
    const isNow = !evt.isFeatured;
    updateEvent(evt.id, { isFeatured: isNow });
    showToast(`Event "${evt.title}" ${isNow ? 'is now FEATURED on Homepage!' : 'removed from Featured section.'}`, 'info');
  };

  const handleDeletePrompt = (evt) => {
    setEventToDelete(evt);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
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
            Campus Events Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Deanery review for student club activities, room allocations, and featured listings.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search event by name, organizer club, category..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'Approved', 'Pending', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Events Moderation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Event Name & Details</th>
                <th className="px-6 py-4">Organizer</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Moderation Status</th>
                <th className="px-6 py-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Event Name */}
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
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {evt.venue} • {evt.registeredCount}/{evt.maxParticipants} Booked
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Organizer */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{evt.organizer?.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{evt.organizer?.club}</p>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getCategoryBadgeStyle(evt.category)}`}>
                      {evt.categoryLabel}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-slate-500">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{evt.formattedDate}</p>
                    <p className="text-[10px] text-slate-400">{evt.time}</p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={evt.approvalStatus || 'Approved'} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleFeatured(evt)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          evt.isFeatured
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                            : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                        title={evt.isFeatured ? 'Featured on Home' : 'Feature on Home'}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleApprove(evt)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors"
                        title="Approve event"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleReject(evt)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                        title="Reject event"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>

                      <Link
                        to={`/events/${evt.id}`}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="View event page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDeletePrompt(evt)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Campus Event?"
        message={`Are you sure you want to remove "${eventToDelete?.title}" from campus registry?`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />

    </div>
  );
};
