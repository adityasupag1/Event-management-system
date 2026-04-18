import axios from 'axios';

const bakedApiOrigin = import.meta.env.VITE_API_URL;

// On *.netlify.app, always use same-origin `/api` so Netlify can proxy (see public/_redirects).
// Ignores a wrongly set VITE_API_URL at build time, which would call Render directly and hit CORS.
const isNetlifyAppHost =
  typeof window !== 'undefined' && /\.netlify\.app$/i.test(window.location.hostname);

const useDirectApi =
  !isNetlifyAppHost &&
  typeof bakedApiOrigin === 'string' &&
  bakedApiOrigin.trim() !== '';

const baseURL = useDirectApi
  ? `${bakedApiOrigin.replace(/\/$/, '')}/api`
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
