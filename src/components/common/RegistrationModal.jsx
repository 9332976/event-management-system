import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { DigitalTicketPass } from './DigitalTicketPass';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Tag,
  Users,
  Utensils,
  Armchair,
  Shield,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

export const RegistrationModal = ({
  isOpen,
  onClose,
  registration,
  onConfirmRegistration,
  eventPrice = "Free"
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Preferences / Booking Form, 2: Confirmed Ticket Pass

  const [formData, setFormData] = useState({
    ticketTier: 'VIP All-Access Pass',
    seating: 'Section A (Main Floor)',
    dietary: 'Vegetarian',
    specialRequirements: '',
    isGroup: false,
    groupMembers: '',
    promoCode: '',
    discountApplied: false
  });

  useEffect(() => {
    if (registration) {
      setStep(2); // If already registered, jump straight to ticket pass
    } else {
      setStep(1);
    }
  }, [isOpen, registration]);

  useEffect(() => {
    if (step === 2 && isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B']
        });
      } catch (e) {
        console.log('Confetti error', e);
      }
    }
  }, [step, isOpen]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (['EARLY2026', 'STUDENT50', 'CAMPUS100'].includes(formData.promoCode.toUpperCase().trim())) {
      setFormData({ ...formData, discountApplied: true });
      showToast('100% Student Discount Applied! ✨', 'success');
    } else {
      showToast('Invalid promo code. Try EARLY2026', 'error');
    }
  };

  const handleProceedToPass = (e) => {
    e.preventDefault();
    if (onConfirmRegistration) {
      onConfirmRegistration(formData);
    }
    setStep(2);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? "Customize Your Event Pass 🎟️" : "Registration Confirmed! 🎉"}
      maxWidth="max-w-xl"
    >
      {step === 1 ? (
        <form onSubmit={handleProceedToPass} className="space-y-5 text-xs">
          
          {/* Ticket Tier Selection */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Ticket Tier
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: "VIP All-Access Pass", perk: "Front Row + Delegate Dining + Swag Kit" },
                { name: "General Admission", perk: "Main Hall Seating + Digital E-Pass" },
                { name: "Early Bird Student", perk: "Reserved Seat + Certificate" },
                { name: "Virtual Stream Pass", perk: "HD Live Link + Virtual Chat" }
              ].map((tier) => (
                <button
                  key={tier.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, ticketTier: tier.name })}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.ticketTier === tier.name
                      ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 dark:text-white font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-bold text-xs">{tier.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-normal">{tier.perk}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Seating Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Armchair className="w-3.5 h-3.5 text-indigo-500" />
                <span>Seating Preference</span>
              </label>
              <select
                value={formData.seating}
                onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                <option value="Section A (Front Rows)">Section A (Front Rows)</option>
                <option value="Section B (Main Floor)">Section B (Main Floor)</option>
                <option value="Section C (Balcony View)">Section C (Balcony View)</option>
                <option value="Computing Pod (Lab Arena)">Computing Pod (Lab Arena)</option>
              </select>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                <span>Dietary Preference</span>
              </label>
              <select
                value={formData.dietary}
                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                <option value="Vegetarian">Vegetarian (Pure Veg)</option>
                <option value="Non-Veg">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain Meal">Jain Meal</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Accessibility / Special Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Wheelchair access, extra power outlet for hardware demo"
              value={formData.specialRequirements}
              onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
            />
          </div>

          {/* Promo Code */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Discount Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try EARLY2026 or STUDENT50"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs"
              >
                Apply
              </button>
            </div>
            {formData.discountApplied && (
              <p className="text-[10px] text-emerald-600 font-bold mt-1">
                ✓ Student 100% waiver applied!
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confirm & Generate E-Pass</span>
            </button>
          </div>

        </form>
      ) : (
        <div className="space-y-4">
          {/* Success Alert Banner */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
              Your seat is reserved! Keep your E-Pass handy on event day for quick QR check-in.
            </div>
          </div>

          {/* Digital Ticket Pass Component */}
          <DigitalTicketPass registration={registration} />

          {/* Bottom Link to Registrations Hub */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">
              Stored in your Student Dashboard
            </span>
            <button
              onClick={() => {
                onClose();
                navigate('/student/registrations');
              }}
              className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <span>Go to My Registrations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
