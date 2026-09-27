export const generatePassId = (year = new Date().getFullYear()) => {
  const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CC-${year}-${randomHex}`;
};

export const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const computeEventStatus = (seatsLeft) => {
  if (seatsLeft <= 0) return 'Registration Closed';
  if (seatsLeft <= 10) return 'Almost Full';
  return 'Available';
};