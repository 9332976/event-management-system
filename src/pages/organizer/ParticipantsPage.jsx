import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import {
  Users,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { downloadCsv } from '../../utils/exportCsv';
import { useToast } from '../../context/ToastContext';

export const ParticipantsPage = () => {
  const { attendees, events } = useEvents();
  const { showToast } = useToast();

  const [selectedEventId, setSelectedEventId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAttendees = attendees.filter((att) => {
    if (selectedEventId !== 'all' && att.eventId !== selectedEventId) return false;
    if (
      searchQuery.trim() &&
      !att.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !att.studentId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !att.department.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const exportData = filteredAttendees.map(a => ({
      'Registration ID': a.registrationId,
      'Student Name': a.studentName,
      'Student ID': a.studentId,
      'Department': a.department,
      'Event ID': a.eventId,
      'Registration Date': a.registeredDate,
      'Status': a.status,
      'Attendance': a.attendance
    }));
    downloadCsv(exportData, `Participants-Roster-${Date.now()}.csv`);
    showToast('Participant roster exported as CSV!', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Participant Roster & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review registered students, approve applications, and export attendee manifests.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Roster CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID, department..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Event Select Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-slate-400 hidden sm:block">Event:</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Events ({attendees.length})</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>{evt.title}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Student ID / Roll</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Reg. Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAttendees.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                        {att.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {att.studentName}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {att.registrationId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                    {att.studentId}
                  </td>

                  <td className="px-6 py-4">
                    {att.department}
                  </td>

                  <td className="px-6 py-4 text-slate-400">
                    {att.registeredDate}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={att.status} />
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={att.attendance} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => showToast(`Approved credential for ${att.studentName}`, 'success')}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors"
                        title="Approve registration"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast(`Rejected credential for ${att.studentName}`, 'error')}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                        title="Reject registration"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
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
