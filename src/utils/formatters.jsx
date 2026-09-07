import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Trophy, 
  BookOpen, 
  Presentation, 
  Terminal, 
  Target, 
  Users,
  Calendar,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';

export const getCategoryIcon = (categorySlug, className = "w-4 h-4") => {
  switch (categorySlug?.toLowerCase()) {
    case 'cultural':
      return <Sparkles className={className} />;
    case 'technical':
      return <Cpu className={className} />;
    case 'sports':
      return <Trophy className={className} />;
    case 'workshop':
      return <BookOpen className={className} />;
    case 'seminar':
      return <Presentation className={className} />;
    case 'hackathon':
      return <Terminal className={className} />;
    case 'competition':
      return <Target className={className} />;
    case 'club-activities':
    case 'clubs':
      return <Users className={className} />;
    default:
      return <Tag className={className} />;
  }
};

export const getCategoryBadgeStyle = (categorySlug) => {
  switch (categorySlug?.toLowerCase()) {
    case 'cultural':
      return 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300 border-pink-200 dark:border-pink-800/60';
    case 'technical':
      return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
    case 'sports':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    case 'workshop':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    case 'seminar':
      return 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border-sky-200 dark:border-sky-800/60';
    case 'hackathon':
      return 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 border-violet-200 dark:border-violet-800/60';
    case 'competition':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
    case 'club-activities':
    default:
      return 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border-teal-200 dark:border-teal-800/60';
  }
};

export const getStatusBadgeStyle = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
    case 'confirmed':
    case 'approved':
    case 'active':
    case 'present':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
    case 'almost full':
    case 'pending':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    case 'registration closed':
    case 'cancelled':
    case 'rejected':
    case 'absent':
    case 'deactivated':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
    case 'completed':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
