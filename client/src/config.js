// client/src/config.js

// Point this at your API server. In dev it'll default to localhost:5000,
// in production you can set REACT_APP_API_BASE_URL in your .env.
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
