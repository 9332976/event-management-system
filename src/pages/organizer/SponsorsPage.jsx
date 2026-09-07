import React, { useState } from 'react';
import { mockSponsorshipTiers, mockExhibitorBooths } from '../../data/mockSponsors';
import { useToast } from '../../context/ToastContext';
import {
  Award,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  Plus,
  Zap,
  Wifi,
  Shield,
  Building,
  Check,
  Tag
} from 'lucide-react';

export const SponsorsPage = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('tiers'); // 'tiers' | 'exhibitors'
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [boothModalOpen, setBoothModalOpen] = useState(false);

  const [sponsorForm, setSponsorForm] = useState({
    companyName: '',
    tier: 'Platinum Partner',
    contactEmail: '',
    website: ''
  });

  const [boothForm, setBoothForm] = useState({
    companyName: '',
    contactEmail: '',
    powerReq: '3 KW'
  });

  const handleSponsorSubmit = (e) => {
    e.preventDefault();
    showToast(`Sponsorship proposal for ${sponsorForm.companyName} submitted successfully!`, 'success');
    setSponsorModalOpen(false);
  };

  const handleBoothSubmit = (e) => {
    e.preventDefault();
    showToast(`Booth ${selectedBooth?.id} reserved for ${boothForm.companyName}!`, 'success');
    setBoothModalOpen(false);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Corporate Partnerships & Expo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Sponsorship & Exhibitor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure sponsorship tiers, manage corporate partner agreements, and allocate physical exhibition booth spaces.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('tiers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'tiers'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Sponsorship Packages
            </button>
            <button
              onClick={() => setActiveTab('exhibitors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'exhibitors'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Exhibitor Booths Map
            </button>
          </div>

          <button
            onClick={() => setSponsorModalOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Partner</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SPONSORSHIP TIERS */}
      {activeTab === 'tiers' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {mockSponsorshipTiers.map((tier, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${tier.badge}`}>
                      {tier.tier}
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
                      {tier.amount}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Fixed Package Investment
                    </p>
                  </div>

                  {/* Benefits Checklist */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tier Deliverables:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      {tier.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Confirmed Sponsors under this tier */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Sponsors ({tier.currentSponsors.length}):
                  </p>
                  <div className="space-y-2">
                    {tier.currentSponsors.map((sp, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={sp.logo}
                            alt={sp.name}
                            className="w-6 h-6 rounded-md object-cover"
                          />
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {sp.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {sp.allocatedBooth}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: EXHIBITOR BOOTHS MAP & ALLOCATION */}
      {activeTab === 'exhibitors' && (
        <div className="space-y-8">
          
          {/* Visual Interactive Floor Map Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <span>Main Arena Exhibition Floor Layout</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any booth to view technical specifications or reserve a spot for your company.
                </p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500" />
                  <span>Occupied / Reserved</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-700" />
                  <span>Open for Booking</span>
                </span>
              </div>
            </div>

            {/* Booths Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockExhibitorBooths.map((booth) => {
                const isOccupied = booth.status === 'Occupied';
                return (
                  <div
                    key={booth.id}
                    onClick={() => {
                      setSelectedBooth(booth);
                      if (!isOccupied) setBoothModalOpen(true);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isOccupied
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-800/80 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-solid hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {booth.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        isOccupied
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}>
                        {booth.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {booth.company}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {booth.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>{booth.powerSupplied}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-blue-500" />
                        <span>{booth.wifi}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Add Partner Dialog Modal */}
      {sponsorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Register New Sponsor Partner
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Record official corporate sponsorship agreement.
              </p>
            </div>

            <form onSubmit={handleSponsorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud, Intel Labs"
                  value={sponsorForm.companyName}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sponsorship Tier
                  </label>
                  <select
                    value={sponsorForm.tier}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, tier: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="Title Sponsor">Title Sponsor (₹5,00,000)</option>
                    <option value="Platinum Partner">Platinum Partner (₹2,50,000)</option>
                    <option value="Gold Sponsor">Gold Sponsor (₹1,00,000)</option>
                    <option value="Silver Sponsor">Silver Sponsor (₹50,000)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partner@company.com"
                    value={sponsorForm.contactEmail}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, contactEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSponsorModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Partner Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Exhibitor Booth Dialog Modal */}
      {boothModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Reserve {selectedBooth?.label}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dimensions: {selectedBooth?.size} • Wi-Fi: {selectedBooth?.wifi}
              </p>
            </div>

            <form onSubmit={handleBoothSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Exhibitor Organization / Startup Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Robotics Inc."
                  value={boothForm.companyName}
                  onChange={(e) => setBoothForm({ ...boothForm, companyName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="expo@company.com"
                    value={boothForm.contactEmail}
                    onChange={(e) => setBoothForm({ ...boothForm, contactEmail: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Power Load Required
                  </label>
                  <select
                    value={boothForm.powerReq}
                    onChange={(e) => setBoothForm({ ...boothForm, powerReq: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    <option value="1.5 KW">1.5 KW (Standard Display)</option>
                    <option value="3 KW">3 KW (High Power / Demos)</option>
                    <option value="5 KW">5 KW (Heavy Industrial Rig)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBoothModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Allocate Booth
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
