import React from 'react';
import { getStatusBadgeStyle } from '../../utils/formatters';

export const StatusBadge = ({ status, className = "" }) => {
  const badgeStyle = getStatusBadgeStyle(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${badgeStyle} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {status}
    </span>
  );
};
