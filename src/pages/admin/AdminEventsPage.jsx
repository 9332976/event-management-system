import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Sparkles,
  IndianRupee,
  Users,
  Ticket,
  Clock,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { getCategoryBadgeStyle } from '../../utils/formatters';

const STATUS_FILTERS = ['all', 'Available', 'Almost Full', 'Sold Out', 'Registration Closed'];

export const AdminEventsPage = () => {
  const { events, registrations, deleteEvent, updateEvent, setRegistrationPayment, reviewRegistration } =
    useEvents();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [appFilter, setAppFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [busyReg, setBusyReg] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const categorySlugs = useMemo(
    () => [...new Set(events.map((e) => e.category).filter(Boolean))],
    [events]
  );

  const registrationsByEvent = useMemo(() => {
    const map = new Map();
    registrations
      .filter((r) => r.status !== 'Cancelled')
      .forEach((r) => {
        const key = r.eventId;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(r);
      });
    return map;
  }, [registrations]);

  // Pending applications need an event-level queue, so keep them visible regardless of appFilter.
  const pendingTotal = useMemo(
    () => registrations.filter((r) => r.status === 'Pending').length,
    [registrations]
  );

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e) => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (appFilter !== 'all') {
        const regs = registrationsByEvent.get(e.id) || [];
        const has = (s) => regs.some((r) => r.status === s);
        if (appFilter === 'Pending' && !has('Pending')) return false;
        if (appFilter === 'Approved' && !has('Approved')) return false;
        if (appFilter === 'Rejected' && !has('Rejected')) return false;
      }
      if (q) {
        const haystack = [e.title, e.categoryLabel, e.venue, e.department]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [events, search, statusFilter, categoryFilter, appFilter, registrationsByEvent]);

  const totals = useMemo(
    () => ({
      events: events.length,
      registrations: registrations.filter((r) => r.status !== 'Cancelled').length,
      approved: registrations.filter((r) => r.status === 'Approved').length,
      pending: pendingTotal,
      collected: registrations
        .filter((r) => r.status === 'Approved' && r.paymentStatus === 'paid')
        .reduce((sum, r) => sum + (r.amountPaid || 0), 0),
    }),
    [events, registrations, pendingTotal]
  );

  const handleToggleFeatured = (evt) => {
    const isNow = !evt.isFeatured;
    updateEvent(evt.id, { isFeatured: isNow });
    showToast(
      `Event "${evt.title}" ${isNow ? 'is now featured on the home page.' : 'was removed from featured.'}`,
      'info'
    );
  };

  const handleDeletePrompt = (evt) => {
    setEventToDelete(evt);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    const result = await deleteEvent(eventToDelete.id);
    if (result) {
      showToast(`Event "${eventToDelete.title}" was deleted.`, 'info');
    }
    setEventToDelete(null);
    setDeleteModalOpen(false);
  };

  const togglePayment = async (reg) => {
    setBusyReg(reg.registrationId);
    await setRegistrationPayment(
      reg.registrationId,
      reg.paymentStatus === 'paid' ? 'unpaid' : 'paid',
      reg.paymentStatus === 'paid' ? {} : { amountPaid: reg.amountPaid || 0, paymentMethod: 'Cash' }
    );
    setBusyReg(null);
  };

  const approveAndMarkPaid = async (reg) => {
    setBusyReg(reg.registrationId);
    await reviewRegistration(reg.registrationId, 'approve', '', {
      paymentStatus: 'paid',
      amountPaid: reg.amountPaid || 0,
      paymentMethod: reg.paymentMethod || 'Cash',
    });
    setBusyReg(null);
  };

  const confirmReject = async () => {
    if (!rejecting) return;
    setBusyReg(rejecting.registrationId);
    await reviewRegistration(rejecting.registrationId, 'reject', rejectReason.trim());
    setBusyReg(null);
    setRejecting(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Create, edit and manage every event on the public site.
          </p>
        </div>

        <Link
          to="/admin/events/new"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryTile icon={Sparkles} label="Total Events" value={totals.events} tone="indigo" />
        <SummaryTile icon={Clock} label="Awaiting Approval" value={totals.pending} tone="amber" />
        <SummaryTile icon={Ticket} label="Approved" value={totals.approved} tone="sky" />
        <SummaryTile icon={IndianRupee} label="Collected" value={`Rs.${totals.collected}`} tone="emerald" />
      </div>

      {/* Pending applications alert */}
      {totals.pending > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {totals.pending} {totals.pending === 1 ? 'application is' : 'applications are'} waiting for review
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Expand an event below to approve and mark paid, or reject with a reason. Seats stay
                held until you decide.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAppFilter('Pending')}
            className="self-start sm:self-auto shrink-0 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Show pending only
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event name, category, venue..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === s
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          >
            <option value="all">All categories</option>
            {categorySlugs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          >
            <option value="all">Any application status</option>
            <option value="Pending">Has pending applications</option>
            <option value="Approved">Has approved registrations</option>
            <option value="Rejected">Has rejected applications</option>
          </select>
        </div>
      </div>

      {/* Events table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Seats</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No events match these filters.
                  </td>
                </tr>
              )}

              {filteredEvents.map((evt) => {
                const regs = registrationsByEvent.get(evt.id) || [];
                const paidCount = regs.filter((r) => r.paymentStatus === 'paid').length;
                const collected = regs
                  .filter((r) => r.paymentStatus === 'paid')
                  .reduce((s, r) => s + (r.amountPaid || 0), 0);
                const isExpanded = expandedId === evt.id;

                return (
                  <React.Fragment key={evt.id}>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.banner}
                            alt={evt.title}
                            className="w-12 h-12 rounded-xl object-cover ring-1 ring-indigo-500/20"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">{evt.title}</p>
                            <span
                              className={`inline-block mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeStyle(evt.category)}`}
                            >
                              {evt.categoryLabel}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{evt.formattedDate}</p>
                        <p className="text-[10px] text-slate-400">{evt.time}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {evt.priceAmount > 0 ? `Rs.${evt.priceAmount}` : 'Free'}
                        </span>
                        {evt.priceAmount > 0 && collected > 0 && (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            {paidCount}/{regs.length} paid
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {evt.registeredCount}/{evt.maxParticipants}
                          </span>
                        </div>
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : evt.id)}
                          className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
                        >
                          {isExpanded ? 'Hide' : 'View'} registrations ({regs.length})
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={evt.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleFeatured(evt)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              evt.isFeatured
                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                                : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title={evt.isFeatured ? 'Remove from featured' : 'Feature on home page'}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          <Link
                            to={`/events/${evt.id}`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="View public page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/events/${evt.id}/edit`}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDeletePrompt(evt)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-50/60 dark:bg-slate-800/30">
                        <td colSpan={6} className="px-6 py-4">
                          {regs.length === 0 ? (
                            <p className="text-xs text-slate-400 py-2">No students have enrolled yet.</p>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Applications &amp; enrolled students
                              </p>
                              {regs.map((r) => {
                                const isPaid = r.paymentStatus === 'paid';
                                const isPending = r.status === 'Pending';
                                const isRejected = r.status === 'Rejected';
                                return (
                                  <div
                                    key={r.registrationId}
                                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <img
                                        src={r.avatar}
                                        alt={r.studentName}
                                        className="w-8 h-8 rounded-lg object-cover"
                                      />
                                      <div className="min-w-0">
                                        <p className="font-bold text-slate-900 dark:text-white">{r.studentName}</p>
                                        <p className="text-[10px] text-slate-400">
                                          {r.studentId} &middot; {r.registrationId}
                                        </p>
                                        {isRejected && r.rejectReason && (
                                          <p className="text-[10px] text-rose-500 mt-0.5">
                                            {r.rejectReason}
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                      <StatusBadge status={r.status} />

                                      {isPending ? (
                                        <>
                                          <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                                            To review &middot; Rs.{r.amountPaid || 0}
                                          </span>
                                          <button
                                            disabled={busyReg === r.registrationId}
                                            onClick={() => approveAndMarkPaid(r)}
                                            className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50"
                                          >
                                            Approve &amp; Mark Paid
                                          </button>
                                          <button
                                            onClick={() => {
                                              setRejecting(r);
                                              setRejectReason('');
                                            }}
                                            className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                                          >
                                            Reject
                                          </button>
                                        </>
                                      ) : isRejected ? (
                                        <span className="text-[10px] font-semibold text-slate-400">
                                          Seat released &middot; student may re-apply
                                        </span>
                                      ) : (
                                        <>
                                          <span
                                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                                              isPaid
                                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                            }`}
                                          >
                                            {isPaid ? `Paid Rs.${r.amountPaid || 0}` : `Due Rs.${r.amountPaid || 0}`}
                                          </span>

                                          <button
                                            disabled={busyReg === r.registrationId}
                                            onClick={() => togglePayment(r)}
                                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 ${
                                              isPaid
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            }`}
                                          >
                                            {isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete this event?"
        message={`"${eventToDelete?.title}" will be removed from the public site and all of its registrations will be deleted. This cannot be undone.`}
        confirmText="Yes, Delete Event"
        cancelText="Cancel"
        type="danger"
      />

      {/* Reject application */}
      <Modal
        isOpen={!!rejecting}
        onClose={() => {
          setRejecting(null);
          setRejectReason('');
        }}
        title="Reject this application"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Rejecting <strong>{rejecting?.studentName}</strong> for{' '}
            <strong>{rejecting?.eventTitle}</strong> releases the seat they were holding, and they
            will be able to apply again.
          </p>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Reason for rejection
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Registrations for this event closed while your application was under review."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium resize-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              The student sees this reason on their dashboard. It is sent with the notification.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => {
                setRejecting(null);
                setRejectReason('');
              }}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              disabled={busyReg === rejecting?.registrationId}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30"
            >
              Reject Application
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const TONES = {
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
  amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  sky: 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
};

const SummaryTile = ({ icon: Icon, label, value, tone }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-4 flex items-center gap-3">
    <div className={`p-2.5 rounded-xl ${TONES[tone]}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className="text-lg font-extrabold font-display text-slate-900 dark:text-white leading-tight">{value}</p>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 truncate">{label}</p>
    </div>
  </div>
);
