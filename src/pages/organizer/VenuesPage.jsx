import React, { useState } from 'react';
import { mockVenues, mockResourceCategories } from '../../data/mockVenues';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import {
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Calculator,
  Sliders,
  Clock,
  Shield,
  Coffee,
  Tv,
  Plus,
  ArrowRight,
  DollarSign
} from 'lucide-react';

export const VenuesPage = () => {
  const { events } = useEvents();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('venues'); // 'venues' | 'resources' | 'calculator'
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(mockVenues[0].floorPlans[0]);

  // Calculator State
  const [calcVenueId, setCalcVenueId] = useState(mockVenues[0].id);
  const [calcHours, setCalcHours] = useState(6);
  const [calcAvEquipment, setCalcAvEquipment] = useState(['res-av-1', 'res-av-2']);
  const [calcCateringHeadcount, setCalcCateringHeadcount] = useState(150);
  const [calcCateringMealType, setCalcCateringMealType] = useState(250); // 250/plate
  const [calcVolunteers, setCalcVolunteers] = useState(15);
  const [calcStageBackdrop, setCalcStageBackdrop] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    eventId: events[0]?.id || '',
    date: '2026-10-15',
    timeSlot: '09:00 AM - 05:00 PM',
    setupLayout: 'Theater Style',
    specialNotes: 'Require 4 wireless mics and catering setup.'
  });

  const handleBookVenueSubmit = (e) => {
    e.preventDefault();
    showToast(`Venue reservation request submitted for ${selectedVenue.name}!`, 'success');
    setBookingModalOpen(false);
  };

  // Calculator computation
  const activeCalcVenue = mockVenues.find(v => v.id === calcVenueId) || mockVenues[0];
  const venueHourlyCost = parseInt(activeCalcVenue.hourlyRate.replace(/[^0-9]/g, '')) || 3000;
  const venueTotal = venueHourlyCost * calcHours;
  const avTotal = calcAvEquipment.length * 2500;
  const cateringTotal = calcCateringHeadcount * calcCateringMealType;
  const backdropTotal = calcStageBackdrop ? 18000 : 0;
  const grandTotal = venueTotal + avTotal + cateringTotal + backdropTotal;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Venue & Logistics Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Venue Booking & Resource Allocation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage campus halls, floor plan configurations, audiovisual equipment, and calculate event logistics budgets.
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('venues')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'venues'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Venues & Floor Plans
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'resources'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Resource Matrix
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Budget Estimator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VENUES & FLOOR PLANS */}
      {activeTab === 'venues' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Venue Cards List */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Campus Facilities Directory ({mockVenues.length})
            </h3>

            {mockVenues.map((venue) => {
              const isSelected = venue.id === selectedVenue.id;
              return (
                <div
                  key={venue.id}
                  onClick={() => {
                    setSelectedVenue(venue);
                    setSelectedFloorPlan(venue.floorPlans[0]);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {venue.category}
                        </span>
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {venue.hourlyRate}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {venue.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{venue.location}</span>
                      </p>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-purple-500" />
                          <span>Max {venue.capacity} Seats</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Venue View & Floor Plan Configurator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl">
              
              {/* Venue Cover Image with Overlay */}
              <div className="relative h-64 sm:h-72">
                <img
                  src={selectedVenue.image}
                  alt={selectedVenue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white uppercase tracking-wider">
                      {selectedVenue.status}
                    </span>
                    <h2 className="text-2xl font-bold font-display mt-1">
                      {selectedVenue.name}
                    </h2>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{selectedVenue.location}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all shrink-0"
                  >
                    Reserve This Venue
                  </button>
                </div>
              </div>

              {/* Venue Details & Amenities */}
              <div className="p-6 space-y-6">
                
                {/* Amenities Tags */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Included Amenities & Equipment
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floor Plan Configurations */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Floor Plan Setup Configurations
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedVenue.floorPlans.map((fp, idx) => {
                      const isSelectedPlan = selectedFloorPlan?.name === fp.name;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedFloorPlan(fp)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            isSelectedPlan
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20'
                              : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {fp.name}
                          </p>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                            {fp.capacity} Capacity
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                            {fp.suitableFor}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scheduled Bookings on this Venue */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Upcoming Booked Dates & Slots
                  </h4>
                  <div className="space-y-2">
                    {selectedVenue.upcomingBookings.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span className="font-bold text-slate-900 dark:text-white">{b.eventTitle}</span>
                        </div>
                        <div className="text-right text-slate-500 dark:text-slate-400">
                          <span className="font-semibold">{b.date}</span> • <span>{b.timeSlot}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: RESOURCE MATRIX */}
      {activeTab === 'resources' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockResourceCategories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-indigo-600" />
                    <span>{cat.category}</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    {cat.items.length} Units
                  </span>
                </div>

                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Standard rate: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.costPerDay}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {item.available} / {item.total} Ready
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BUDGET ESTIMATOR CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xl max-w-5xl mx-auto space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>Event Logistics & Budget Estimator</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select your venue, hours, catering, and equipment to calculate a comprehensive financial budget breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Config Inputs */}
            <div className="space-y-5">
              
              {/* Select Venue */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Venue
                </label>
                <select
                  value={calcVenueId}
                  onChange={(e) => setCalcVenueId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {mockVenues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.hourlyRate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Hours */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Event Duration</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{calcHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={calcHours}
                  onChange={(e) => setCalcHours(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Catering Delegate Headcount */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Catering Delegate Headcount</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">{calcCateringHeadcount} Plates</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={calcCateringHeadcount}
                  onChange={(e) => setCalcCateringHeadcount(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Meal Package */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Catering Meal Tier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCalcCateringMealType(250)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      calcCateringMealType === 250
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Deluxe Lunch (₹250/plate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcCateringMealType(80)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                      calcCateringMealType === 80
                        ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    High-Tea Snacks (₹80/person)
                  </button>
                </div>
              </div>

              {/* Stage LED Backdrop Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <input
                  type="checkbox"
                  id="backdrop"
                  checked={calcStageBackdrop}
                  onChange={(e) => setCalcStageBackdrop(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
                <label htmlFor="backdrop" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                  Include 24ft LED Stage Backdrop & Screen (+₹18,000)
                </label>
              </div>

            </div>

            {/* Price Breakdown Summary */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  Estimated Financial Budget
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
                  ₹{grandTotal.toLocaleString()}
                </h3>
              </div>

              <div className="space-y-3 divide-y divide-indigo-800/60 text-xs">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-300">Venue Rental ({calcHours}h × {activeCalcVenue.hourlyRate}):</span>
                  <span className="font-bold font-mono">₹{venueTotal.toLocaleString()}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-300">Audiovisual & Sound Rig:</span>
                  <span className="font-bold font-mono">₹{avTotal.toLocaleString()}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-300">Catering Headcount ({calcCateringHeadcount} × ₹{calcCateringMealType}):</span>
                  <span className="font-bold font-mono">₹{cateringTotal.toLocaleString()}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-300">Stage Fabrication & LED Wall:</span>
                  <span className="font-bold font-mono">₹{backdropTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => showToast('Budget plan exported to organizer PDF report!', 'success')}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Export Budget Summary
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Booking Reservation Dialog Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Reserve Venue: {selectedVenue.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit a formal venue booking requisition for campus approval.
              </p>
            </div>

            <form onSubmit={handleBookVenueSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Name
                </label>
                <select
                  value={bookingForm.eventId}
                  onChange={(e) => setBookingForm({ ...bookingForm, eventId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Layout Configuration
                  </label>
                  <select
                    value={bookingForm.setupLayout}
                    onChange={(e) => setBookingForm({ ...bookingForm, setupLayout: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                  >
                    {selectedVenue.floorPlans.map((fp, i) => (
                      <option key={i} value={fp.name}>
                        {fp.name} ({fp.capacity} Pax)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Special Logistics Notes & Equipment
                </label>
                <textarea
                  rows="3"
                  value={bookingForm.specialNotes}
                  onChange={(e) => setBookingForm({ ...bookingForm, specialNotes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
