import axios from 'axios';

const bakedApiOrigin = import.meta.env.VITE_API_URL;
// Set on Vercel’s build machines; baked into the client bundle for that deploy.
const builtOnVercel = import.meta.env.VERCEL === '1' || import.meta.env.VERCEL === 'true';

// Same-origin `/api` — proxied by Netlify (public/_redirects), Vercel (vercel.json), or Vite dev server.
// On *.netlify.app / *.vercel.app (or any Vercel build), ignore VITE_API_URL so we never call Render from the browser and hit CORS.
const isNetlifyAppHost =
  typeof window !== 'undefined' && /\.netlify\.app$/i.test(window.location.hostname);
const isVercelAppHost =
  typeof window !== 'undefined' && /\.vercel\.app$/i.test(window.location.hostname);

const forceRelativeApi =
  import.meta.env.DEV ||
  builtOnVercel ||
  isNetlifyAppHost ||
  isVercelAppHost;

const useDirectApi =
  !forceRelativeApi &&
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
