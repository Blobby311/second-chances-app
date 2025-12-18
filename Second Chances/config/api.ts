// Base URL for the backend API.
// In development you can override this with EXPO_PUBLIC_API_BASE_URL,
// but by default we point to the deployed Render backend so that
// physical devices (like your tablet) can reach the server.
export const API_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://second-chances-app.onrender.com';

