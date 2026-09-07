import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Bookmark, Users, ArrowRight, CheckCircle, Tag } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { getCategoryBadgeStyle, getStatusBadgeStyle } from '../../utils/formatters';

export const EventCard = ({ event, onRegisterClick }) => {
  const { isBookmarked, toggleBookmark, getRegistration } = useEvents();
  const { currentUser, currentRole } = useAuth();
  const navigate = useNavigate();

  const bookmarked = isBookmarked(event.id);
  const registration = getRegistration(event.id);
  const isRegistered = !!registration;
  const isClosed = event.status === 'Registration Closed' || event.seatsLeft <= 0;

  const occupancyPercent = Math.min(
    100,
    Math.round((event.registeredCount / (event.maxParticipants || 100)) * 100)
  );

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all duration-300 flex flex-col h-full">
      
      {/* Banner & Floating Badges */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${getCategoryBadgeStyle(event.category)}`}>
            {event.categoryLabel}
          </span>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(event.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 ${
              bookmarked
                ? 'bg-rose-500 text-white shadow-rose-500/30'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900'
            }`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark event'}
            title={bookmarked ? 'Saved' : 'Save event'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner Info (Price / Mode) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white z-10">
          <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20">
            {event.type}
          </span>
          <span className="font-bold text-emerald-400 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-lg border border-white/20">
            {event.price}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2.5">
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {event.formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-normal">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </span>
          </div>

          {/* Title */}
          <Link to={`/events/${event.id}`}>
            <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
              {event.title}
            </h3>
          </Link>

          {/* Venue & Organizer */}
          <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">By {event.organizer?.club || event.organizer?.name}</span>
            </div>
          </div>
        </div>

        {/* Capacity & Actions */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* Seats progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>{event.registeredCount} registered</span>
              <span className={event.seatsLeft <= 10 && event.seatsLeft > 0 ? 'text-amber-500 font-bold' : ''}>
                {event.seatsLeft > 0 ? `${event.seatsLeft} seats left` : 'Sold out'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  occupancyPercent > 90
                    ? 'bg-rose-500'
                    : occupancyPercent > 70
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/events/${event.id}`}
              className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Details
            </Link>

            {isRegistered ? (
              <Link
                to="/student/registrations"
                className="flex-1 py-2 px-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Registered</span>
              </Link>
            ) : isClosed ? (
              <button
                disabled
                className="flex-1 py-2 px-3 text-center text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800/40 rounded-xl cursor-not-allowed"
              >
                Closed
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onRegisterClick) {
                    onRegisterClick(event);
                  } else {
                    navigate(`/events/${event.id}`);
                  }
                }}
                className="flex-1 py-2 px-3 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
