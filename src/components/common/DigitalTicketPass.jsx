import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2, QrCode, Download, Printer } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const DigitalTicketPass = ({ registration, onDownloadSuccess }) => {
  const { showToast } = useToast();

  const handlePrint = () => {
    window.print();
    if (onDownloadSuccess) onDownloadSuccess();
  };

  const handleDownload = () => {
    // Generate text/JSON/pass card simulated download
    const passData = JSON.stringify(registration, null, 2);
    const blob = new Blob([passData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CampusConnect-Pass-${registration.registrationId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Pass ${registration.registrationId} downloaded!`, 'success');
    if (onDownloadSuccess) onDownloadSuccess();
  };

  return (
    <div className="space-y-4">
      {/* Printable / Viewable Digital Ticket Card */}
      <div
        id="printable-ticket"
        className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 p-6"
      >
        {/* Glowing background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-800/40 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-base tracking-tight text-white">
                Campus<span className="text-indigo-400">Connect</span> Pass
              </span>
              <p className="text-[10px] text-indigo-300">Official University E-Pass</p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              CONFIRMED
            </span>
          </div>
        </div>

        {/* Event Info */}
        <div className="py-4 space-y-3 relative z-10">
          <h3 className="text-lg sm:text-xl font-bold font-display text-white leading-snug">
            {registration.eventTitle}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{registration.eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{registration.eventTime}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">{registration.venue}</span>
            </div>
          </div>
        </div>

        {/* Perforated Divider */}
        <div className="relative py-2 -mx-6 flex items-center">
          <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 -ml-3" />
          <div className="flex-1 border-t-2 border-dashed border-indigo-800/60" />
          <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 -mr-3" />
        </div>

        {/* Attendee Details & Simulated QR Code */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          
          <div className="space-y-1 text-left w-full sm:w-auto">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-300">
                Attendee Name
              </p>
              <p className="text-sm font-bold text-white">
                {registration.studentName}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300">
              <div>
                <p className="text-[10px] text-slate-400">Student ID</p>
                <p className="font-semibold text-white">{registration.studentId || "2023-CS-084"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Department</p>
                <p className="font-semibold text-white">{registration.department || "Computer Science"}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Ticket Tier</p>
                <span className="inline-block font-bold text-amber-300 text-[11px]">
                  {registration.ticketTier || "VIP All-Access Pass"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="px-2.5 py-1 rounded-lg bg-indigo-900/60 border border-indigo-700/60 text-[10px]">
                <span className="text-indigo-300 font-medium">Seat: </span>
                <span className="font-bold text-white">{registration.seating || "Section A (Main Hall)"}</span>
              </div>
              {registration.dietary && (
                <div className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-[10px]">
                  <span className="text-emerald-300 font-medium">Meal: </span>
                  <span className="font-bold text-white">{registration.dietary}</span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-slate-400">Pass Code</p>
              <p className="font-mono text-sm font-bold text-indigo-300 tracking-wider">
                {registration.registrationId}
              </p>
            </div>
          </div>

          {/* Simulated QR Code */}
          <div className="bg-white p-3 rounded-2xl shrink-0 text-slate-900 flex flex-col items-center justify-center shadow-lg">
            <svg
              className="w-24 h-24 text-slate-900"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              {/* Decorative QR code matrix */}
              <rect x="0" y="0" width="30" height="30" rx="4" fill="#1E1B4B" />
              <rect x="6" y="6" width="18" height="18" fill="white" />
              <rect x="10" y="10" width="10" height="10" fill="#1E1B4B" />

              <rect x="70" y="0" width="30" height="30" rx="4" fill="#1E1B4B" />
              <rect x="76" y="6" width="18" height="18" fill="white" />
              <rect x="80" y="10" width="10" height="10" fill="#1E1B4B" />

              <rect x="0" y="70" width="30" height="30" rx="4" fill="#1E1B4B" />
              <rect x="6" y="76" width="18" height="18" fill="white" />
              <rect x="10" y="80" width="10" height="10" fill="#1E1B4B" />

              {/* Data blocks */}
              <rect x="36" y="6" width="6" height="6" fill="#4F46E5" />
              <rect x="46" y="6" width="6" height="6" fill="#1E1B4B" />
              <rect x="56" y="6" width="6" height="6" fill="#4F46E5" />
              <rect x="36" y="18" width="6" height="6" fill="#1E1B4B" />
              <rect x="46" y="24" width="12" height="6" fill="#4F46E5" />

              <rect x="6" y="40" width="8" height="8" fill="#1E1B4B" />
              <rect x="20" y="44" width="6" height="6" fill="#4F46E5" />
              <rect x="36" y="36" width="8" height="8" fill="#1E1B4B" />
              <rect x="48" y="40" width="10" height="10" fill="#4F46E5" />
              <rect x="64" y="36" width="8" height="8" fill="#1E1B4B" />
              <rect x="80" y="44" width="8" height="8" fill="#4F46E5" />

              <rect x="36" y="56" width="12" height="6" fill="#1E1B4B" />
              <rect x="54" y="54" width="6" height="12" fill="#4F46E5" />
              <rect x="66" y="56" width="8" height="8" fill="#1E1B4B" />
              <rect x="82" y="56" width="8" height="8" fill="#1E1B4B" />

              <rect x="36" y="74" width="8" height="8" fill="#4F46E5" />
              <rect x="50" y="76" width="10" height="10" fill="#1E1B4B" />
              <rect x="68" y="74" width="6" height="16" fill="#4F46E5" />
              <rect x="80" y="80" width="12" height="8" fill="#1E1B4B" />
            </svg>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-700 mt-1">
              SCAN AT ENTRY
            </span>
          </div>

        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Pass</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print Pass</span>
        </button>
      </div>
    </div>
  );
};
