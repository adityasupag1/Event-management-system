import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
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
