import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  ExternalLink,
  CheckCircle2,
  CalendarX
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RegistrationModal } from '../../components/common/RegistrationModal';
import { EmptyState } from '../../components/common/EmptyState';

export const MyRegistrationsPage = () => {
  const { registrations, cancelRegistration } = useEvents();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'confirmed' | 'cancelled'
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [regToCancel, setRegToCancel] = useState(null);
  const [passModalOpen, setPassModalOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  const filteredRegistrations = registrations.filter((r) => {
    if (activeTab === 'confirmed') return r.status === 'Confirmed';
    if (activeTab === 'cancelled') return r.status === 'Cancelled';
    return true;
  });

  const handleOpenCancel = (reg) => {
    setRegToCancel(reg);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (regToCancel) {
      cancelRegistration(regToCancel.registrationId);
      setRegToCancel(null);
    }
  };

  const handleViewPass = (reg) => {
    setSelectedPass(reg);
    setPassModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            My Event Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your campus event passes, digital QR credentials, and attendance status.
          </p>
        </div>

        <Link
          to="/events"
          className="self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          + Register for More
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'all', label: `All (${registrations.length})` },
          { id: 'confirmed', label: `Confirmed (${registrations.filter(r => r.status === 'Confirmed').length})` },
          { id: 'cancelled', label: `Cancelled (${registrations.filter(r => r.status === 'Cancelled').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Registrations List */}
      {filteredRegistrations.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No registrations found"
          description="You don't have any event registrations under this status yet."
          actionText="Discover Events"
          onAction={() => window.location.href = '/events'}
        />
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((reg) => {
            const isCancelled = reg.status === 'Cancelled';
            return (
              <div
                key={reg.registrationId}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border transition-all shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
                  isCancelled
                    ? 'border-slate-200 dark:border-slate-800 opacity-70'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800/80'
                }`}
              >
                {/* Left Thumbnail & Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0">
                  <img
                    src={reg.banner}
                    alt={reg.eventTitle}
                    className="w-full sm:w-28 h-28 rounded-2xl object-cover shrink-0"
                  />

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={reg.status} />
                      <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                        {reg.registrationId}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                      {reg.eventTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {reg.eventDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {reg.eventTime}
                      </span>
                      <span className="flex items-center gap-1 truncate max-w-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {reg.venue}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Attendee: <span className="font-semibold text-slate-700 dark:text-slate-300">{reg.studentName} ({reg.studentId})</span>
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <Link
                    to={`/events/${reg.eventId}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                    title="View Event Details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {!isCancelled && (
                    <>
                      <button
                        onClick={() => handleViewPass(reg)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View Pass</span>
                      </button>

                      <button
                        onClick={() => handleOpenCancel(reg)}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Digital Pass Modal */}
      <RegistrationModal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        registration={selectedPass}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Event Registration?"
        message={`Are you sure you want to cancel your pass (${regToCancel?.registrationId}) for "${regToCancel?.eventTitle}"? Your seat will be returned to the campus public pool.`}
        confirmText="Yes, Cancel Registration"
        cancelText="Keep Registration"
        type="danger"
      />

    </div>
  );
};
