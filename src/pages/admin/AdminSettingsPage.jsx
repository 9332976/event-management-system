import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Settings, Save, Shield, Bell, Globe, Sparkles } from 'lucide-react';

export const AdminSettingsPage = () => {
  const { showToast } = useToast();

  const [settings, setSettings] = useState({
    institutionName: 'National Institute of Technology & Campus Excellence',
    tagline: 'Discover. Participate. Connect.',
    academicYear: '2026 - 2027',
    currentTerm: 'Autumn Semester',
    adminEmail: 'dean.studentaffairs@campus.edu',
    allowStudentRegistrations: true,
    requireFacultyApproval: true,
    enableAutomaticQrPasses: true,
    maxConcurrentRegistrationsPerStudent: 8,
  });

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('cc_admin_settings', JSON.stringify(settings));
    showToast('Campus configuration settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
          University & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure university branding, semester terms, and event governance policies.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-8">
        
        {/* Section 1: Institution Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>1. University Identity</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Institution Name
            </label>
            <input
              type="text"
              value={settings.institutionName}
              onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={settings.academicYear}
                onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Term / Semester
              </label>
              <input
                type="text"
                value={settings.currentTerm}
                onChange={(e) => setSettings({ ...settings, currentTerm: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Event Governance Policies */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" />
            <span>2. Governance & Registration Policies</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Enable Open Student Registrations</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Allow students to instantly register for published campus events</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowStudentRegistrations}
                onChange={(e) => setSettings({ ...settings, allowStudentRegistrations: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Require Faculty Deanery Approval</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">New club events must be approved before appearing on public discovery</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireFacultyApproval}
                onChange={(e) => setSettings({ ...settings, requireFacultyApproval: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Automatic E-Pass Generation</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Instantly generate unique QR Code and Pass ID for confirmed registrations</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableAutomaticQrPasses}
                onChange={(e) => setSettings({ ...settings, enableAutomaticQrPasses: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
