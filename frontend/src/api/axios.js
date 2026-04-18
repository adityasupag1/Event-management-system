import axios from 'axios';

// Default: same-origin `/api` — Vite dev server proxies it (vite.config.js); Netlify rewrites it (netlify.toml).
// Set VITE_API_URL only if the frontend is hosted somewhere without a proxy (then the API must allow that origin in CORS).
const explicitBase = import.meta.env.VITE_API_URL;
const baseURL = explicitBase
  ? `${String(explicitBase).replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eventms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('eventms_token');
      localStorage.removeItem('eventms_user');
      // soft redirect only if not already on an auth page
      const p = window.location.pathname;
      if (!p.startsWith('/login') && !p.startsWith('/signup') && p !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
