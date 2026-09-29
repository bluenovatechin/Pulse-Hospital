// Where the booking API lives.
// - Local development: leave VITE_API_URL unset; Vite forwards /api to localhost:5000.
// - GitHub Pages: set VITE_API_URL to the hosted server, e.g. https://pulse-hospital-api.onrender.com
export const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
