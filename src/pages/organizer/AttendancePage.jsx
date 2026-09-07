import React, { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import {
  CheckSquare,
  Users,
  UserCheck,
  UserX,
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  Sparkles,
  Camera
} from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';

export const AttendancePage = () => {
  const { attendees, setAttendeeAttendance, events } = useEvents();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('evt-001');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  // Attendance metrics
  const currentEventAttendees = attendees.filter((a) => a.eventId === selectedEvent);
  const registeredCount = currentEventAttendees.length;
  const presentCount = currentEventAttendees.filter((a) => a.attendance === 'Present').length;
  const absentCount = currentEventAttendees.filter((a) => a.attendance === 'Absent').length;
  const pendingCount = currentEventAttendees.filter((a) => a.attendance === 'Pending').length;
  const attendanceRate = registeredCount > 0 ? Math.round((presentCount / registeredCount) * 100) : 0;

  const filteredAttendees = currentEventAttendees.filter((a) =>
    a.studentName.toLowerCase().includes(search.toLowerCase()) ||
    a.studentId.toLowerCase().includes(search.toLowerCase()) ||
    a.registrationId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSimulateScan = (e) => {
    e.preventDefault();
    if (!scannedCode) return;

    const matched = attendees.find(
      (a) => a.registrationId.toUpperCase() === scannedCode.trim().toUpperCase()
    );

    if (matched) {
      setAttendeeAttendance(matched.id, 'Present');
      showToast(`Pass Validated! ${matched.studentName} marked PRESENT.`, 'success');
      setScannerOpen(false);
      setScannedCode('');
    } else {
      showToast('Invalid QR Code Pass. No matching registration found.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Live Attendance & Check-In Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Scan attendee passes or manually mark student check-in status.
          </p>
        </div>

        <button
          onClick={() => setScannerOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <Camera className="w-4 h-4" />
          <span>Launch QR Scanner</span>
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Registered"
          value={registeredCount}
          icon={Users}
          color="indigo"
        />
        <StatsCard
          title="Marked Present"
          value={presentCount}
          icon={UserCheck}
          color="emerald"
        />
        <StatsCard
          title="Marked Absent"
          value={absentCount}
          icon={UserX}
          color="rose"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={CheckSquare}
          color="amber"
        />
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search attendee by name, student ID, pass code..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Event Select Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-xs font-bold text-slate-400">Event:</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>{evt.title}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Attendees Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Attendee</th>
                <th className="px-6 py-4">Pass ID</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Check-In Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAttendees.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {att.studentName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      ID: {att.studentId}
                    </p>
                  </td>

                  <td className="px-6 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {att.registrationId}
                  </td>

                  <td className="px-6 py-4">
                    {att.department}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={att.attendance} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setAttendeeAttendance(att.id, 'Present')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                          att.attendance === 'Present'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Present</span>
                      </button>

                      <button
                        onClick={() => setAttendeeAttendance(att.id, 'Absent')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                          att.attendance === 'Absent'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Absent</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated QR Scanner Modal */}
      <Modal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        title="Simulated QR Pass Scanner"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-center">
          <div className="w-48 h-48 mx-auto rounded-3xl bg-slate-900 border-2 border-dashed border-indigo-500 flex flex-col items-center justify-center text-white relative overflow-hidden">
            <QrCode className="w-16 h-16 text-indigo-400 animate-pulse" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 animate-pulse-subtle shadow-lg" />
            <span className="text-[10px] text-slate-400 mt-2">Camera Viewfinder Active</span>
          </div>

          <form onSubmit={handleSimulateScan} className="space-y-3 pt-2">
            <p className="text-xs text-slate-500">
              Type or paste a pass ID (e.g. <span className="font-mono font-bold text-indigo-600">CC-2026-8F92A</span>) to simulate an optical QR code scan:
            </p>
            <input
              type="text"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              placeholder="e.g. CC-2026-8F92A"
              className="w-full px-3.5 py-2.5 text-xs text-center font-mono font-bold uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Verify & Check In
            </button>
          </form>
        </div>
      </Modal>

    </div>
  );
};
