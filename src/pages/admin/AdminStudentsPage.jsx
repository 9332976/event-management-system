import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Check,
  Ban,
  Eye,
  IndianRupee,
  Ticket,
  Clock,
  Users,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { User360Modal } from '../../components/common/User360Modal';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
  { key: 'deactivated', label: 'Deactivated' },
];

const PAYMENT_TABS = [
  { key: 'all', label: 'Any Payment' },
  { key: 'paid', label: 'Paid' },
  { key: 'unpaid', label: 'Unpaid' },
  { key: 'partial', label: 'Partial' },
  { key: 'free', label: 'Free Only' },
];

const paymentBadge = (user) => {
  if (user.paidCount > 0 && user.unpaidCount > 0) {
    return { label: 'Partial', className: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
  }
  if (user.unpaidCount > 0) {
    return { label: 'Unpaid', className: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
  }
  if (user.paidCount > 0) {
    return { label: 'Paid', className: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
  }
  return { label: 'No Events', className: 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700' };
};

export const AdminStudentsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const { showToast } = useToast();
  const { currentUser } = useAuth();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/users?limit=500&role=student');
      setUsers(data.users || []);
    } catch (error) {
      showToast(error.message || 'Could not load students.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const counts = useMemo(
    () => ({
      all: users.length,
      pending: users.filter((u) => u.status === 'pending').length,
      active: users.filter((u) => u.status === 'active').length,
      deactivated: users.filter((u) => u.status === 'deactivated').length,
    }),
    [users]
  );

  const totals = useMemo(
    () => ({
      collected: users.reduce((sum, u) => sum + (u.totalPaid || 0), 0),
      due: users.reduce((sum, u) => sum + (u.totalDue || 0), 0),
    }),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;

      if (paymentFilter !== 'all') {
        if (paymentFilter === 'paid' && !(u.paidCount > 0)) return false;
        if (paymentFilter === 'unpaid' && !(u.unpaidCount > 0)) return false;
        if (paymentFilter === 'partial' && !(u.paidCount > 0 && u.unpaidCount > 0)) return false;
        if (paymentFilter === 'free' && u.unpaidCount > 0) return false;
      }

      if (q) {
        const haystack = [u.name, u.email, u.department, u.studentId]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [users, statusFilter, paymentFilter, search]);

  const setStatus = async (user, status) => {
    setBusyId(user.id);
    try {
      const data = await api.patch(`/users/${user.id}/status`, { status });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...data.user } : u)));
      showToast(
        status === 'active'
          ? `${user.name} has been approved and can now sign in.`
          : status === 'pending'
          ? `${user.name} moved back to pending.`
          : `${user.name}'s account has been deactivated.`,
        status === 'active' ? 'success' : 'info'
      );
    } catch (error) {
      showToast(error.message || 'Could not update status.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const paymentBadgeStyle = (user) => paymentBadge(user);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          Students
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Approve new signups, control account access, and track event payments.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryTile icon={Users} label="Total Students" value={counts.all} tone="indigo" />
        <SummaryTile icon={Clock} label="Awaiting Approval" value={counts.pending} tone="amber" />
        <SummaryTile icon={IndianRupee} label="Collected" value={`Rs.${totals.collected}`} tone="emerald" />
        <SummaryTile icon={IndianRupee} label="Outstanding Dues" value={`Rs.${totals.due}`} tone="rose" />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department or roll number..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {STATUS_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === t.key
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {t.label} ({counts[t.key]})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PAYMENT_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setPaymentFilter(t.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  paymentFilter === t.key
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Events</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    Loading students...
                  </td>
                </tr>
              )}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                    No students match these filters.
                  </td>
                </tr>
              )}

              {filteredUsers.map((u) => {
                const badge = paymentBadgeStyle(u);
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/20"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{u.department}</p>
                      <p className="text-[10px] text-slate-400">{u.studentId}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Ticket className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {u.enrolledEvents?.length || 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${badge.className}`}>
                        {badge.label}
                      </span>
                      {u.totalDue > 0 && (
                        <p className="text-[10px] text-rose-500 font-semibold mt-1">Due Rs.{u.totalDue}</p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={u.status} />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status === 'pending' ? (
                          <button
                            disabled={busyId === u.id}
                            onClick={() => setStatus(u, 'active')}
                            className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                        ) : (
                          <button
                            disabled={busyId === u.id || isSelf}
                            onClick={() => setStatus(u, u.status === 'active' ? 'deactivated' : 'active')}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                              u.status === 'active'
                                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                            }`}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}

                        <button
                          onClick={() => setViewUser(u)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Open 360° profile"
                        >
                          <Eye className="w-4 h-4" />
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

      <User360Modal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        user={viewUser}
        onUserUpdated={(updated) =>
          setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)))
        }
        onUserDeleted={(userId) => setUsers((prev) => prev.filter((u) => u.id !== userId))}
      />
    </div>
  );
};

const TONES = {
  indigo: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
  amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
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
