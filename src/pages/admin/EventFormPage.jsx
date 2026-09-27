import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, Save, IndianRupee, Image as ImageIcon, Info, FolderTree } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Arts & Humanities',
  'Science',
  'Student Affairs',
];

const emptyForm = {
  title: '',
  category: '',
  description: '',
  date: '',
  time: '10:00 AM',
  endTime: '04:00 PM',
  venue: '',
  type: 'Offline',
  maxParticipants: 100,
  priceAmount: 0,
  banner: '',
  department: 'Computer Science & Engineering',
  eligibility: 'Open to all enrolled students.',
  registrationDeadline: '',
  isFeatured: false,
  tags: [],
  prizes: 'Certificates & Mementos',
  rules: ['College ID card is mandatory.', 'Follow campus conduct regulations.'],
  schedule: [],
};

export const EventFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { events, categories, createEvent, updateEvent, loading } = useEvents();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [ruleInput, setRuleInput] = useState('');
  const [scheduleItem, setScheduleItem] = useState({ time: '', title: '', desc: '' });

  useEffect(() => {
    if (!isEdit) return;
    const existing = events.find((e) => e.id === id);
    if (!existing) return;
    setForm({
      title: existing.title || '',
      category: existing.category || '',
      description: existing.description || '',
      date: existing.date ? String(existing.date).slice(0, 10) : '',
      time: existing.time || '10:00 AM',
      endTime: existing.endTime || '04:00 PM',
      venue: existing.venue || '',
      type: existing.type || 'Offline',
      maxParticipants: existing.maxParticipants || 100,
      priceAmount: existing.priceAmount || 0,
      banner: existing.banner || '',
      department: existing.department || DEPARTMENTS[0],
      eligibility: existing.eligibility || '',
      registrationDeadline: existing.registrationDeadline ? String(existing.registrationDeadline).slice(0, 10) : '',
      isFeatured: Boolean(existing.isFeatured),
      tags: existing.tags || [],
      prizes: existing.prizes || '',
      rules: existing.rules || [],
      schedule: existing.schedule || [],
    });
  }, [isEdit, id, events]);

  const priceLabel = useMemo(
    () => (Number(form.priceAmount) > 0 ? `Rs.${Number(form.priceAmount)}` : 'Free'),
    [form.priceAmount]
  );

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (form.tags.includes(v)) {
      setTagInput('');
      return;
    }
    setForm((prev) => ({ ...prev, tags: [...prev.tags, v] }));
    setTagInput('');
  };

  const removeTag = (tag) => setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));

  const addRule = () => {
    const v = ruleInput.trim();
    if (!v) return;
    setForm((prev) => ({ ...prev, rules: [...prev.rules, v] }));
    setRuleInput('');
  };

  const removeRule = (idx) => setForm((prev) => ({ ...prev, rules: prev.rules.filter((_, i) => i !== idx) }));

  const addScheduleItem = () => {
    if (!scheduleItem.time || !scheduleItem.title) {
      showToast('Add a time and title for the schedule item.', 'warning');
      return;
    }
    setForm((prev) => ({ ...prev, schedule: [...prev.schedule, scheduleItem] }));
    setScheduleItem({ time: '', title: '', desc: '' });
  };

  const removeScheduleItem = (idx) =>
    setForm((prev) => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.category || !form.date) {
      showToast('Title, category and date are required.', 'warning');
      return;
    }
    if (Number(form.maxParticipants) < 1) {
      showToast('Max participants must be at least 1.', 'warning');
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      priceAmount: Number(form.priceAmount) || 0,
      maxParticipants: Number(form.maxParticipants) || 0,
      price: priceLabel,
      registrationDeadline: form.registrationDeadline || form.date,
    };

    const result = isEdit ? await updateEvent(id, payload) : await createEvent(payload);
    setSaving(false);

    if (result) {
      navigate('/admin/events');
    }
  };

  if (isEdit && loading && events.length === 0) {
    return <div className="py-20 text-center text-sm text-slate-400">Loading event...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            {isEdit ? 'Edit Event' : 'Create Event'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Events publish immediately and appear on the public site.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Event'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: core details */}
        <div className="lg:col-span-2 space-y-5">
          <Panel title="Event Details">
            <Field label="Event Title" required>
              <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. InnovateX 2026 Hackathon" className={inputCls} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required>
                <select value={form.category} onChange={set('category')} className={inputCls}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Link
                  to="/admin/categories"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5"
                >
                  <FolderTree className="w-3.5 h-3.5" />
                  <span>Manage categories</span>
                </Link>
              </Field>

              <Field label="Department">
                <select value={form.department} onChange={set('department')} className={inputCls}>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={set('description')}
                rows={5}
                placeholder="Describe what students can expect at this event..."
                className={`${inputCls} resize-y`}
              />
            </Field>

            <Field label="Banner Image URL" hint="Paste an image URL to use as the event banner.">
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  value={form.banner}
                  onChange={set('banner')}
                  placeholder="https://images.unsplash.com/..."
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>
            {form.banner && (
              <img
                src={form.banner}
                alt="Banner preview"
                className="mt-2 w-full h-40 object-cover rounded-2xl border border-slate-200 dark:border-slate-800"
              />
            )}
          </Panel>

          <Panel title="Date, Time & Venue">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Event Date" required>
                <input type="date" value={form.date} onChange={set('date')} className={inputCls} />
              </Field>
              <Field label="Registration Deadline">
                <input type="date" value={form.registrationDeadline} onChange={set('registrationDeadline')} className={inputCls} />
              </Field>
              <Field label="Start Time">
                <input type="text" value={form.time} onChange={set('time')} placeholder="10:00 AM" className={inputCls} />
              </Field>
              <Field label="End Time">
                <input type="text" value={form.endTime} onChange={set('endTime')} placeholder="04:00 PM" className={inputCls} />
              </Field>
              <Field label="Venue" hint="Free text - venues are no longer a separate managed resource.">
                <input type="text" value={form.venue} onChange={set('venue')} placeholder="e.g. Main Auditorium" className={inputCls} />
              </Field>
              <Field label="Mode">
                <select value={form.type} onChange={set('type')} className={inputCls}>
                  {['Offline', 'Online', 'Hybrid'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel title="Tags, Rules & Schedule">
            <Field label="Tags">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Type a tag and press Enter"
                  className={inputCls}
                />
                <button type="button" onClick={addTag} className="px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="hover:text-rose-500">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            <Field label="Eligibility">
              <input type="text" value={form.eligibility} onChange={set('eligibility')} className={inputCls} />
            </Field>

            <Field label="Prizes">
              <input type="text" value={form.prizes} onChange={set('prizes')} className={inputCls} />
            </Field>

            <Field label="Rules">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ruleInput}
                  onChange={(e) => setRuleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRule();
                    }
                  }}
                  placeholder="Add a rule and press Enter"
                  className={inputCls}
                />
                <button type="button" onClick={addRule} className="px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Add
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {form.rules.map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl">
                    <span>{r}</span>
                    <button type="button" onClick={() => removeRule(i)} className="text-slate-400 hover:text-rose-500 shrink-0">
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </Field>

            <Field label="Schedule">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={scheduleItem.time}
                  onChange={(e) => setScheduleItem((p) => ({ ...p, time: e.target.value }))}
                  placeholder="10:00 AM"
                  className={inputCls}
                />
                <input
                  type="text"
                  value={scheduleItem.title}
                  onChange={(e) => setScheduleItem((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Session title"
                  className={`${inputCls} sm:col-span-1`}
                />
                <input
                  type="text"
                  value={scheduleItem.desc}
                  onChange={(e) => setScheduleItem((p) => ({ ...p, desc: e.target.value }))}
                  placeholder="Short description"
                  className={inputCls}
                />
                <button type="button" onClick={addScheduleItem} className="px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Add
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {form.schedule.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl">
                    <div>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{s.time}</span>
                      <span className="text-slate-700 dark:text-slate-200 font-semibold ml-2">{s.title}</span>
                      {s.desc && <span className="text-slate-400 ml-2">{s.desc}</span>}
                    </div>
                    <button type="button" onClick={() => removeScheduleItem(i)} className="text-slate-400 hover:text-rose-500 shrink-0">
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </Field>
          </Panel>
        </div>

        {/* Right: pricing & capacity */}
        <div className="space-y-5">
          <Panel title="Capacity & Pricing">
            <Field label="Max Participants" required>
              <input type="number" min={1} value={form.maxParticipants} onChange={set('maxParticipants')} className={inputCls} />
            </Field>

            <Field label="Entry Fee (Rs.)" hint="Set 0 for a free event. Students enrol unpaid and you mark each registration paid.">
              <div className="relative">
                <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min={0}
                  value={form.priceAmount}
                  onChange={set('priceAmount')}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>

            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">
                Price shown publicly: <strong>{priceLabel}</strong>
              </span>
            </div>
          </Panel>

          <Panel title="Visibility">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Feature this event on the home page</span>
            </label>
          </Panel>
        </div>
      </div>
    </form>
  );
};

const inputCls =
  'w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors placeholder:text-slate-400';

const Panel = ({ title, children }) => (
  <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-5 sm:p-6 space-y-4">
    <h2 className="text-sm font-extrabold font-display text-slate-900 dark:text-white">{title}</h2>
    {children}
  </section>
);

const Field = ({ label, hint, required, children }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
      {label}
      {required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 mt-1.5">{hint}</p>}
  </div>
);
