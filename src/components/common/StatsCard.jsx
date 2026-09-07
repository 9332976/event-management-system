import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = "vs last month",
  color = "indigo",
  subtitle
}) => {
  const colorMap = {
    indigo: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    purple: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1.5">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colorMap[color] || colorMap.indigo}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs">
          {Number(trend) >= 0 ? (
            <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +{trend}%
            </span>
          ) : (
            <span className="flex items-center text-rose-600 dark:text-rose-400 font-semibold">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              {trend}%
            </span>
          )}
          <span className="text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};
