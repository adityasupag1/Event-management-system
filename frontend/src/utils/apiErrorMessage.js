import toast from 'react-hot-toast';

/** Message for axios errors (CORS/network often have no response body). */
export function apiErrorMessage(error, fallback) {
  const fromServer = error.response?.data?.message;
  if (fromServer) return fromServer;
  if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
    return 'Cannot reach the API. Confirm the backend is up, or redeploy the frontend so /api is proxied (Netlify) / check VITE_API_URL.';
  }
  return fallback;
}

/** One toast at a time for auth forms (avoids stacked duplicates from Strict Mode / double submit). */
export function toastAuthFormError(error, fallback) {
  toast.error(apiErrorMessage(error, fallback), { id: 'eventms-auth-form' });
}
