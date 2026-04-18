// Role and category theme tokens (for dynamic classNames)

export const ROLE_THEME = {
  user: {
    name: 'user',
    label: 'User',
    primary: 'user-green',
    primaryDark: 'user-green-dark',
    primaryLight: 'user-green-light',
    bgLight: 'bg-user-green-light',
    bgSolid: 'bg-user-green',
    text: 'text-user-green',
    border: 'border-user-green',
    ring: 'ring-user-green',
    gradient: 'from-user-green to-user-green-dark',
    btn: 'btn-primary-user',
    icon: 'person',
  },
  vendor: {
    name: 'vendor',
    label: 'Vendor',
    primary: 'vendor-yellow',
    primaryDark: 'vendor-yellow-dark',
    primaryLight: 'vendor-yellow-light',
    bgLight: 'bg-vendor-yellow-light',
    bgSolid: 'bg-vendor-yellow',
    text: 'text-vendor-yellow-dark',
    border: 'border-vendor-yellow-dark',
    ring: 'ring-vendor-yellow',
    gradient: 'from-vendor-yellow to-vendor-yellow-dark',
    btn: 'btn-primary-vendor',
    icon: 'storefront',
  },
  admin: {
    name: 'admin',
    label: 'Admin',
    primary: 'admin-blue',
    primaryDark: 'admin-blue-dark',
    primaryLight: 'admin-blue-light',
    bgLight: 'bg-admin-blue-light',
    bgSolid: 'bg-admin-blue',
    text: 'text-admin-blue',
    border: 'border-admin-blue',
    ring: 'ring-admin-blue',
    gradient: 'from-admin-blue to-admin-blue-dark',
    btn: 'btn-primary-admin',
    icon: 'admin_panel_settings',
  },
};

export const CATEGORY_THEME = {
  Catering: { color: 'cat-catering', light: 'cat-catering-light', chip: 'chip-catering', icon: 'restaurant' },
  Florist: { color: 'cat-florist', light: 'cat-florist-light', chip: 'chip-florist', icon: 'local_florist' },
  Decoration: { color: 'cat-decoration', light: 'cat-decoration-light', chip: 'chip-decoration', icon: 'palette' },
  Lighting: { color: 'cat-lighting', light: 'cat-lighting-light', chip: 'chip-lighting', icon: 'lightbulb' },
};

export const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

// Color palette mapping for inline styles (since Tailwind classes must be static)
const COLOR_MAP = {
  // Category colors
  'cat-catering': '#d93025',
  'cat-catering-light': '#fce8e6',
  'cat-florist': '#0f9d58',
  'cat-florist-light': '#e6f4ea',
  'cat-decoration': '#1a73e8',
  'cat-decoration-light': '#e8f0fe',
  'cat-lighting': '#f9ab00',
  'cat-lighting-light': '#fef7e0',
  // Role colors
  'user-green': '#0f9d58',
  'user-green-light': '#e6f4ea',
  'user-green-dark': '#006e2c',
  'vendor-yellow': '#f9ab00',
  'vendor-yellow-light': '#fef7e0',
  'vendor-yellow-dark': '#956e00',
  'admin-blue': '#1a73e8',
  'admin-blue-light': '#e8f0fe',
  'admin-blue-dark': '#0058bd',
};

export const getColor = (colorName) => COLOR_MAP[colorName] || colorName;
export const getThemeStyles = (theme) => ({
  '--theme-color': getColor(theme.color),
  '--theme-light': getColor(theme.light),
});
