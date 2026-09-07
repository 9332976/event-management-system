import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calendar, MapPin, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { getCategoryBadgeStyle } from '../../utils/formatters';

export const QuickSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { events, categories } = useEvents();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredEvents = query.trim() === '' ? [] : events.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
    e.tags?.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    e.venue.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredCategories = query.trim() === '' ? [] : categories.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const handleSelectEvent = (id) => {
    navigate(`/events/${id}`);
    onClose();
  };

  const handleSelectCategory = (slug) => {
    navigate(`/events?category=${slug}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-20 sm:pt-28">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        />

        {/* Search Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <Search className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by event name, category, workshop topic, or club..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2 py-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {query.trim() === '' ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Quick Event Discovery
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Type to search across 16+ collegiate events, clubs, hackathons, and cultural fests.
                </p>

                {/* Popular suggestions */}
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {['Hackathon', 'Cultural Fest', 'AI Workshop', 'Cricket', 'Robotics'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Events Matches */}
                {filteredEvents.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                      Events ({filteredEvents.length})
                    </h4>
                    <div className="space-y-1.5">
                      {filteredEvents.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => handleSelectEvent(evt.id)}
                          className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={evt.banner}
                              alt={evt.title}
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {evt.title}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-slate-400" />
                                  {evt.formattedDate}
                                </span>
                                <span className="flex items-center gap-1 truncate">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {evt.venue}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeStyle(evt.category)}`}>
                              {evt.categoryLabel}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories Matches */}
                {filteredCategories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                      Categories
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredCategories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => handleSelectCategory(cat.slug)}
                          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 cursor-pointer border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Tag className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {cat.count} events
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredEvents.length === 0 && filteredCategories.length === 0 && (
                  <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No matching events found for "<span className="font-semibold text-slate-800 dark:text-slate-200">{query}</span>"
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Press Enter to select</span>
            <span>CampusConnect Search Engine</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
