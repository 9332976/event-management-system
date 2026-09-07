import React from 'react';
import { Clock, CheckCircle, Sparkles } from 'lucide-react';

export const EventScheduleTimeline = ({ schedule = [] }) => {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl text-xs text-slate-500">
        Detailed event schedule will be posted soon.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900/60">
      {schedule.map((item, index) => (
        <div key={index} className="relative group">
          {/* Node dot */}
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-400 group-hover:scale-125 transition-transform flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition-all shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg">
                <Clock className="w-3 h-3" />
                {item.time}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Phase {index + 1}
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
              {item.title}
            </h4>
            
            {item.desc && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {item.desc}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
