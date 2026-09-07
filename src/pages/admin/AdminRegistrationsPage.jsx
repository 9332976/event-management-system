import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import {
  CheckSquare,
  Search,
  Download,
  Calendar,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { downloadCsv } from '../../utils/exportCsv';
import { useToast } from '../../context/ToastContext';

export const AdminRegistrationsPage = () => {
  const { registrations } = useEvents();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const filteredRegistrations = registrations.filter((r) =>
    r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
    r.studentName.toLowerCase().includes(search.toLowerCase()) ||
    r.studentId.toLowerCase().includes(search.toLowerCase()) ||
    r.registrationId.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const exportData = filteredRegistrations.map((r) => ({
      'Pass ID': r.registrationId,
      'Event Title': r.eventTitle,
      'Attendee Name': r.studentName,
      'Student ID': r.studentId,
      'Department': r.department,
      'Date': r.eventDate,
      'Status': r.status,
      'Attendance': r.attendance
    }));
    downloadCsv(exportData, `Campus-Registrations-${Date.now()}.csv`);
    showToast('Campus registrations exported to CSV!', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Campus Registrations Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Full digital ledger of all student event registrations and E-Passes.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export All CSV</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, event, pass code, department..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Pass ID</th>
                <th className="px-6 py-4">Event Name</th>
                <th className="px-6 py-4">Attendee Name</th>
                <th className="px-6 py-4">Department & Roll</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRegistrations.map((r) => (
                <tr key={r.registrationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {r.registrationId}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                    {r.eventTitle}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {r.studentName}
                  </td>
                  <td className="px-6 py-4">
                    <p>{r.department}</p>
                    <p className="text-[10px] text-slate-400">{r.studentId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.attendance} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
