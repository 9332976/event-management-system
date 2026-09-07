import React from 'react';
import { Sparkles, RefreshCw, CalendarX, BookmarkX, SearchX, BellOff } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = "No results found",
  description = "Try adjusting your search query, filter criteria, or check back later.",
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-14 px-6 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
