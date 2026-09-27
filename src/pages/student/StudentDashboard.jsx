import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import {
  Ticket,
  CheckCircle2,
  Clock,
  IndianRupee,
  Compass,
  Calendar,
  MapPin,
  XCircle,
  Bell,
  QrCode,
} from 'lucide-react';
import { DigitalTicketPass } from '../../components/common/DigitalTicketPass';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

export const StudentDashboard = () => {
  const { registrations, events, notifications } = useEvents();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [ticket, setTicket] = useState(null);

  // A ticket is only usable once the admin approved the application AND payment is settled.
  const isTicketReady = (r) => r.status === 'Approved' && r.paymentStatus === 'paid';

  const approved = useMemo(() => registrations.filter((r) => r.status === 'Approved'), [registrations]);
  const pending = useMemo(() => registrations.filter((r) => r.status === 'Pending'), [registrations]);
  const rejected = useMemo(() => registrations.filter((r) => r.status === 'Rejected'), [registrations]);
  const cancelled = useMemo(() => registrations.filter((r) => r.status === 'Cancelled'), [registrations]);

  const tickets = useMemo(() => approved.filter(isTicketReady), [approved]);
  const unpaid = useMemo(() => approved.filter((r) => r.paymentStatus !== 'paid'), [approved]);

  const totalDue = useMemo(
    () => unpaid.reduce((sum, r) => sum + (r.amountPaid || 0), 0),
    [unpaid]
  );

  const unread = useMemo(() => notifications.filter((n) => !n.read), [notifications]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return approved
      .filter((r) => r.eventDate && new Date(r.eventDate).getTime() >= now - 86400000)
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  }, [approved]);

  const visible = useMemo(() => {
    if (activeTab === 'upcoming') return upcoming;
    if (activeTab === 'tickets') return tickets;
    if (activeTab === 'pending') return pending;
    if (activeTab === 'unpaid') return unpaid;
    if (activeTab === 'rejected') return rejected;
    if (activeTab === 'cancelled') return cancelled;
    return approved;
  }, [activeTab, upcoming, tickets, pending, unpaid, rejected, cancelled, approved]);

  const TABS = [
    { key: 'tickets', label: 'My Tickets', count: tickets.length },
    { key: 'pending', label: 'Awaiting Approval', count: pending.length },
    { key: 'unpaid', label: 'Payment Due', count: unpaid.length },
    { key: 'rejected', label: 'Not Accepted', count: rejected.length },
    { key: 'cancelled', label: 'Cancelled', count: cancelled.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            My Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, {currentUser?.name?.split(' ')[0]}. Here are all your event tickets and payments.
          </p>
        </div>

        <Link
          to="/events"
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Events</span>
        </Link>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryTile icon={Ticket} label="My Tickets" value={tickets.length} tone="indigo" />
        <SummaryTile icon={Clock} label="Awaiting Approval" value={pending.length} tone="amber" />
        <SummaryTile icon={CheckCircle2} label="Approved" value={approved.length} tone="emerald" />
        <SummaryTile icon={IndianRupee} label="Outstanding Dues" value={`Rs.${totalDue}`} tone="rose" />
      </div>

      {/* Awaiting approval notice */}
      {pending.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {pending.length} {pending.length === 1 ? 'application is' : 'applications are'} awaiting
                admin review
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Your seat is held for each pending application. The ticket is issued once the admin
                approves it and confirms the payment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pending payments alert */}
      {unpaid.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-start gap-3">
            <IndianRupee className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                You have {unpaid.length} approved {unpaid.length === 1 ? 'registration' : 'registrations'}{' '}
                awaiting payment
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Total outstanding: <strong>Rs.{totalDue}</strong>. Pay at the venue desk and the admin will mark your
                ticket as paid.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications strip */}
      {unread.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-extrabold font-display text-slate-900 dark:text-white">
              Recent Notifications
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {unread.length}
            </span>
          </div>
          <ul className="space-y-2">
            {unread.slice(0, 4).map((n) => (
              <li
                key={n.id}
                className="flex items-start gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{n.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === t.key
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Ticket grid */}
      {visible.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title={
            activeTab === 'cancelled'
              ? 'No cancelled events'
              : activeTab === 'rejected'
                ? 'Nothing was rejected'
                : activeTab === 'pending'
                  ? 'No applications awaiting review'
                  : 'No events here yet'
          }
          description="Browse the campus events and apply for one to see your ticket here."
          actionText="Explore Events"
          onAction={() => navigate('/events')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {visible.map((reg) => {
            const isPaid = reg.paymentStatus === 'paid';
            const isCancelled = reg.status === 'Cancelled';
            const isPending = reg.status === 'Pending';
            const isRejected = reg.status === 'Rejected';
            const ready = isTicketReady(reg);
            const event = events.find((e) => e.id === reg.eventId);

            const badge = isCancelled
              ? 'bg-slate-700/90 text-slate-200 border-slate-500'
              : isPending
                ? 'bg-amber-500/90 text-white border-amber-400'
                : isRejected
                  ? 'bg-rose-600/90 text-white border-rose-400'
                  : ready
                    ? 'bg-emerald-500/90 text-white border-emerald-400'
                    : 'bg-orange-500/90 text-white border-orange-400';
            const badgeText = isCancelled
              ? 'CANCELLED'
              : isPending
                ? 'AWAITING APPROVAL'
                : isRejected
                  ? 'NOT ACCEPTED'
                  : ready
                    ? 'TICKET READY'
                    : 'PAYMENT DUE';

            return (
              <div
                key={reg.registrationId}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col"
              >
                {/* Banner */}
                <div className="relative h-32 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={reg.banner || event?.banner}
                    alt={reg.eventTitle}
                    className={`w-full h-full object-cover ${isCancelled ? 'grayscale opacity-50' : ''}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${badge}`}
                    >
                      {badgeText}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur-md border border-white/20">
                      {reg.registrationId}
                    </span>
                  </div>
                  <h3 className="absolute bottom-3 left-4 right-4 text-sm font-bold font-display text-white line-clamp-2">
                    {reg.eventTitle}
                  </h3>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  {isRejected && reg.rejectReason && (
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-2.5">
                      <strong>Reason:</strong> {reg.rejectReason}
                    </p>
                  )}

                  {isPending && (
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-2.5">
                      Seat held while the admin reviews your application. Payment is collected after
                      approval.
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {event?.formattedDate || new Date(reg.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{reg.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{reg.venue}</span>
                    </div>
                    {!isPending && !isCancelled && (
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className={isPaid ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                          {isPaid ? `Paid Rs.${reg.amountPaid || 0}` : `Due Rs.${reg.amountPaid || 0}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {isRejected ? (
                    <button
                      onClick={() => navigate('/events')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Browse &amp; Apply Again</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setTicket(reg)}
                      disabled={!ready}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isCancelled ? (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Ticket Cancelled</span>
                        </>
                      ) : isPending ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Awaiting Admin Review</span>
                        </>
                      ) : !ready ? (
                        <>
                          <IndianRupee className="w-4 h-4" />
                          <span>Complete Payment for Ticket</span>
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4" />
                          <span>View Ticket</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket modal */}
      <Modal isOpen={!!ticket} onClose={() => setTicket(null)} title="Your Event Ticket" size="lg">
        {ticket && <DigitalTicketPass registration={ticket} />}
      </Modal>
    </div>
  );
};

const TONES = {
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
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
