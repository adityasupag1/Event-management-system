/** Message for axios errors (CORS/network often have no response body). */
export function apiErrorMessage(error, fallback) {
  const fromServer = error.response?.data?.message;
  if (fromServer) return fromServer;
  if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
    return 'Cannot reach the API (network or CORS). Redeploy the backend with an updated CORS allow list, or check the browser console Network tab.';
  }
  return fallback;
}
