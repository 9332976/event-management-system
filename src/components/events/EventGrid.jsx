import React from 'react';
import { EventCard } from './EventCard';
import { EventCardSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';
import { CalendarX } from 'lucide-react';

export const EventGrid = ({
  events = [],
  loading = false,
  onRegisterClick,
  onResetFilters,
  emptyTitle = "No events match your criteria",
  emptyDescription = "Try clearing some filters or search for another keyword to discover more campus events."
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title={emptyTitle}
        description={emptyDescription}
        actionText={onResetFilters ? "Clear All Filters" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegisterClick={onRegisterClick}
        />
      ))}
    </div>
  );
};
