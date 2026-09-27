import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { useToast } from '../../context/ToastContext';
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Check,
  FolderTree,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';

const ICON_CHOICES = ['Sparkles', 'Code2', 'Microscope', 'Trophy', 'Music', 'Palette', 'Rocket', 'Users'];
const COLOR_CHOICES = [
  { label: 'Indigo', value: 'from-indigo-500 to-purple-600' },
  { label: 'Emerald', value: 'from-emerald-500 to-teal-600' },
  { label: 'Amber', value: 'from-amber-500 to-orange-600' },
  { label: 'Rose', value: 'from-rose-500 to-pink-600' },
  { label: 'Sky', value: 'from-sky-500 to-cyan-600' },
];

const EMPTY_FORM = { name: '', description: '', icon: 'Sparkles', color: COLOR_CHOICES[0].value };

export const AdminCategoriesPage = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory, refreshCategories } =
    useEvents();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busySlug, setBusySlug] = useState(null);
  const [confirmSlug, setConfirmSlug] = useState(null);

  // The provider already loads categories; keep the count badges fresh after a page visit.
  useEffect(() => {
    refreshCategories();
  }, [refreshCategories]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'Sparkles',
      color: cat.color || COLOR_CHOICES[0].value,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Category name is required.', 'error');
      return;
    }
    setSaving(true);
    const result = editing
      ? await updateCategory(editing.slug, form)
      : await addCategory(form);
    setSaving(false);
    if (result) {
      setModalOpen(false);
      refreshCategories();
    }
  };

  const handleDelete = async (cat) => {
    setBusySlug(cat.slug);
    const res = await deleteCategory(cat.slug);
    setBusySlug(null);
    setConfirmSlug(null);
    if (res) refreshCategories();
  };

  const totalEvents = categories.reduce((sum, c) => sum + (c.eventCount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
            Event Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Categories control how events are grouped and filtered. Renaming a category keeps its
            link to existing events intact.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Events Categorised" value={totalEvents} />
        <StatCard
          label="Unused Categories"
          value={categories.filter((c) => (c.eventCount || 0) === 0).length}
        />
      </div>

      {loading ? (
        <div className="h-40 rounded-3xl bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Create your first category so events can be grouped on the public events page."
          actionText="Create Category"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br ${cat.color} text-white text-sm font-bold shadow-sm`}
                  >
                    {cat.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-3 text-sm font-extrabold font-display text-slate-900 dark:text-white truncate">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 truncate">/{cat.slug}</p>
                </div>
                <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {cat.eventCount || 0} event{(cat.eventCount || 0) === 1 ? '' : 's'}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
                {cat.description || 'No description provided.'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setConfirmSlug(cat.slug)}
                  disabled={(cat.eventCount || 0) > 0}
                  title={
                    (cat.eventCount || 0) > 0
                      ? 'Move the events in this category before deleting it'
                      : 'Delete category'
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit "${editing.name}"` : 'New Category'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Technical Workshops"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
            />
            {editing && (
              <p className="text-[10px] text-slate-400 mt-1">
                Slug stays as <span className="font-mono">/{editing.slug}</span> so current events keep
                pointing to this category.
              </p>
            )}
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Short description shown on the events page."
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Icon
              </label>
              <select
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                {ICON_CHOICES.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Accent Colour
              </label>
              <select
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                {COLOR_CHOICES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={!!confirmSlug}
        onClose={() => setConfirmSlug(null)}
        title="Delete Category"
        maxWidth="max-w-md"
      >
        {confirmSlug && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-rose-900 dark:text-rose-200">
                This will permanently delete{' '}
                <strong>{categories.find((c) => c.slug === confirmSlug)?.name}</strong>. This action
                cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmSlug(null)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(categories.find((c) => c.slug === confirmSlug))}
                disabled={busySlug === confirmSlug}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30"
              >
                {busySlug === confirmSlug ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <div className="text-center">
        <Link
          to="/admin/events/new"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Create an event using these categories</span>
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft p-4">
    <p className="text-lg font-extrabold font-display text-slate-900 dark:text-white leading-tight">{value}</p>
    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 truncate">{label}</p>
  </div>
);
