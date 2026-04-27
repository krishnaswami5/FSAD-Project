export const CATEGORIES = [
  { value: 'painting',    label: 'Painting' },
  { value: 'sculpture',   label: 'Sculpture' },
  { value: 'photography', label: 'Photography' },
  { value: 'digital',     label: 'Digital Art' },
  { value: 'drawing',     label: 'Drawing' },
  { value: 'mixed-media', label: 'Mixed Media' },
  { value: 'print',       label: 'Print' },
  { value: 'other',       label: 'Other' },
];

export const ROLES = ['admin', 'artist', 'curator', 'visitor'];

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt',  label: 'Oldest First' },
  { value: 'price',      label: 'Price: Low → High' },
  { value: '-price',     label: 'Price: High → Low' },
  { value: '-avgRating', label: 'Top Rated' },
  { value: '-views',     label: 'Most Viewed' },
];

export const PRICE_RANGES = [
  { label: 'All', min: '', max: '' },
  { label: 'Under $1k', min: 0, max: 1000 },
  { label: '$1k–$3k', min: 1000, max: 3000 },
  { label: '$3k–$6k', min: 3000, max: 6000 },
  { label: '$6k+', min: 6000, max: '' },
];

export const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@gallery.com', password: 'Admin@123', color: 'text-red-400' },
  { role: 'Artist', email: 'artist@gallery.com', password: 'Artist@123', color: 'text-primary-400' },
  { role: 'Curator', email: 'curator@gallery.com', password: 'Curator@123', color: 'text-blue-400' },
  { role: 'Visitor', email: 'visitor@gallery.com', password: 'Visitor@123', color: 'text-green-400' },
];

export const STRIPE_TEST_CARD = '4242 4242 4242 4242';

export const NAV_LINKS = [
  { path: '/', label: 'Home', public: true },
  { path: '/artworks', label: 'Artworks', public: true },
  { path: '/virtual-tour', label: 'Virtual Tour', public: true },
  { path: '/dashboard', label: 'Dashboard', public: false },
  { path: '/cart', label: 'Cart', public: false },
];

export const ROOM_COLORS = [
  { label: 'Deep Navy', value: '#0a0a1e' },
  { label: 'Forest', value: '#0a1a0a' },
  { label: 'Warm Earth', value: '#1a1209' },
  { label: 'Gallery White', value: '#f8f8f5' },
  { label: 'Dark Gallery', value: '#1a1a26' },
  { label: 'Burgundy', value: '#1a0a0a' },
];
