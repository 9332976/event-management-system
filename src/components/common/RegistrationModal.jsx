import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { DigitalTicketPass } from './DigitalTicketPass';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Armchair,
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '../../context/ToastContext';

const fireConfetti = () => {
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
};

const ApplicationPending = ({ registration }) => (
  <div className="space-y-4">
    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-start gap-3">
      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
        <p className="font-bold">Your application is awaiting admin review.</p>
        <p>
          A seat is held for you. Once the admin approves your application and confirms the
          payment, your ticket pass will be issued on your dashboard.
        </p>
      </div>
    </div>

    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application ID</p>
      <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">
        {registration?.registrationId || '—'}
      </p>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        Quote this ID if you need to contact the event administrator.
      </p>
    </div>

    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
      <span className="text-slate-400">Track the status on your dashboard</span>
      <button
        onClick={() => {
          onClose();
          navigate('/student/dashboard');
        }}
        className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <span>Go to My Dashboard</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const ApplicationRejected = ({ registration }) => (
  <div className="space-y-4">
    <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl flex items-start gap-3">
      <CheckCircle2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
      <div className="text-xs text-rose-900 dark:text-rose-200 space-y-1">
        <p className="font-bold">Your application was not accepted.</p>
        {registration?.rejectReason && <p>Reason: {registration.rejectReason}</p>}
        <p>Your held seat has been released. You are welcome to apply again.</p>
      </div>
    </div>
    <div className="pt-2 flex items-center justify-end border-t border-slate-100 dark:border-slate-800 text-xs">
      <button
        onClick={() => {
          onClose();
          navigate('/events');
        }}
        className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <span>Browse other events</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const TicketIssued = ({ registration }) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
          Your seat is reserved! Keep your E-Pass handy on event day for quick QR check-in.
        </div>
      </div>

      <DigitalTicketPass registration={registration} />

      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
        <span className="text-slate-400">Stored in your Student Dashboard</span>
        <button
          onClick={() => {
            onClose();
            navigate('/student/dashboard');
          }}
          className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>Go to My Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const RegistrationModal = ({
  isOpen,
  onClose,
  registration,
  onSubmitApplication,
  eventPrice = 'Free',
  isSubmitting = false
}) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    ticketTier: 'VIP All-Access Pass',
    seating: 'Section A (Main Floor)',
    dietary: 'Vegetarian',
    specialRequirements: '',
    promoCode: '',
    discountApplied: false
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Viewing an already-issued ticket: skip straight to the pass.
  const existingTicket =
    registration && registration.status === 'Approved' && registration.paymentStatus === 'paid'
      ? registration
      : null;

  useEffect(() => {
    if (isOpen) {
      setResult(existingTicket);
      setError('');
      setFormData({
        ticketTier: 'VIP All-Access Pass',
        seating: 'Section A (Main Floor)',
        dietary: 'Vegetarian',
        specialRequirements: '',
        promoCode: '',
        discountApplied: false
      });
    }
  }, [isOpen, existingTicket]);

  useEffect(() => {
    if (result?.status === 'Approved' && result.paymentStatus === 'paid' && isOpen) fireConfetti();
  }, [result, isOpen]);

  const isFree = eventPrice === 'Free' || eventPrice === 0 || eventPrice == null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (['EARLY2026', 'STUDENT50', 'CAMPUS100'].includes(formData.promoCode.toUpperCase().trim())) {
      setFormData({ ...formData, discountApplied: true });
      showToast('100% Student Discount Applied!', 'success');
    } else {
      showToast('Invalid promo code. Try EARLY2026', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!onSubmitApplication) {
      showToast('Registration handler is unavailable.', 'error');
      return;
    }
    const reg = await onSubmitApplication(formData);
    if (reg) {
      setResult(reg);
    } else {
      setError('We could not submit your application. Please try again.');
    }
  };

  const ticketReady =
    !!result && result.status === 'Approved' && result.paymentStatus === 'paid';

  const modalTitle = result
    ? result.status === 'Rejected'
      ? 'Application Not Accepted'
      : ticketReady
        ? 'Registration Confirmed!'
        : 'Application Submitted'
    : isFree
      ? 'Register for this free event'
      : 'Apply for this event';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} maxWidth="max-w-xl">
      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Ticket Tier
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'VIP All-Access Pass', perk: 'Front Row + Delegate Dining + Swag Kit' },
                { name: 'General Admission', perk: 'Main Hall Seating + Digital E-Pass' },
                { name: 'Early Bird Student', perk: 'Reserved Seat + Certificate' },
                { name: 'Virtual Stream Pass', perk: 'HD Live Link + Virtual Chat' }
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
                <option value="Jain">Jain Meal</option>
                <option value="Gluten-Free">Gluten-Free</option>
              </select>
            </div>
          </div>

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

          {!isFree && (
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
                  Student 100% waiver applied!
                </p>
              )}
            </div>
          )}

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {isFree
                ? 'This event is free. Your ticket is issued immediately after you apply.'
                : 'Your application is reviewed by the event admin. A seat is held while it is under review, and your ticket is issued once the admin approves it and confirms the payment.'}
            </p>
          </div>

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
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : isFree ? 'Register Now' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      ) : result.status === 'Rejected' ? (
        <ApplicationRejected registration={result} />
      ) : ticketReady ? (
        <TicketIssued registration={result} />
      ) : (
        <ApplicationPending registration={result} />
      )}
    </Modal>
  );
};
