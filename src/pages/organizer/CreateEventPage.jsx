import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Zap,
  Bookmark
} from 'lucide-react';
import { mockEventTemplates } from '../../data/mockTemplates';

export const CreateEventPage = () => {
  const { createEvent, categories } = useEvents();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'hackathon',
    type: 'Offline',
    date: '2026-10-10',
    time: '10:00 AM',
    endTime: '05:00 PM',
    venue: '',
    department: currentUser?.department || 'Computer Science & Engineering',
    registrationDeadline: '2026-10-05',
    maxParticipants: 150,
    price: 'Free',
    prizes: '₹50,000 Cash Pool + Merit Certificates',
    eligibility: 'Open to all undergraduate & postgraduate students.',
    description: '',
    rules: [
      'Participants must present a valid college ID card.',
      'Maintain campus safety and event decorum at all times.'
    ],
    banner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
    isFeatured: true
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [newRule, setNewRule] = useState('');

  const handleApplyTemplate = (tpl) => {
    setSelectedTemplateId(tpl.id);
    setFormData({
      ...formData,
      title: tpl.name,
      category: tpl.category,
      type: tpl.type === 'Hackathon' || tpl.type === 'Concert' || tpl.type === 'Wedding / Reception' ? 'Offline' : 'Hybrid',
      venue: tpl.defaultVenue,
      maxParticipants: tpl.suggestedCapacity,
      price: tpl.price,
      prizes: tpl.prizes,
      description: tpl.description,
      rules: tpl.suggestedRules,
      banner: tpl.banner
    });
    showToast(`Loaded ${tpl.type} template format!`, 'success');
  };

  const bannerPresets = [
    { label: 'Hackathon & Tech', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Cultural & Music', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80' },
    { label: 'AI & Workshop', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Robotics & Arena', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80' },
    { label: 'Sports & League', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80' },
  ];

  const handleAddRule = (e) => {
    e.preventDefault();
    if (newRule.trim()) {
      setFormData({ ...formData, rules: [...formData.rules, newRule.trim()] });
      setNewRule('');
    }
  };

  const handleRemoveRule = (idx) => {
    setFormData({
      ...formData,
      rules: formData.rules.filter((_, i) => i !== idx)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.venue || !formData.description) {
      showToast('Please fill in all mandatory fields.', 'error');
      return;
    }

    const created = createEvent(formData, currentUser);
    navigate(`/events/${created.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/organizer/events"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Host a New Campus Event
            </h1>
            <p className="text-xs text-slate-400">
              Publish competitions, workshops, festivals, and track registrations instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Template Selector */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/30 rounded-3xl p-6 border border-indigo-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Quick Setup with Predefined Formats ({mockEventTemplates.length} Templates)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
            Click to auto-populate configuration
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {mockEventTemplates.map((tpl) => {
            const isSelected = selectedTemplateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                    : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <p className="text-[11px] font-bold truncate">
                  {tpl.type}
                </p>
                <p className={`text-[9px] mt-0.5 truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {tpl.defaultVenue.split('&')[0]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Event Overview & Configuration
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Apex Coding Championship 2026"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Format
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Offline">In-Person (Offline)</option>
                <option value="Online">Virtual (Online)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pricing / Entry
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Free or ₹100"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the schedule, themes, expectations, and benefits..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              required
            />
          </div>
        </div>

        {/* Date, Time & Venue */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Schedule & Venue
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="10:00 AM"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                End Time
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="05:00 PM"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Venue Location *
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g. Computing Lab 4, Tech Block B"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Banner Selection */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            3. Event Banner Preview
          </h3>

          <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img
              src={formData.banner}
              alt="Preview banner"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select High-Res Preset Banner:
            </p>
            <div className="flex flex-wrap gap-2">
              {bannerPresets.map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, banner: b.url })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    formData.banner === b.url
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rules & Guidelines */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-display text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            4. Rules & Guidelines
          </h3>

          <div className="space-y-2">
            {formData.rules.map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                <span>{rule}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRule(idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add another event guideline or rule..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddRule}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition-colors"
            >
              Add Rule
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Link
            to="/organizer/events"
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Event Live</span>
          </button>
        </div>

      </form>

    </div>
  );
};
