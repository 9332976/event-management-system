import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Modal } from './Modal';
import { StatusBadge } from './StatusBadge';
import {
  Eye,
  Mail,
  Phone,
  Hash,
  BookOpen,
  Calendar,
  Users,
  Bell,
  Shield,
  Ticket,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee
} from 'lucide-react';

const StatTile = ({ icon: Icon, label, value, tone = 'indigo' }) => {
  const tones = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    sky: 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
    violet: 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400'
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
          {value ?? 0}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">
          {label}
        </p>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-xs text-slate-700 dark:text-slate-200 break-words">{value || '—'}</p>
    </div>
  </div>
);

export const User360Modal = ({ isOpen, onClose, user, onUserUpdated, onUserDeleted }) => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('registrations');
  const [busy, setBusy] = useState(false);

  const load360 = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/users/${user.id}/360`);
      setData(res);
    } catch (error) {
      showToast(error.message || 'Could not load the full profile.', 'error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTab('registrations');
      setData(null);
      load360();
    }
  }, [isOpen, user?.id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const nextStatus = user.status === 'active' ? 'deactivated' : 'active';
    setBusy(true);
    try {
      const res = await api.patch(`/users/${user.id}/status`, { status: nextStatus });
      onUserUpdated?.(res.user);
      showToast(`Account is now ${nextStatus.toUpperCase()}`, 'info');
      load360();
    } catch (error) {
      showToast(error.message || 'Could not update status.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await api.delete(`/users/${user.id}`);
      showToast(`${user.name} was removed from the directory.`, 'success');
      onUserDeleted?.(user.id);
      onClose();
    } catch (error) {
      showToast(error.message || 'Could not delete user.', 'error');
      setBusy(false);
    }
  };

  const profile = data?.user || user;
  const stats = data?.stats;
  const registrations = data?.registrations || [];
  const notifications = data?.notifications || [];

  const tabs = [
    { key: 'registrations', label: 'Registrations', count: registrations.length },
    { key: 'notifications', label: 'Notifications', count: notifications.length }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student 360° Profile" maxWidth="max-w-4xl">
      {loading && (
        <div className="space-y-3">
          <div className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          <p className="text-center text-xs text-slate-400 pt-2">Compiling full activity history…</p>
        </div>
      )}

      {!loading && profile && (
        <div className="space-y-5">

          {/* Identity Card */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-lg font-extrabold font-display truncate">{profile.name}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20">
                  {profile.role}
                </span>
                <StatusBadge status={profile.status} className="bg-white/15 border-white/25 text-white" />
              </div>
              <p className="text-xs text-indigo-100 mt-0.5 break-all">{profile.email}</p>
              <p className="text-[11px] text-indigo-200/90 mt-1">
                {profile.studentId || 'No roll number'} · {profile.department || 'Unassigned'} · {profile.year || '—'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleToggleStatus}
                disabled={busy}
                className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                {profile.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                {profile.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="px-3 py-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Contact & Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              <InfoRow icon={Mail} label="Email" value={profile.email} />
              <InfoRow icon={Phone} label="Phone" value={profile.phone} />
              <InfoRow icon={Hash} label="Roll Number" value={profile.studentId} />
            </div>
            <div className="space-y-3">
              <InfoRow icon={BookOpen} label="Department" value={profile.department} />
              <InfoRow icon={Calendar} label="Year / Semester" value={`${profile.year || '—'} · ${profile.semester || '—'}`} />
              <InfoRow icon={Clock} label="Joined" value={profile.joinedDate} />
            </div>
            <div className="space-y-3">
              <InfoRow icon={Shield} label="Account Status" value={profile.status} />
              <InfoRow icon={Users} label="Teams Formed" value={stats?.teams ?? 0} />
              <InfoRow icon={Eye} label="Read by Admin" value={`Joined ${new Date(profile.createdAt).toLocaleDateString()}`} />
            </div>
          </div>

          {profile.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 italic">
              “{profile.bio}”
            </p>
          )}

          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            <StatTile icon={Ticket} label="Registered" value={stats?.totalRegistrations} />
            <StatTile icon={CheckCircle2} label="Attended" value={stats?.attended} tone="emerald" />
            <StatTile icon={XCircle} label="Absent" value={stats?.absent} tone="rose" />
            <StatTile icon={Clock} label="Pending" value={stats?.pendingAttendance} tone="amber" />
            <StatTile icon={IndianRupee} label="Paid" value={stats?.totalPaid} tone="violet" />
            <StatTile icon={Bell} label="Unread" value={stats?.unreadNotifications} tone="sky" />
          </div>

          {/* Activity Tabs */}
          <div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    tab === t.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label} ({t.count})
                </button>
              ))}
            </div>

            {tab === 'registrations' && (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {registrations.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No event registrations yet.</p>
                )}
                {registrations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  >
                    {r.banner && (
                      <img src={r.banner} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {r.eventTitle || 'Untitled event'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {r.eventDate} · {r.eventTime} · {r.venue || 'TBA'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {r.ticketTier} {r.teamName && r.teamName !== 'Solo Participant' ? `· Team: ${r.teamName}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={r.status} />
                      <span className="text-[10px] font-semibold text-slate-400">Attendance: {r.attendance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'notifications' && (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6">No notifications on record.</p>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-2xl border ${
                      n.read
                        ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        : 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</p>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0">{n.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(n.createdAt).toLocaleString()} {n.read ? '' : '· Unread'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !profile && (
        <p className="text-xs text-slate-400 text-center py-8">Select a user to inspect their 360° profile.</p>
      )}
    </Modal>
  );
};
