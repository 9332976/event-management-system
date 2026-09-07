import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-soft animate-pulse flex flex-col h-[420px]">
      <div className="h-48 bg-slate-200 dark:bg-slate-800 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
      <div className="h-14 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800" />
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 bg-slate-200 dark:bg-slate-800 rounded"
                style={{ width: `${Math.floor(60 / cols) + 10}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
