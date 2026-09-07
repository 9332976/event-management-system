import React, { useState } from 'react';
import { mockUsers } from '../../data/mockUsers';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  GraduationCap,
  Sparkles,
  Plus
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const { showToast } = useToast();

  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (
      search.trim() &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase()) &&
      !u.department.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const toggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'deactivated' : 'active';
          showToast(`User ${u.name} is now ${newStatus.toUpperCase()}`, 'info');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      showToast(`User ${userToDelete.name} has been removed from campus directory.`, 'success');
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            User Directory & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage students, club conveners, faculty organizers, and system administrators.
          </p>
        </div>

        <button
          onClick={() => showToast('New user invite simulated!', 'success')}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Invite New User</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department, roll..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'student', 'organizer', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white shadow-sm font-bold'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {r} ({r === 'all' ? users.length : users.filter(u => u.role === r).length})
            </button>
          ))}
        </div>

      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Department / Unit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Name & Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-500/20"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="capitalize px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {u.role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{u.department}</p>
                    <p className="text-[10px] text-slate-400">{u.studentId}</p>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status} />
                  </td>

                  {/* Joined Date */}
                  <td className="px-6 py-4 text-slate-400">
                    {u.joinedDate}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                          u.status === 'active'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="Delete user"
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

      {/* Delete User Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove User from Campus Directory?"
        message={`Are you sure you want to permanently delete user "${userToDelete?.name}" (${userToDelete?.email})?`}
        confirmText="Yes, Delete User"
        cancelText="Cancel"
        type="danger"
      />

    </div>
  );
};
