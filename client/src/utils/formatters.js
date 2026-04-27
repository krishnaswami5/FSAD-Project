// Currency
export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

// Date
export const formatDate = (date, options = {}) =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', ...options }).format(new Date(date));

export const formatRelative = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = now - d;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  if (diff < minute) return 'just now';
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < week) return `${Math.floor(diff / day)}d ago`;
  return formatDate(date, { month: 'short', day: 'numeric' });
};

// Role badge color
export const getRoleBadge = (role) => {
  const map = { admin: 'badge-danger', artist: 'badge-primary', curator: 'badge-info', visitor: 'badge-success' };
  return map[role] || 'badge-info';
};

// Status badge
export const getStatusBadge = (status) => {
  const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger', sold: 'badge-info', paid: 'badge-success', cancelled: 'badge-danger' };
  return map[status] || 'badge-info';
};

// Truncate
export const truncate = (str, n = 100) => str.length > n ? str.slice(0, n) + '...' : str;

// Avatar initials
export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

// Number format short
export const formatNumber = (n) => {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
};
